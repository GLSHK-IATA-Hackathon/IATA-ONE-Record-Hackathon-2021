function checkFlightNoFormat(s) {
    //var regExp1 = /^[a-zA-Z]{2}[0-9]{3}$/;
    //var regExp2 = /^[a-zA-Z]{2}[0-9]{4}[a-zA-Z]?$/;
    //return regExp1.test(s) || regExp2.test(s);

    // 20191125, fix on issue 27842 with actual flight number format checking
    var regExp = /^([a-zA-Z]{2}|[a-zA-Z][0-9]|[0-9][a-zA-Z])([0-9]{3}[0-9]?[A-Za-z]?)$/;
    return regExp.test(s);
}

/*
Inputs: strInputData - String to be verified
'            strDateType  - Data type of the validation
'                C :- char by char validation
'                I :- integer
'                F :- floating point
'                D :- date/time (reserved for future use)
'            strSyntax    - Syntax for validation, diff. for each data type
'                For DataType "C":
'                    A(a) is Upper Alphabetic
'                    N(n) is Numeric
'                    M(m) is Mixed with Upper Alphabetic & Numeric
'                    T(t) is Free Text Format 1 (AlphaNumeric & "-. ")
'                    F(f) is Free Text Format 2 (AlphaNumeric & "-. ,/():;&'")
'                    X(x) is Free Text Format 3 (printable char: ascii 32-126)
'                    U(u) is Free Text Format 4 (AlphaNumeric & "-./ ") (for #21440)
'                    X2(x) is Free Text Format 5 (printable char: ascii 32-126 except "/")
'                    capital letter is mandatory input
'                    small letter is optional input
'                    /NUMBER is repeat format character before (eg. A/3 = AAA)
'                For DataType "I" & "F":
'                    "Madatory|Min|Max"
'                For DataType "D":
'                    "Madatory|DateFormat"
'                    where DateFormat is "d/m/y" or "m/d/y" or "y/m/d"
'
' Returns  : True/False for valid/invalid format
'
' Example  :
'    For fix length char field (eg. airport code, country code)
'            CHF_String_IsFormat("HKG", "C", "T/3")
'    For var length char field (eg. name)
'            CHF_String_IsFormat("TRAXON", "C", "Tt/8")
'    For fix length number field (eg. waybill number)
'            CHF_String_IsFormat("00000011", "C", "N/8")
'    For alpha-numeric field (eg. flight number)
'            CHF_String_IsFormat("CX500", "C", "AANNNm")
'    For var length free text field (eg. address, description)
'            CHF_String_IsFormat("anything", "C", "f/65")

'    For mandatory integer field (eg. piece)
'            CHF_String_IsFormat("168", "I", "M|0|9999")
'    For optional floating number field (eg. weight)
'            CHF_String_IsFormat("72.5", "F", "O|0.5|9999999")
'
'    For date field (eg. flight date)
'            CHF_String_IsFormat("05/12/01", "D", "M|d/m/y")
*/

