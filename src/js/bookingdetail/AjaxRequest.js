/*
 * Required: DialogManager
*/

function ajaxRequest() {
    this.post = function (partialUrl, requestData, succCallback, errCallback) {
        connectHub(function () {
            var startTime = new Date().getTime();

            bookingHub.server.getAjaxBasicInfo().done(function (hubResults) {
                var data = {
                    userInfo: hubResults.UserInfo,
                    data: requestData
                }
                
                //session timeout
                if (!!!data.userInfo) {
                    if (typeof errCallback == "function") {
                        errCallback();
                    }
                    return;
                }

                $.ajax({
                    url: hubResults.ServerAddress + partialUrl,
                    type: "POST",
                    dataType: "html",
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                    },
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('ApiToken'));
                    },
                    success: function (data) {
                        var endTime = new Date().getTime();
                        bookingHub.server.writeAjaxRequestLog(this.url, endTime - startTime, true);

                        succCallback(JSON.parse(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var endTime = new Date().getTime();
                        bookingHub.server.writeAjaxRequestLog(this.url, endTime - startTime, false);

                        errCallback({
                            xhr: xhr,
                            ajaxOptions: ajaxOptions,
                            thrownError: thrownError
                        });
                    }
                });
            });
        }); 
    }

    this.displayAjaxErr = function (result) {
        var resultObj = {};

        switch (result.xhr.status)
        {
            case 401:
                DialogManager.alert(i18next.t('common.System'), i18next.t('common.SessionTimeout'));
                break;
            default:
                if (result && isJsonParsable(result.xhr.responseText)) {
            resultObj = JSON.parse(result.xhr.responseText);
    
            if (resultObj.errors && Object.keys(resultObj.errors).length > 0) {
                var errs = [];
                _.forEach(resultObj.errors, function (value, key) {
                    errs.push(key + ', ' + value);
                });
                DialogManager.alert(i18next.t('common.Error'), errs);
            }	
            else if (resultObj.detail && resultObj.detail.length > 0) {
                DialogManager.alert(i18next.t('common.Error'), resultObj.detail);			
            }
                    else if (resultObj.message && resultObj.message.length > 0){
                        DialogManager.alert(i18next.t('common.Error'), resultObj.message);
                    }
                    else {
                        DialogManager.alert(i18next.t('common.Error'), i18next.t('common.ErrorOnService'));
                    }

                }
                break;
        }		
    }
}


function ajaxNGTTRequest() {
    this.post = function (partialUrl, requestData, succCallback, errCallback) {
        connectHub(function () {
            var startTime = new Date().getTime();

            bookingHub.server.getAjaxBasicInfo().done(function (hubResults) {
                var data = {
                    userInfo: hubResults.UserInfo,
                    data: requestData
                }

                //session timeout
                if (!!!data.userInfo) {
                    if (typeof errCallback == "function") {
                        errCallback();
                    }
                    return;
                }

                $.ajax({
                    url: hubResults.NGTTAPI + partialUrl,
                    type: "GET",
                    dataType: "text",
                    //data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                    },
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('ApiToken'));
                    },
                    success: function (data) {
                        var endTime = new Date().getTime();
                        bookingHub.server.writeAjaxRequestLog(this.url, endTime - startTime, true);

                        succCallback(JSON.parse(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var endTime = new Date().getTime();
                        bookingHub.server.writeAjaxRequestLog(this.url, endTime - startTime, false);

                        errCallback({
                            xhr: xhr,
                            ajaxOptions: ajaxOptions,
                            thrownError: thrownError
                        });
                    }
                });
            });
        });
    }

    this.displayAjaxErr = function (result) {
        var resultObj = {};

        switch (result.xhr.status)
        {
            case 401:
                DialogManager.alert(i18next.t('common.System'), i18next.t('common.SessionTimeout'));
                break;
            default:
                if (result && isJsonParsable(result.xhr.responseText)) {
            resultObj = JSON.parse(result.xhr.responseText);

            if (resultObj.errors && Object.keys(resultObj.errors).length > 0) {
                var errs = [];
                _.forEach(resultObj.errors, function (value, key) {
                    errs.push(key + ', ' + value);
                });
                DialogManager.alert(i18next.t('common.Error'), errs);
            }
            else if (resultObj.detail && resultObj.detail.length > 0) {
                DialogManager.alert(i18next.t('common.Error'), resultObj.detail);
            }
                    else if (resultObj.message && resultObj.message.length > 0){
                        DialogManager.alert(i18next.t('common.Error'), resultObj.message);
                    }
                    else {
                        DialogManager.alert(i18next.t('common.Error'), i18next.t('common.ErrorOnService'));
                    }

                }
                break;
        }
    }
}

var AjaxRequest = new ajaxRequest();
var AjaxNGTTRequest = new ajaxNGTTRequest();