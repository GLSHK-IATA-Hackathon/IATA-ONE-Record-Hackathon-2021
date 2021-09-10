if (typeof AfterTemplateChange === 'undefined' || AfterTemplateChange == null) {
    const AfterTemplateChange = {
        NoAction: 0,
        QuickAWBSearch: 1,
        FillTemplateData: 2
    };
}

/* get template list record */
var templateRecordSearchTimeoutValue = 30000;
var templateRecordSearchTimeoutHandle = -1;
var templateRecordSearchLity;
var templateRecordSaveLity;

//Get template list result
function GetTemplateRecord(component, template, count) {
       connectHub(function () {
        startTemplateSearchAction(component);
        if (typeof count === 'undefined' || count == null) {
            count = -1;
        }
        bookingHub.server.getTemplateRecordList(component, template, count);
    });
}

//Get template list result from api
function GetTemplateRecordAPI(component, template, count) {
    console.log("GetTemplateRecord component: " + component + " template: " + template + " count: " + count);

    startTemplateSearchAction(component);
    if (typeof count === 'undefined' || count == null) {
        count = -1;
    }

    var d = {
        "request": {
            "templateName": template
        }
    }; //create array of objects
    var options = {};
    options.url = BookingAPIURL + "bookingTemplateRecord";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.dataType = "json";
    options.data = JSON.stringify(d);
    options.beforeSend = function (xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('ApiToken'));
    };
    options.success = function (response) {
        console.log("GetTemplateRecordAPI response:", response);

        stopTemplateRecordSearchAction(component);
        var res = response.objects;
        console.log("res:", res);
        var templateList = [];
        var templateListResult = [];
        if (typeof res !== 'undefined' && res != null) {
            templateList = res;
        }

        if (count > 0 && templateList.length > count) {
            for (var i = 0; i < count; i++) {
                templateListResult.push(templateList[i]);
            }
        } else {
            templateListResult = templateList;
        }

        switch (component) {
            case "SINGLEBOOK_LIGHT_BOX":
                localStorage.setItem("singlebook_template_record", JSON.stringify(templateListResult));
                bindTemplateRecordSearchResult(component);
                break;
            case "TOOL_BOX":
                localStorage.setItem("toolsbox_template_record", JSON.stringify(templateListResult));
                bindTemplateRecordSearchResult(component);
                break;
        }
    };
    options.error = function () {
        console.log("Error while calling the Web API!");
        stopAction();
        DialogManager.alert(i18next.t('common.System'), i18next.t('common.SessionTimeout'));
    };
    $.ajax(options);

}

bookingHub.client.loadTemplateRecordSearchResult = function (component, res, count) {
    console.log("loadTemplateRecordSearchResult: Received template result");
    console.log(res);

    stopTemplateRecordSearchAction(component);

    var templateList = [];
    var templateListResult = [];
    if (typeof res !== 'undefined' && res != null) {
        templateList = JSON.parse(res);
    }

    if (count > 0 && templateList.length > count) {
        for (var i = 0; i < count; i++) {
            templateListResult.push(templateList[i]);
        }
    } else {
        templateListResult = templateList;
    }

    switch (component) {
        case "SINGLEBOOK_LIGHT_BOX":
            localStorage.setItem("singlebook_template_record", JSON.stringify(templateListResult));
            bindTemplateRecordSearchResult(component);
            break;
        case "TOOL_BOX":
            localStorage.setItem("toolsbox_template_record", JSON.stringify(templateListResult));
            bindTemplateRecordSearchResult(component);
            break;
    }
}

