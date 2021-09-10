// fs var
var faHub = $.connection.flightAvailabilityHub;
var fsTimeoutHandle = null;
var expectingResultCnt;
var receivedResultCnt;
var faDisplayObj = [];
var fa_airline = [];

var validAirline = ["CX", "JL", "KA", "QF", "AA", "AF", "AY", "BA", "CV", "ET", "EY", "KE", "KK", "KL", "KZ", "LD", "LH", "LX", "NH", "RU", "SA", "SK", "SQ", "SV", "TG", "UA", "UO",
    "7T", "ES", "3S", "QY", "D0", "V4", "L3", "D5"
];

var selectedConnFlight = true;

// flight search
function openFSLb(e) {
    e.preventDefault();
    console.log(e.target);
    console.log($(e.target).parent().parent().parent());
    console.log($("#flt_order_list > li").index($(e.target).parent().parent().parent()));
    //alert($(e.target).parent().parent().parent().index());
    //alert($(e.target).parent().parent().parent().attr("data-rowid"));
    var row = $("#flt_order_list > li").index($(e.target).parent().parent().parent());

    if (typeof row !== 'undefined' && row != null && row != -1) {
        localStorage.setItem("FSRowClick", row);
    } else {
        localStorage.setItem("FSRowClick", -1);
    }
    //alert(localStorage.getItem("FSRowClick"));

    reSetFASrc();
    lityInstance = lity('#search_flight');
    console.log("row: " + row);
    if (row > -1) {
        faQuickQuery(row+1);
    }
}

