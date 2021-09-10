var DateTimeFormat = Object.freeze({
    Full: 'yyyy-MM-dd HH:mm:ss',
    FullWithoutSecond: 'yyyy-MM-dd HH:mm',
    YearMonthDate: 'yyyy-MM-dd',
    YearMonthDate2: 'yyyy-mm-dd',
    DateMonth: 'dd MMM',
    DateMonthTime: 'dd MMM HH:mm',
    Time: 'HH:mm',
    Hour: 'HH',
    Minute: 'mm',
    SpreadsheetDateMonthYear: 'dd/MM/yy',
    SpreadsheetDateMonth: 'ddMMM',
    SpreadsheetHourMinute: 'HH:mm'
});

var monthsFormat = Object.freeze([
    { id: 0, display: '01', MMMDisplay: 'JAN', maxDate: 31 },
    { id: 1, display: '02', MMMDisplay: 'FEB', maxDate: 28 },
    { id: 2, display: '03', MMMDisplay: 'MAR', maxDate: 31 },
    { id: 3, display: '04', MMMDisplay: 'APR', maxDate: 30 },
    { id: 4, display: '05', MMMDisplay: 'MAY', maxDate: 31 },
    { id: 5, display: '06', MMMDisplay: 'JUN', maxDate: 30 },
    { id: 6, display: '07', MMMDisplay: 'JUL', maxDate: 31 },
    { id: 7, display: '08', MMMDisplay: 'AUG', maxDate: 31 },
    { id: 8, display: '09', MMMDisplay: 'SEP', maxDate: 30 },
    { id: 9, display: '10', MMMDisplay: 'OCT', maxDate: 31 },
    { id: 10, display: '11', MMMDisplay: 'NOV', maxDate: 30 },
    { id: 11, display: '12', MMMDisplay: 'DEC', maxDate: 31 }
]);

function FormatDecInput(val, roundTo, popup) {

    if (val.indexOf(".") > -1) {
        if (parseFloat(val).toFixed(roundTo) == 0) {
            if (roundTo == 0) {
                if (popup == undefined || popup == true) {
                    alert(i18next.t("common.DecAutoCorrectMsg").replace('$VALUE$', 1).replace('$VALUE$', 1));
                }
                return 1;
            }
            else if (roundTo == 1) {
                if (popup == undefined || popup == true) {
                    alert(i18next.t("common.DecAutoCorrectMsg").replace('$VALUE$', 0.1).replace('$VALUE$', 0.1));
                }
                return 0.1;
            }
            else {
                if (popup == undefined || popup == true) {
                    alert(i18next.t("common.DecAutoCorrectMsg")
                        .replace('$VALUE$', parseFloat(val).toFixed(roundTo - 1) + 1)
                        .replace('$VALUE$', parseFloat(val).toFixed(roundTo - 1) + 1));
                }

                return parseFloat(val).toFixed(roundTo - 1) + 1;
            }
        }
        else {
            return parseFloat(val).toFixed(roundTo);
        }
    }
    else
        return val;
}

function GetUTCDateByLocalDateObj(dateObj) {
    return new Date(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate()
    );
}

//Only works when server is storing HKG +8!
function GetLocalTimeFromServerTS(ts) {
    var UTCTime = getAPIDate(ts).addMinutes(8 * -60);

    return new Date(Date.UTC(
        UTCTime.getFullYear(),
        UTCTime.getMonth(),
        UTCTime.getDate(),
        UTCTime.getHours(),
        UTCTime.getMinutes(),
        UTCTime.getSeconds()
    ));
}

//Only works when server is storing HKG +8!
function GetLocalTimeFromServerTime(dateTime) {
    var UTCTime = dateTime.addMinutes(8 * -60);

    return new Date(Date.UTC(
        UTCTime.getFullYear(),
        UTCTime.getMonth(),
        UTCTime.getDate(),
        UTCTime.getHours(),
        UTCTime.getMinutes(),
        UTCTime.getSeconds()
    ));
}