function bindTemplateRecordSearchResult(component) {

    console.log("bindTemplateRecordSearchResult start");

    switch (component) {
        case "SINGLEBOOK_LIGHT_BOX":
            $("#singlebook_choose_temp_result_wrapper .rowwrapper").remove();
            var lt = [];
            if (localStorage.getItem("singlebook_template_record") != null) {
                lt = JSON.parse(localStorage.getItem("singlebook_template_record"));
            }
            if (lt.length == 0) {
                showTemplateRecordSearchError("No Record found.");
            } else {
                hideTemplateRecordSearchError();
            }
            content = getTemplateRecordResult();
            $("#singlebook_choose_temp_result_wrapper").append(content);
            break;
        case "TOOL_BOX":
            $("#toolsbox_choose_temp_result_wrapper .tool_list_item").remove();
            var lt = [];
            if (localStorage.getItem("toolsbox_template_record") != null) {
                lt = JSON.parse(localStorage.getItem("toolsbox_template_record"));
            }
            if (lt.length == 0) {
                showToolsBoxTemplateRecordSearchError("No Record found.");
            } else {
                hideToolsBoxTemplateRecordSearchError();
            }
            content = getToolsBoxTemplateRecordResult();
            $("#toolsbox_choose_temp_result_wrapper").append(content);
            break;
    }

}

function startTemplateSearchAction(component) {
    switch (component) {
        case "SINGLEBOOK_LIGHT_BOX":
            showTemplateRecordSearchLoading();
            break;
        case "TOOL_BOX":
            showToolsBoxTemplateRecordSearchLoading();
            break;
    }
    startTemplateRecordSearchTimeout(component);
}

function stopTemplateRecordSearchAction(component) {
    switch (component) {
        case "SINGLEBOOK_LIGHT_BOX":
            hideTemplateRecordSearchLoading();
            break;
        case "TOOL_BOX":
            hideToolsBoxTemplateRecordSearchLoading();
            break;
    }
    if (templateRecordSearchTimeoutHandle != -1) {
        clearTimeout(templateRecordSearchTimeoutHandle);
        templateRecordSearchTimeoutHandle = -1;
    }
    //disconnectHub();
}

function startTemplateRecordSearchTimeout(component) {
    templateRecordSearchTimeoutHandle = setTimeout(function () {
        templateRecordSearchTimeout(component);
    }, templateRecordSearchTimeoutValue);
}

function templateRecordSearchTimeout(component) {
    stopTemplateRecordSearchAction(component);
    switch (component) {
        case "SINGLEBOOK_LIGHT_BOX":
            showTemplateRecordSearchError("Load template record failed");
            break;
        case "TOOL_BOX":
            showToolsBoxTemplateRecordSearchError("Load template record failed");
            break;
    }
    
    templateRecordSearchTimeoutHandle = -1;
}

/* for singlebook template src */
function showTemplateRecordSearchLoading() {
    $("#singlebookChooseTempResultStatusWrapper .loading-main").removeClass("disabled");
}

function hideTemplateRecordSearchLoading() {
    $("#singlebookChooseTempResultStatusWrapper .loading-main").addClass("disabled");
}

function showTemplateRecordSearchError(msg) {
    $("#singlebookChooseTempResultStatusWrapper .error-box").removeClass("disabled");

    if (typeof msg !== 'undefined' && msg != null) {
        $("#singlebookChooseTempResultStatusWrapper .error-box .error-message").text(msg);
    }
}

function hideTemplateRecordSearchError() {
    $("#singlebookChooseTempResultStatusWrapper .error-box").addClass("disabled");
    $("#singlebookChooseTempResultStatusWrapper .error-box .error-message").text("");
}
/* end for singlebook template src */

/* for toolsbox template src */
function showToolsBoxTemplateRecordSearchLoading() {
    $("#toolsbox_template_src_loading").removeClass("disabled");
}

function hideToolsBoxTemplateRecordSearchLoading() {
    $("#toolsbox_template_src_loading").addClass("disabled");
}

function showToolsBoxTemplateRecordSearchError(msg) {
    $("#toolsbox_template_err_box").removeClass("disabled");

    if (typeof msg !== 'undefined' && msg != null) {
        $("#toolsbox_template_err_box .error-message").text(msg);
    }
}

function hideToolsBoxTemplateRecordSearchError() {
    $("#toolsbox_template_err_box").addClass("disabled");
    $("#toolsbox_template_err_box .error-message").text("");
}
/* end for toolsbox template src */