function loadFSResultToRow(e, resultID) {

    e.preventDefault();
    var fsResultArr = JSON.parse(localStorage.getItem("FSResult"));
    resultID = parseInt(resultID);
    var selectArr = fsResultArr[resultID];
    console.log(selectArr);
    var sourceRow;
    var clearList = false;
    var currentAirline = localStorage.getItem("currentAirline");

    if (typeof localStorage.getItem("FSRowClick") !== 'undefined' && localStorage.getItem("FSRowClick") != null) {
        if (parseInt(localStorage.getItem("FSRowClick")) != -1) {
            sourceRow = parseInt(localStorage.getItem("FSRowClick")) + 1;
            clearList = false;
        } else {
            sourceRow = 1;
            clearList = true;
        }
    } else {
        sourceRow = 1;
        clearList = false;
    }
    console.log("sourceRow: " + sourceRow);

    if (clearList) {

        $("li[class^='flight_segment_input_row'] input").each(function (j, el) {
            //var id = el.id.substring(el.id.indexOf("_")+1);
            //var rowid = $(this).attr("data-rowid");
            //console.log("flightSegment");
            //console.log("rowid: " +rowid);
            //console.log("i: " +i);
            //console.log($(this).attr("id"));
            $(this).val("");
        });

        $("li[class^='flight_segment_input_row'] select").each(function (j, el) {
            //var id = el.id.substring(el.id.indexOf("_")+1);
            //var rowid = $(this).attr("data-rowid");
            //console.log("flightSegment");
            //console.log("rowid: " +rowid);
            //console.log("i: " +i);
            //console.log($(this).attr("id"));

            $(this).prop("selectedIndex", 0);
        });

        //clear data for CX routing
        if (_.find(Constant.cxTemplateAirlines, function (o) { return o == currentAirline; })) {
            $("div[class^='route_input_row'] input").each(function (j, el) {
                $(this).val("");
            });
        }
    }
    if (selectArr.FSSegment.length > 0) {
        $("#flight_flt_no_" + sourceRow).val(selectArr.FSSegment[0].FlightNo);
        $("#flight_flt_date_" + sourceRow).val(selectArr.FSSegment[0].FromDT);
        $("#flight_flt_from_" + sourceRow).val(selectArr.FSSegment[0].From);
        $("#flight_flt_to_" + sourceRow).val(selectArr.FSSegment[0].To);

        console.log("selectArr.FSSegment.length: " + selectArr.FSSegment.length);

        if (typeof InsertFlightSegmentInput === 'function') {
            for (var i = 1; i < selectArr.FSSegment.length; i++) {
                InsertFlightSegmentInput(sourceRow + i, i, function (cID, dataRow) {
                    $("#flight_flt_no_" + cID).val(selectArr.FSSegment[dataRow].FlightNo);
                    $("#flight_flt_date_" + cID).val(selectArr.FSSegment[dataRow].FromDT);
                    $("#flight_flt_from_" + cID).val(selectArr.FSSegment[dataRow].From);
                    $("#flight_flt_to_" + cID).val(selectArr.FSSegment[dataRow].To);
                    refreshFlightSegmentRowID();
                });
            }
        } else {
            console.log("InsertFlightSegmentInput not found");
            alert("Error occurs when inserting the flight: InsertFlightSegmentInput not found.");
        }

    }

    refreshFlightSegmentRowID();

    //fill data to CX routing
    if (_.find(Constant.cxTemplateAirlines, function (o) { return o == currentAirline; })) {
        if (clearList) {  //20201111 This if for "Check flight availability” does not to auto fill the Routing
            for (var i = getComponentRowID("route_input_row"); i < selectArr.FSSegment.length; i++) {
                $("#bkd_def_routing").triggerHandler("addDestinationInput");
            }
        }
        for (var rowId = 1; rowId <= selectArr.FSSegment.length; rowId++) {
            var FSIndex = rowId - 1;
            if (clearList) { //20201111 This if for "Check flight availability” does not to auto fill the Routing
                if (rowId == 1) {
                    $("#routing_route_from_" + rowId).val(selectArr.FSSegment[FSIndex].From);
                    $("#routing_route_to_" + rowId).val(selectArr.FSSegment[FSIndex].To);
                    $("#routing_route_airline_" + rowId).val(selectArr.FSSegment[FSIndex].FlightNo.substring(0, 2));
                }
                else {
                    $("#routing_route_to_" + rowId).val(selectArr.FSSegment[FSIndex].To);
                    $("#routing_route_airline_" + rowId).val(selectArr.FSSegment[FSIndex].FlightNo.substring(0, 2));
                }
            }
            $(".flight_segment_input_row[data-rowid=" + rowId + "] .flight_int_input").unbind("keypress");
            $(".flight_segment_input_row[data-rowid=" + rowId + "] .flight_int_input").keypress(function (e) {
                console.log(e.which);
                if (e.which >= 48 && e.which <= 57) {
                } else {
                    return false;
                }
            });

            $(".flight_segment_input_row[data-rowid=" + rowId + "] .flight_dec_input").keypress(function (e) {
                console.log(e.which);
                if ((e.which >= 48 && e.which <= 57) || e.which == 46) {
                } else {
                    return false;
                }
            });

            $(".flight_segment_input_row[data-rowid=" + rowId + "] .flight_dec_input_volume").blur(function (e) {
                if ($(this).val() != "") {
                    $(this).val(FormatDecInput($(this).val(), decimalVolumeRoundToCX));
                }
            });

            $(".flight_segment_input_row[data-rowid=" + rowId + "] .flight_dec_input_weight").blur(function (e) {
                if ($(this).val() != "") {
                    $(this).val(FormatDecInput($(this).val(), decimalWeightRoundTo));
                }
            });
        }
    }

    lityInstance.close();
}

function refreshFlightSegmentRowID() {
    console.log("refreshFlightSegmentRowID");
    $("li[class^='flight_segment_input_row']").each(function (i, el) {
        //var id = el.id.substring(el.id.indexOf("_")+1);
        //var rowid = $(this).attr("data-rowid");
        //console.log("flightSegment");
        //console.log("rowid: " +rowid);
        //console.log("i: " +i);
        var currentRowID = i + 1;
        $(this).attr("data-rowid", currentRowID);

        $("li[class^='flight_segment_input_row'][data-rowid='"+currentRowID+"'] input").each(function (j, el) {
            //var id = el.id.substring(el.id.indexOf("_")+1);
            //var rowid = $(this).attr("data-rowid");
            //console.log("flightSegment");
            //console.log("rowid: " +rowid);
            //console.log("i: " +i);
            console.log($(this).attr("id"));

            var id = el.id.substring(el.id.indexOf("_")+1);
            $(this).attr("id", $(this).attr("id").substring(0, $(this).attr("id").lastIndexOf("_")+1) + currentRowID);

        });

        $("li[class^='flight_segment_input_row'][data-rowid='"+currentRowID+"'] select").each(function (j, el) {
            //var id = el.id.substring(el.id.indexOf("_")+1);
            //var rowid = $(this).attr("data-rowid");
            //console.log("flightSegment");
            //console.log("rowid: " +rowid);
            //console.log("i: " +i);
            console.log($(this).attr("id"));

            var id = el.id.substring(el.id.indexOf("_")+1);
            $(this).attr("id", $(this).attr("id").substring(0, $(this).attr("id").lastIndexOf("_")+1) + currentRowID);

        });

    });

    refreshModuleTranslation();
}