function stringFormatChecker() {
    //A is Upper Alphabetic
    this.checkFormatA = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[A-Z]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //N is Numeric
    this.checkFormatN = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[0-9]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //M is Mixed with Upper Alphabetic & Numeric
    this.checkFormatM = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[A-Z0-9]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //T is Free Text Format 1 (AlphaNumeric & "-. ")
    this.checkFormatT = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[A-Za-z0-9 .\\-]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //F is Free Text Format 2 (AlphaNumeric & " ():;&.,-/'")
    this.checkFormatF = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[A-Za-z0-9 ():;&.,\\-\\/\']{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //X is Free Text Format 3 (printable char: ascii 32-126)
    this.checkFormatX = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[ -~]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    // U is Free Text Format 4 (AlphaNumeric & "-. /")
    this.checkFormatU = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[A-Za-z0-9 .\\-\\/]{' + lengthReg + '}$');
        return regExp.test(text);
    }

    //X2 is Free Text Format 5 (printable char: ascii 32-126 except "/")
    this.checkFormatX2 = function (text, minLength, maxLength) {
        var lengthReg = getLengthReg(minLength, maxLength);
        var regExp = new RegExp('^[ -~]{' + lengthReg + '}$');
        var regExp2 = new RegExp('\/')
        return regExp.test(text) && !regExp2.test(text);
    }

    this.checkInteger = function (mandatory, text, minValue, maxValue) {
        if (text || text == 0)
            text = text.toString();

        if (isStartWith(text, 0) && text != "0") {
            return false;
        }

        if (mandatory) {
            var regExp = new RegExp('^[0-9]{1,}$');

            if (!regExp.test(text))
                return false;
        }
        else {
            var regExp = new RegExp('^[0-9]{0,}$');

            if (!!!text)
                return true;
            else if (!regExp.test(text))
                return false;
        }

        if ((!minValue || text >= minValue) && (!maxValue || text <= maxValue))
            return true;
        else
            return false;
    }

    //default 3d.p. acceptable
    this.checkFloat = function (mandatory, text, minValue, maxValue, allowedDP) {
        if (text || text == 0)
            text = text.toString();

        if ((isStartWith(text, "0") && !isStartWith(text, "0.")) && text != "0") {
            return false;
        }

        var defaultDP = 3;

        if (allowedDP)
            defaultDP = allowedDP;

        var countDot = text.split(".").length - 1;
        var regExp = new RegExp('^(([0-9]{1,})?(\.[0-9]{0,' + defaultDP + '}))$');
 
        if (mandatory) {
            if (!regExp.test(text) || countDot > 1 || text == '.')
                return false;
        }
        else {
            if (!!!text)
                return true;
            else if (!regExp.test(text) || countDot > 1 || text == '.')
                return false;
        }

        if ((!minValue || parseFloat(text) >= minValue) && (!maxValue || parseFloat(text) <= maxValue))
            return true;
        else
            return false;
    }

    this.checkSpeadsheetDateFormat = function (mandatory, text, format) {
        if (!text) {
            if (mandatory)
                return false;
            else
                return true;
        }

        //dd/MM/yy
        if (format == DateTimeFormat.SpreadsheetDateMonthYear) {
            var regExpDMY = new RegExp('^[0-9]{2}[\\/]{1}[0-9]{2}[\\/]{1}[0-9]{2}$');

            if (!regExpDMY.test(text)) {
                return false;
            }
            else {
                var inputDate = text.substring(0, 2);
                var inputMonth = _.find(monthsFormat, function (month) { return month.display == text.substring(3, 5); });
                var inputYear = text.substring(6, 8);

                if (!inputMonth) {
                    return false;
                }
                else if (inputMonth.display == '02') {

                    //leap year handle
                    var lyear = false;

                    //this is a string addition, e.g.: '20' + '19' = '2019'
                    inputYear = new Date().getFullYear().toString().substring(0, 2) + inputYear;

                    if ((!(inputYear % 4) && inputYear % 100) || !(inputYear % 400)) {
                        lyear = true;
                    }
                    if ((lyear == false) && (inputDate >= 29)) {
                        return false;
                    } else if ((lyear == true) && (inputDate > 29)) {
                        return false;
                    } else {
                        return true;
                    }
                }
                else {
                    if (inputDate > inputMonth.maxDate)
                        return false
                    else
                        return true;
                }
            }
        }
        //ddMMM, for LH delivery date
        else if (format == DateTimeFormat.SpreadsheetDateMonth) {
            var inputText = text.toUpperCase();
            var regExpDM = new RegExp('^[0-3]{1}[0-9]{1}[A-Z]{3}$');

            if (!regExpDM.test(inputText)) {
                return false;
            }

            var inputMonth = _.find(monthsFormat, function (month) { return month.MMMDisplay == inputText.substring(2, 5); });

            if (!inputMonth) {
                return false;
            }
            else {
                var inputDate = inputText.substring(0, 2);
                if (inputMonth.MMMDisplay == 'FEB')
                {
                    //estimate input year
                    if (new Date().getMonth() > 1) {
                        var inputYear = new Date().getFullYear() + 1;
                    }
                    else {
                        var inputYear = new Date().getFullYear();
                    }

                    //leap year handle
                    var lyear = false;
                    if ((!(inputYear % 4) && inputYear % 100) || !(inputYear % 400)) {
                        lyear = true;
                    }
                    if ((lyear == false) && (inputDate >= 29)) {
                        return false;
                    } else if ((lyear == true) && (inputDate > 29)) {
                        return false;
                    } else {
                        return true;
                    }
                }
                else
                {
                    if (inputDate > inputMonth.maxDate)
                        return false
                    else
                        return true;
                }
            }
        }
        //HH:mm
        else if (format == DateTimeFormat.SpreadsheetHourMinute) {
            if (text.charAt(0) == '2') {
                var regExpHM = new RegExp('^[2]{1}[0-3]{1}[:]{1}[0-5]{1}[0-9]{1}$');
            }
            else {
                var regExpHM = new RegExp('^[0-1]{1}[0-9]{1}[:]{1}[0-5]{1}[0-9]{1}$');
            }
            return regExpHM.test(text);
        }
    }

    this.checkFlightNoFormat = function(s) {
        var regExp = /^([a-zA-Z]{2}|[a-zA-Z][0-9]|[0-9][a-zA-Z])([0-9]{3}[0-9]?[A-Za-z]?)$/;
        return regExp.test(s);
    }

    this.checkDealCodeFormat = function (s) {
        if (!!!s)
            return true;

        var regExp = /^D[0-9a-zA-Z]{1,10}D$/;
        return regExp.test(s);
    }

    function getLengthReg(minLength, maxLength) {
        var tempString = '';
        if (!!!minLength) {
            tempString = '0,';
        }
        else {
            tempString = minLength + ',';
        }

        if (!!maxLength) {
            tempString += maxLength;
        }

        return tempString;
    }

    function isStartWith(s, substring) {
        var regExp = new RegExp('^' + substring);
        return regExp.test(s);
    }
}

var StringFormatChecker = Object.freeze(new stringFormatChecker());