function openTemplateRecordSearch(e, tab) {
    console.log("openTemplateRecordSearch");
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }

    var awbPrefix = getData("bkd_def_cargoinfo", "AWBPrefix");
    var awbSuffix = getData("bkd_def_cargoinfo", "AWBSuffix");

    if (awbPrefix == "" || awbSuffix == "") {
        alert("Air Waybill no. must be entered before loading template");
        return false;
    }

    if (typeof validateAWBInputField === 'function') {
        if (!validateAWBInputField(awbSuffix)) {
            alert("Air Waybill no. is invalid");
            return false;
        }
    }

    resetTemplateRecordSrc();
    templateRecordSearchLity = lity('#singlebook_choose_temp');
    getTemplateRecordSrc(null, "", defaultChooseTemplateCount);

}

function closeTemplateRecordSearch(e) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }
    templateRecordSearchLity.close();
}

function getTemplateRecordSrc(e, templateName, count) {
    console.log("getTemplateRecordSrc");
    if (typeof e !== 'undefined' && e != null && e.preventDefault) {
        e.preventDefault();
    }
    var template;
    if (typeof templateName !== 'undefined' && templateName != null) {
        template = templateName;
    } else {
        template = $("#singlebook_temp_record_src").val() || "";
    } 
    localStorage.setItem("last_temp_src", template);
    if (typeof count !== 'undefined' && count != null) {
        GetTemplateRecord("SINGLEBOOK_LIGHT_BOX", template, count);
    } else {
        GetTemplateRecord("SINGLEBOOK_LIGHT_BOX", template);
    }
    
}

function getToolsBoxTemplateRecordSrc(e, templateName, count) {
    console.log("getToolsBoxTemplateRecordSrc");
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }
    var template;
    if (typeof templateName !== 'undefined' && templateName != null) {
        template = templateName;
    } else {
        template = $("#toolsbox_temp_record_src").val() || "";
    }
    localStorage.setItem("toolsbox_last_temp_src", template);
    if (typeof count !== 'undefined' && count != null) {
       // GetTemplateRecord("TOOL_BOX", template, count);
        GetTemplateRecordAPI("TOOL_BOX", template, count);
    } else {
      //  GetTemplateRecord("TOOL_BOX", template);
        GetTemplateRecordAPI("TOOL_BOX", template);
    }
}

function getTemplateRecordResult() {

    var rtn = "";
    var templateRecordTemp = $("#singlebook_choose_template_src_temp").html();

    var lt = [];
    if (localStorage.getItem("singlebook_template_record") != null) {
        lt = JSON.parse(localStorage.getItem("singlebook_template_record"));
    }

    for (var i = 0; i < lt.length; i++) {
        rtn += templateRecordTemp.replaceAll("%ROWID%", i).replace("%TEMP_NAME%", lt[i].TemplateName)
            .replace("%AIRLINE%", lt[i].Airline).replace("%FROM%", lt[i].Origin).replace("%TO%", lt[i].Destination)
            .replaceAll("%TEMPID%", lt[i].TemplateID);
    }

    return rtn;
}

function getToolsBoxTemplateRecordResult() {

    var rtn = "";
    var templateRecordTemp = $("#toolsbox_choose_template_src_temp").html();

    var lt = [];
    if (localStorage.getItem("toolsbox_template_record") != null) {
        lt = JSON.parse(localStorage.getItem("toolsbox_template_record"));
    }

    for (var i = 0; i < lt.length; i++) {
        rtn += templateRecordTemp.replaceAll("%ROWID%", i).replace("%TEMP_NAME%", lt[i].TemplateName)
            .replaceAll("%TEMPID%", lt[i].TemplateID);
    }

    return rtn;
}

function resetTemplateRecordSrc() {
    $("#singlebook_temp_record_src").val("");
    $("#singlebook_choose_temp_result_wrapper .rowwrapper").remove();

    $("#singlebookChooseTempResultStatusWrapper .error-box").addClass("disabled");
    hideTemplateRecordSearchLoading();
    hideTemplateRecordSearchError();
}