//FS query function.
faHub.client.hello = function () {
    alert("OK!");
}
faHub.client.requestAccepted = function () {
    //faToggleDisplay(displayStatus.loading);
    console.log("fa requestAccepted");
}

faHub.client.accepted = function () {
    //faToggleDisplay(displayStatus.loading);
    console.log("fa accepted");
}

faHub.client.rejected = function (err, stacktrace) {
    //$("#error_message").html(CreateSkinErrorMessage(err));
    //faToggleDisplay(displayStatus.error);
    console.log("fa rejected");
    console.log(err);
    console.log(stacktrace);
    showFSError(i18next.t("flight.FlightNotFound"));
    hideFSLoading();
    //$.connection.hub.stop();
}

faHub.client.response = function (res) {
    //debugger;
    /*receivedResultCnt++;
        
    if (fa_airline.indexOf(res.Airline) == -1) {
        fa_airline.push(res.Airline);

        var selector = $("#fa_airline_selector_template").html().replace(/\$AIRLINE\$/g, res.Airline);
        $("#fa_airline_selector").html($("#fa_airline_selector").html() + selector);
    }
    */

    clearTimeout(fsTimeoutHandle);

    var fsResultArr = [];
    var fsObj;
    var fsSegmentObj;
    res.FVAMaster = _.orderBy(res.FVAMaster, function (o) { return o.FVADetail.length; }, ['asc']);
    console.log("$(#flt_date_src).val() ", $("#flt_date_src").val());
    var flightSearchDate = $("#flt_date_src").val();
    //console.log("res: " + JSON.stringify(res.FVAMaster));
    for (var i = 0; i < res.FVAMaster.length; i++) {
        var mLine = res.FVAMaster[i]

        var flightDate;
        var airline = "";
        var flightNum = "";
        var orig = "";
        var dest = "";
        var origTime = "";
        var destTime = "";
        var stop = "";
        var aircraftType = "";

        var origDateChange = "";
        var destDateChange = "";

        fsObj = new Object;
        fsObj.FSSegment = [];

        for (var j = 0; j < mLine.FVADetail.length; j++) {
            var dLine = mLine.FVADetail[j];

            if (j == 0) {
                airline = res.Airline;
                flightDate = getAPIDate(mLine.FlightDate).ToString(DateTimeFormat.YearMonthDate);
               var DateChange = DateDiff.inDays(new Date(flightSearchDate), new Date(getAPIDate(dLine.DepartureDate).ToString(DateTimeFormat.YearMonthDate)));
                if (DateChange > 0) {
                    break;
                }
            }
            
            flightNum = dLine.FlightNum;
            orig = dLine.Origin;
            dest = dLine.Destination;
            origDateChange = DateDiff.inDays(new Date(flightSearchDate), new Date(getAPIDate(dLine.DepartureDate).ToString(DateTimeFormat.YearMonthDate)));
            if (origDateChange > 0) {
                origDateChange = "+" + origDateChange;
            } else if (origDateChange < 0) {
                origDateChange = "-" + origDateChange;
            } else {
                origDateChange = "";
            }

            var debug = dLine.ArrDayChange
            destDateChange = DateDiff.inDays(new Date(flightSearchDate), new Date(getAPIDate(dLine.ArrivalDate).ToString(DateTimeFormat.YearMonthDate)));
            if (destDateChange > 0) {
                destDateChange = "+" + destDateChange;
            } else if (destDateChange < 0) {
                destDateChange = "-" + destDateChange;
            } else {
                destDateChange = "";
            }

            origTime = getAPIDate(dLine.DepartureDate).ToString(DateTimeFormat.Time) + origDateChange;
            destTime = getAPIDate(dLine.ArrivalDate).ToString(DateTimeFormat.Time) + destDateChange;
            stop = dLine.FlightSto;
            aircraftType = dLine.FlightType;
                        
            fsSegmentObj = new Object;
            fsSegmentObj.FlightNo = flightNum;
            fsSegmentObj.From = orig;
            fsSegmentObj.FromDT = getAPIDate(dLine.DepartureDate).ToString(DateTimeFormat.YearMonthDate);
            fsSegmentObj.FromTime = origTime;
            fsSegmentObj.To = dest;
            fsSegmentObj.ToDT = getAPIDate(dLine.ArrivalDate).ToString(DateTimeFormat.YearMonthDate);
            fsSegmentObj.ToTime = destTime;
            fsObj.FSSegment.push(fsSegmentObj);
        }
        if (fsObj.FSSegment.length > 0) {
            fsResultArr.push(fsObj);
        }
    }

    if (fsResultArr.length > 0) {
        localStorage.setItem("FSResult", JSON.stringify(fsResultArr));
        console.log(JSON.parse(localStorage.getItem("FSResult")));
        displayFAResult();
    } else {
        showFSError(i18next.t("flight.FlightNotFound"));
    }
    /*
    if (receivedResultCnt == expectingResultCnt) {
        //faToggleDisplay(displayStatus.content);
        clearTimeout(fsTimeoutHandle);
        $.connection.hub.stop();
    }
    else {
        //faToggleDisplay(displayStatus.loading_partial);
    }
    */
    hideFSLoading();
}
        

