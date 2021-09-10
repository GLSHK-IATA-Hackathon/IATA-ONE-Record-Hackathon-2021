/*
    A handler to handle WebAPI Request / Response
*/

function apiHandler() {

    this.ShrCheck = function(airline, shcList, awbPrefix, awbSuffix, productCode, tempCode, tempShc) {
        var partialUrl = 'validation/shrSegCheck';

        var shcData = {

            airline: airline,
            shrCodes: shcList,
            awbprefix: awbPrefix,
            awbsuffix: awbSuffix,
            productcode: productCode,
            temperaturecode: tempCode,
            temperatureShr: tempShc
        }

        return new Promise(function(resolve, reject) {
            if (shcData.shrCodes.length == 0 || shcData.shrCodes.every(function(x) { return x === "" })){
                return resolve();
            }
            else
            {
                AjaxRequest.post(partialUrl, shcData,
                    function(succResult){
                        let isShcValid = !!succResult.data.isValid;

                        if (!isShcValid){
                            let msg = succResult.data.returnStr;
                            let shrs = "";
                            let i18nTitle = "";
                            let i18nMsg = "";
                            let codeList = msg.toString().split("+");

                            if (codeList.length > 0)
                            {
                                for (var i = 1; i < codeList.length; i++) {
                                    if (shrs != "")
                                    {
                                        shrs += ", ";
                                    }
                                    shrs += codeList[i];
                                }

                                switch (codeList[0]) {
                                    case "1":
                                        i18nTitle = "cargoInfo.InvalidSHRSegregation"
                                        i18nMsg = i18next.t(i18nTitle, { shrCode: shrs, airline: airline });
                                        break;
                                    case "2":
                                        i18nTitle = "ngtt.InvalidSubscription"
                                        i18nMsg = i18next.t(i18nTitle, { shrCode: shrs });
                                        break;
                                    case "3":
                                        i18nTitle = "ngtt.InvalidNgttCancel"
                                        i18nMsg = i18next.t(i18nTitle);
                                        break;
                                    case "4":
                                        i18nTitle = "ngtt.MissNgttProdCode"
                                        i18nMsg = i18next.t(i18nTitle);
                                        break;
                                    case "5":
                                        i18nTitle = "ngtt.MissNgttTempCode"
                                        i18nMsg = i18next.t(i18nTitle);
                                        break;
                                }
                                return resolve( {inValidMsg: i18nMsg });
                            }
                            else {
                                return resolve();
                            }
                        }
                        else {
                            return resolve();
                        }
                    },
                    function(errResult){
                        return reject( {errors: errResult} );
                    }
                )
            }
        });
    }
}

var ApiHandler = new apiHandler();