function resetToolsBoxTemplateRecordSrc() {
    //$("#singlebook_temp_record_src").val("");
    //$("#singlebook_choose_temp_result_wrapper .rowwrapper").remove();

    //$("#singlebookChooseTempResultStatusWrapper .error-box").addClass("disabled");
    hideToolsBoxTemplateRecordSearchLoading();
    hideToolsBoxTemplateRecordSearchError();
}

/* Save template */
var templateRecordSaveTimeoutHandle = -1;
var templateRecordSaveTimeoutValue = 30000;

function startTemplateSaveAction() {
    //showTemplateSaveLoading();
    hideTemplateRecordSavePanel();
    hideTemplateRecordSaveError();
    showTemplateSaveLoading();
    startTemplateSaveTimeout();
}

function stopTemplateSaveAction() {
    hideTemplateRecordSaveLoading();
    if (templateRecordSaveTimeoutHandle != -1) {
        clearTimeout(templateRecordSaveTimeoutHandle);
        templateRecordSaveTimeoutHandle = -1;
    }
    //disconnectHub();
}

function startTemplateSaveTimeout() {
    clearTimeout(templateRecordSaveTimeoutHandle);
    templateRecordSaveTimeoutHandle = setTimeout(function () {
        templateSaveTimeout();
    }, templateRecordSaveTimeoutValue);
}

function templateSaveTimeout() {
    stopTemplateSaveAction();
    //alert("Save template failed. Timeout occurred");
    showTemplateRecordSaveError("Save template failed. Timeout occurred");
    templateRecordSaveTimeoutHandle = -1;
}

function SaveTemplateRecord(template) {
    connectHub(function () {
        startTemplateSaveAction();
        bookingHub.server.saveTemplateRecord(template);
    });
}

bookingHub.client.templateSaveResponse = function (res, msg) {
    console.log("Received template save response");
    console.log("res: " + res);
    console.log("msg: " + msg);
    stopTemplateSaveAction();
    if (res == true) {
        //alert("Template successfully added.");
        hideTemplateRecordSavePanel();
        hideTemplateRecordSaveError();
        showTemplateRecordSaveSuccess();

        //refresh toolbox
        getToolsBoxTemplateRecordSrc();
    }
    else if (typeof msg !== 'undefined' && msg != null) {
        //alert("Failed to save template. " + msg);
        showTemplateRecordSavePanel();
        showTemplateRecordSaveError(msg);
    } else {
        showTemplateRecordSavePanel();
        showTemplateRecordSaveError("Error occured when saving the template");
    }

}

function openTemplateRecordSave(e, tab) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }

    var airline = getData("bkd_def_cargoinfo", "Airline");
    if (typeof airline === 'undefined' || airline == "") {
        alert("Airline must be selected");
        return false;
    }

    resetTemplateRecordSave();
    templateRecordSaveLity = lity('#singlebook_save_temp');
}

function closeTemplateRecordSave(e) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }
    templateRecordSaveLity.close();
}

function resetTemplateRecordSave() {
    $("#singlebook_temp_record_ins").val("");
    showTemplateRecordSavePanel();
    hideTemplateRecordSaveLoading();
    hideTemplateRecordSaveError();
    hideTemplateRecordSaveSuccess();
}

function showTemplateRecordSaveError(msg) {
    if (typeof msg !== 'undefined' && msg != null) {
        $("#singlebookSaveTempResultStatusWrapper .error-box .error-message").text(msg);
    }
    $("#singlebookSaveTempResultStatusWrapper .error-box").removeClass("disabled");
}

function hideTemplateRecordSaveError() {
    $("#singlebookSaveTempResultStatusWrapper .error-box").addClass("disabled");
    $("#singlebookSaveTempResultStatusWrapper .error-box .error-message").text("");
}

function showTemplateRecordSaveSuccess() {
    $("#singlebookSaveTempResultStatusWrapper .blk_success").removeClass("disabled");
}

function hideTemplateRecordSaveSuccess() {
    $("#singlebookSaveTempResultStatusWrapper .blk_success").addClass("disabled");
}

function showTemplateRecordSavePanel() {
    $("#singlebook_save_temp .blk_filter").removeClass("disabled");
}