function startFSQuery(airline, flight_date, orig, dest) {

    if (validAirline.indexOf(airline.toUpperCase()) == -1) {
        alert(i18next.t('cargoInfo.InvalidAirline'));
        return;
    }

    hideFSError();

    if ($.connection.hub.state != $.signalR.connectionState.connected) {
        $.connection.hub.start().done(function () {
            showFSLoading();

            $("#fa_result_wrapper .fa_result_row").remove();
            var airlines = [];
            selectedConnFlight = true;
            airlines.push(airline);

            clearTimeout(fsTimeoutHandle);

            fsTimeoutHandle = setTimeout(function () {
                faTimeout();
            }, 20000);

            try {
                faHub.server.flightAvailabilitySearch("", orig, dest, flight_date, airlines, false);
            }
            catch (e) {
                debugger;
                hideFSLoading();
                showFSError("System error !!!");
                
            }
        });
    } else {
        showFSLoading();

        $("#fa_result_wrapper .fa_result_row").remove();
        var airlines = [];
        selectedConnFlight = true;
        airlines.push(airline);

        clearTimeout(fsTimeoutHandle);

        fsTimeoutHandle = setTimeout(function () {
            faTimeout();
        }, 20000);

        try {
            faHub.server.flightAvailabilitySearch("", orig, dest, flight_date, airlines, false);
        }
        catch (e) {
            debugger;
            hideFSLoading();
            showFSError("System error !!!");
        }
    }

    
}