function hideTemplateRecordSavePanel() {
    $("#singlebook_save_temp .blk_filter").addClass("disabled");
}

function showTemplateSaveLoading(id) {
    $("#singlebook_save_temp .loading-main").removeClass("disabled");
}

function hideTemplateRecordSaveLoading() {
    $("#singlebook_save_temp .loading-main").addClass("disabled");
}
/* end save template */


/* set template */
var templateRecordLoadTimeoutValue = 30000;
var templateRecordLoadTimeoutHandle = -1;

//Get template result
function GetTemplateRecordLoad(component, templateID) {
    connectHub(function () {
        startTemplateRecordLoadAction();
        bookingHub.server.getTemplateRecordLoad(component, templateID);
    });
}

bookingHub.client.loadTemplateRecordResult = function (res, targetTabID) {
    console.log("loadTemplateRecordResult: Received template result");
    console.log(res);

    var templateList = [];
    if (typeof res !== 'undefined' && res != null) {
        templateList = JSON.parse(res);
    } else {
        alert("Error occurred when retrieving the template.");
    }

    stopTemplateRecordLoadAction();

    if (targetTabID != 0 && targetTabID != currentTabID) {
        if (templateList.length > 0) {
            localStorage.setItem("toolsbox_template_data_to_fill", JSON.stringify(templateList));
        }
        window.location.href = linkBkdSingleAwb;
    } else {
        if (templateList.length > 0) {
            if (templateList[0].Airline != "") {
                localStorage.setItem("toolsbox_template_data_to_fill", JSON.stringify(templateList));
                //setTemplateDataAfterNavi();
                getAirlineTemplate(templateList[0].Airline, AfterTemplateChange.FillTemplateData);
            }
        }
        /*
        for (var i = 1; i <= 3; i++) {
            $("#tab" + i + " > .bkd_block").each(function (i, o) {
                if ($._data(o, 'events') && $._data(o, 'events').clear != null)
                    $(o).triggerHandler("clear");
            });
        }

        for (var i = 0; i < templateList.length; i++) {
            setData(templateList[i].ModuleID, templateList[i].DataID, templateList[i].Content);
        }
        
        if (typeof contactName !== 'undefined' && contactName != null) {
            setData("bkd_def_cargoinfo", "Contact", contactName);
        }
        */
    }

}

function setTemplateDataAfterNavi() {
    if (localStorage.getItem("toolsbox_template_data_to_fill") != null) {
        for (var i = 1; i <= 3; i++) {
            $("#tab" + i + " > .bkd_block").each(function (i, o) {
                if ($._data(o, 'events') && $._data(o, 'events').clear != null)
                    $(o).triggerHandler("clear");
            });
        }
        var toolsBoxTemplateList = JSON.parse(localStorage.getItem("toolsbox_template_data_to_fill"));
        for (var i = 0; i < toolsBoxTemplateList.length; i++) {
            if (i == 0) {
                $('#cargoInfo_airline').selectpicker('val', toolsBoxTemplateList[i].Airline);
            }
            setData(toolsBoxTemplateList[i].ModuleID, toolsBoxTemplateList[i].DataID, toolsBoxTemplateList[i].Content);
        }

        if (typeof contactName !== 'undefined' && contactName != null) {
            setData("bkd_def_cargoinfo", "Contact", contactName);
        }
        localStorage.removeItem("toolsbox_template_data_to_fill");
    }
}

function startTemplateRecordLoadAction() {
    TogglePartialLoading(true, null, true);
    startTemplateRecordLoadTimeout();
}

function stopTemplateRecordLoadAction() {
    if (templateRecordLoadTimeoutHandle != -1) {
        clearTimeout(templateRecordLoadTimeoutHandle);
        templateRecordLoadTimeoutHandle = -1;
    }
    //disconnectHub();
    TogglePartialLoading(false);
}

function startTemplateRecordLoadTimeout() {
    clearTimeout(templateRecordLoadTimeoutHandle);
    templateRecordLoadTimeoutHandle = setTimeout(function () {
        templateRecordLoadTimeout();
    }, templateRecordLoadTimeoutValue);
}

function templateRecordLoadTimeout() {
    stopTemplateRecordLoadAction();
    alert("Load template record failed");
    templateRecordLoadTimeoutHandle = -1;
}

function getTemplateRecordToFill(e, templateID) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }

    closeTemplateRecordSearch();
    GetTemplateRecordLoad("SINGLEBOOK_LIGHT_BOX", templateID);
}

function getToolsBoxTemplateRecordToFill(e, templateID) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }

    var awbPrefix = "";
    var awbSuffix = "";

    if (typeof getData === 'function') {
        awbPrefix = getData("bkd_def_cargoinfo", "AWBPrefix");
        awbSuffix = getData("bkd_def_cargoinfo", "AWBSuffix");
    }

    if (awbPrefix == "" || awbSuffix == "") {
        alert("Air Waybill no. must be entered before loading template");
        return false;
    }

    if (typeof validateAWBInputField === 'function') {
        if (!validateAWBInputField(awbSuffix)) {
            alert("Air Waybill no. is invalid");
            return false;
        }
    }

    GetTemplateRecordLoad("TOOL_BOX", templateID);
}

/* end set template */

/* delete template */
var templateRecordDeleteTimeoutValue = 30000;
var templateRecordDeleteTimeoutHandle = -1;

function DeleteTemplateRecord(component, templateID) {
    connectHub(function () {
        startTemplateRecordDeleteAction();
        bookingHub.server.deleteTemplateRecord(component, templateID);
    });
}

bookingHub.client.templateDeleteResponse = function (component, res, msg) {
    console.log("templateDeleteResponse: Received template result");
    console.log(res);

    stopTemplateRecordDeleteAction();

    if (typeof res !== 'undefined' && res != null) {
        if (res == true) {
            alert("Delete template successfully.");

            switch (component) {
                case "SINGLEBOOK_LIGHT_BOX":
                    if (localStorage.getItem("last_temp_src") != null) {
                        getTemplateRecordSrc(null, localStorage.getItem("last_temp_src"));
                    } else {
                        getTemplateRecordSrc();
                    }
                    break;
                case "TOOL_BOX":
                    if (localStorage.getItem("last_temp_src") != null) {
                        getToolsBoxTemplateRecordSrc(null, localStorage.getItem("toolsbox_last_temp_src"));
                    } else {
                        getToolsBoxTemplateRecordSrc();
                    }
                    break;
            }

        } else {
            if (typeof msg !== 'undefined' && msg != null) {
                alert(msg);
            } else {
                alert("Error occurred when deleting the template.");
            }
        }
    } else {
        alert("Error occurred when deleting the template.");
    }

}

function startTemplateRecordDeleteAction() {
    startTemplateRecordDeleteTimeout();
}

function stopTemplateRecordDeleteAction() {
    if (templateRecordDeleteTimeoutHandle != -1) {
        clearTimeout(templateRecordDeleteTimeoutHandle);
        templateRecordDeleteTimeoutHandle = -1;
    }
    //disconnectHub();
}

function startTemplateRecordDeleteTimeout() {
    clearTimeout(templateRecordDeleteTimeoutHandle);
    templateRecordDeleteTimeoutHandle = setTimeout(function () {
        templateRecordDeleteTimeout();
    }, templateRecordDeleteTimeoutValue);
}

function templateRecordDeleteTimeout() {
    stopTemplateRecordDeleteAction();
    alert("Delete template record failed, timeout resulted.");
    templateRecordDeleteTimeoutHandle = -1;
}

function delTemplate(event, templateID) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }
    var confirmDelete = confirm("Are you sure to delete the template?");
    if (confirmDelete == true) {
        DeleteTemplateRecord("SINGLEBOOK_LIGHT_BOX", templateID);
    }
}

function delToolsBoxTemplate(event, templateID) {
    if (typeof e !== 'undefined' && e != null) {
        e.preventDefault();
    }
    var confirmDelete = confirm("Are you sure to delete the template?");
    if (confirmDelete == true) {
        DeleteTemplateRecord("TOOL_BOX", templateID);
    }
}
/* end delete template */