function faTimeout() {
    
    //$.connection.hub.stop();
    faHub.client.rejected('Connection timeout');
    fsTimeoutHandle = null;
    hideFSLoading();
    
}
/*
function testLoadHTML() {

    $("#fa_result_wrapper .fa_result_row").remove();

    var row = $("#flt_row_temp").html();
    var mergedRow = $("#flt_row_temp_merged").html()

    row = row.replace("%ROW_INX%", "1")
        .replace("%FLIGT_NUM%", "CX301")
        .replace("%ORIG_T%", "09:30")
        .replace("%ORIG%", "HKG")
        .replace("%DEST_T%", "16:45")
        .replace("%DEST%", "NRT");
    $("#fa_result_wrapper").append(row);
    mergedRow = mergedRow.replace("%ROW_INX%", "1")
        .replace("%FLIGT_NUM%", "CX302")
        .replace("%ORIG_T%", "19:30")
        .replace("%ORIG%", "NRT")
        .replace("%DEST_T%", "20:45")
        .replace("%DEST%", "BNK");
    $("#fa_result_wrapper").append(mergedRow);
    console.log(row);

    row = row.replace("%ROW_INX%", "2").replace("%FLIGT_NUM%", "CX301").replace("%ORIG_T%", "09:30").replace("%ORIG%", "HKG").replace("%DEST_T%", "16:45").replace("%DEST%", "NRT");
    $("#fa_result_wrapper").append(row);
    mergedRow = mergedRow.replace("%ROW_INX%", "2").replace("%FLIGT_NUM%", "CX302").replace("%ORIG_T%", "19:30").replace("%ORIG%", "NRT").replace("%DEST_T%", "20:45").replace("%DEST%", "BNK");
    $("#fa_result_wrapper").append(mergedRow);

}
*/
function displayFAResult() {

    $("#fa_result_wrapper .fa_result_row").remove();

    var row = $("#flt_row_temp").html();
    var mergedRow = $("#flt_row_temp_merged").html();
    var currentRow;
    if (typeof localStorage.getItem("FSResult") !== 'undefined' && localStorage.getItem("FSResult") != null) {

        var resultArr = JSON.parse(localStorage.getItem("FSResult"));
        console.log(resultArr);

        for (var i = 0; i < resultArr.length; i++) {
            //console.log("i: " + i);
            for (var j = 0; j < resultArr[i].FSSegment.length; j++) {
                //console.log("j: " + j);
                if (j == 0) {
                            
                    currentRow = row.replaceAll("%ROW_INX%", i + 1)
                            .replaceAll("%FLIGT_NUM%", resultArr[i].FSSegment[j].FlightNo)
                            .replaceAll("%ORIG_T%", resultArr[i].FSSegment[j].FromTime)
                            .replaceAll("%ORIG%", resultArr[i].FSSegment[j].From)
                            .replaceAll("%DEST_T%", resultArr[i].FSSegment[j].ToTime)
                            .replaceAll("%DEST%", resultArr[i].FSSegment[j].To)
                            .replaceAll("%ROW_INX_RS%", i);
                } else {
                    currentRow = mergedRow.replaceAll("%ROW_INX%", i + 1)
                            .replaceAll("%FLIGT_NUM%", resultArr[i].FSSegment[j].FlightNo)
                            .replaceAll("%ORIG_T%", resultArr[i].FSSegment[j].FromTime)
                            .replaceAll("%ORIG%", resultArr[i].FSSegment[j].From)
                            .replaceAll("%DEST_T%", resultArr[i].FSSegment[j].ToTime)
                            .replaceAll("%DEST%", resultArr[i].FSSegment[j].To)
                            .replaceAll("%ROW_INX_RS%", i);
                }

                $("#fa_result_wrapper").append(currentRow);

            }

        }

    }

    refreshModuleTranslation();

}
/*
function faSearchTest() {
    connectHub(function () {
        //startAction();
        var airlines = [];
        airlines.push("CX");
        var searchFlightDate = new Date("2018-09-05");
        faHub.server.flightAvailabilitySearch("", "HKG", "TPE", searchFlightDate, airlines, false);
    });

}*/

function faQuickQuery(row) {

    var airline = $("#flight_flt_no_" + row).val().trim().substring(0,2).toUpperCase() || "";
    var flightDate = $("#flight_flt_date_" + row).val().trim() || "";
    var origin = $("#flight_flt_from_" + row).val().trim().toUpperCase() || "";
    var dest = $("#flight_flt_to_" + row).val().trim().toUpperCase() || "";
    var autoQuery = true;

    if (airline == "") {
        airline = getData("bkd_def_cargoinfo", "Airline");
    }

    var today = new Date();
    if (flightDate != "") {
        var fd = new Date(flightDate);
        if (DateDiff.inDays(today, fd) < 0) {
            autoQuery = false;
            $("#flt_date_src").val("");
        } else {
            $("#flt_date_src").val(flightDate);
        }
    }

    $("#flt_airline_src").val(airline);
    //$("#flt_date_src").datepicker("setDate", flightDate);
    $("#flt_from_src").val(origin);
    $("#flt_to_src").val(dest);

    if (autoQuery && airline != "" && airline.length == 2 && flightDate != "" && origin != "" && dest != "") {
        startFSQuery(airline, flightDate, origin, dest);
    }

}

function reSetFASrc() {
    $("#flt_airline_src").val("");
    $("#flt_date_src").datepicker("setDate", new Date());
    $("#flt_from_src").val("");
    $("#flt_to_src").val("");

    $("#fa_result_wrapper .fa_result_row").remove();
    $("#faResultStatusWrapper .error-box").addClass("disabled");
    hideFSLoading();
    hideFSError();
}

function showFSLoading() {
    $("#faResultStatusWrapper .loading-main").removeClass("disabled");
}

function hideFSLoading() {
    $("#faResultStatusWrapper .loading-main").addClass("disabled");
}

function showFSError(msg) {
    $("#faResultStatusWrapper .error-box").removeClass("disabled");

    if (typeof msg !== 'undefined' && msg != null) {
        $("#faResultStatusWrapper .error-box .error-message").text(msg);
    }
}

function hideFSError() {
    $("#faResultStatusWrapper .error-box").addClass("disabled");
    $("#faResultStatusWrapper .error-box .error-message").text("");
}