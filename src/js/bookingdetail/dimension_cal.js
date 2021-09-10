// dimension calculation
if (typeof decimalRoundTo === 'undefined') {
    var decimalRoundTo = 2;
}

if (typeof decimalWeightRoundTo === 'undefined') {
    var decimalWeightRoundTo = 1;
}

if (typeof decimalVolumeRoundToCX === 'undefined') {
    var decimalVolumeRoundToCX = 3;
}

if (typeof intVad === 'undefined') {
    var intVad = /^\+?(0|[1-9]\d*)$/;
}

if (typeof decVad === 'undefined') {
    var decVad = /^([1-9]\d*|0\.\d*[0-9]|[0-9]\d*\.\d*[0-9]|0)$/;
}

function BkdDimCheck(roundTo) {
    var pcsValid = bkdDimCheckPcs();
    var weightValid = bkdDimCheckWeight();
    updateTotalVolInSelectUnit(roundTo);
    return pcsValid && weightValid;
}

function RegDimensionCal(roundTo) {
    if (typeof roundTo !== 'undefined' && roundTo != null) {
        regVolumeCal(roundTo);
        regDimensionUnitChange(roundTo);
    } else {
        regVolumeCal();
        regDimensionUnitChange();
    }
    regTotalPieceCal();
    regTotalWeightCal();
    //regTotalVolumeCal();

    $(".dimension_int_input").keypress(function (e) {
        console.log(e.which);
        if (e.which >= 48 && e.which <= 57) {
        } else {
            return false;
        }
    });

    $(".dimension_dec_input").keypress(function (e) {
        console.log(e.which);
        if ((e.which >= 48 && e.which <= 57) || e.which == 46) {
        } else {
            return false;
        }
    });

    $(".dimension_dec_input, .dimension_dec_input_weight").blur(function (e) {
        if ($(this).val() != "") {
            if ($(this).val().indexOf(".") > -1) {
                $(this).val(parseFloat($(this).val()).toFixed(decimalRoundTo));
            }
        }
    });

    $(".dimension_dec_input_weight").blur(function (e) {
        if ($(this).val() != "") {
            if ($(this).val().indexOf(".") > -1) {
                $(this).val(parseFloat($(this).val()).toFixed(decimalWeightRoundTo));
            }
        }
    });
}

function bkdDimCheckPcs() {
    var dimensionPCsTotal = $("#dimension_pc_total").text();
    var cargoInfoPCs = getData("bkd_def_cargoinfo", "Pieces");

    var isValid = true;

    if (dimensionPCsTotal != "0" && dimensionPCsTotal != "" && dimensionPCsTotal != cargoInfoPCs) {
        $("#dimension_pieces_err").show();
        $("#dimension_pc_total").addClass("error_indicator");
        isValid = false;
    } else {
        $("#dimension_pc_total").removeClass("error_indicator");
        $("#dimension_pieces_err").hide();
    }
    
    $("#dimension_cargo_info_pieces").text("(" + cargoInfoPCs + " " + i18next.t("cargoInfo.Pieces") + ")");

    return isValid;
}

function cXbkdDimCheckPcs() {
    var dimensionPCsTotal = $("#dimension_pc_total").text();
    var cargoInfoPCs = getData("bkd_def_cargoinfo", "Pieces");

    var isValid = true;

    if (dimensionPCsTotal != "0" && dimensionPCsTotal != "" && parseInt(dimensionPCsTotal) > parseInt(cargoInfoPCs)) {
        $("#dimension_pieces_err").show();
        $("#dimension_pc_total").addClass("error_indicator");
        $("#dimension_cargo_info_pieces").text("(" + cargoInfoPCs + " " + i18next.t("cargoInfo.Pieces") + ")");
        isValid = false;
    } else {
        $("#dimension_pc_total").removeClass("error_indicator");
        $("#dimension_pieces_err").hide();
    }

    return isValid;
}

function bkdDimCheckWeight() {
    var totalWeight = $("#dimension_weight_total").text();
    var cargoInfoWeight = getData("bkd_def_cargoinfo", "Weight");

    var isValid = true;

    var initTotalWeight = "0";
    for (var i = 0; i < decimalWeightRoundTo; i++) {
        if (i == 0)
            initTotalWeight = initTotalWeight + ".0";
        else
            initTotalWeight = initTotalWeight + "0";
    }

    var weightInKg = getData("bkd_def_cargoinfo", "WeightUnit") == "0" ? parseFloat(cargoInfoWeight) : lbToKgConverter(cargoInfoWeight).toFixed(decimalWeightRoundTo);

    if (totalWeight != initTotalWeight && totalWeight != "" && parseFloat(totalWeight) != weightInKg) {
        $("#dimension_weight_err").show();
        $("#dimension_weight_total").addClass("error_indicator");
        isValid = false;
    } else {
        $("#dimension_weight_err").hide();
        $("#dimension_weight_total").removeClass("error_indicator");
    }

    $("#dimension_cargo_info_weight").text("(" + weightInKg + " " + i18next.t("cargoInfo.KG") + ")");

    return isValid;
}

function calculatePieces(validInput) {

    var isValid = true;
    if (typeof validInput !== 'undefined' && validInput != null) {
        isValid = validInput;
    }
    var pcVal = 0;
    var length = $(".pc_cal").length;
    var airline = $("#bkd_def_cargoinfo").triggerHandler("getData", 'Airline');

    if (isValid) {
        $(".pc_cal").each(function (i, el) {
            var id = el.id;
            //console.log("id: " +id);
            console.log("val: " + $("#" + id).val());
            if ($("#" + id).val() == "") {
                //isValid = false;
                pcVal += 0;
            } else {
                pcVal += parseInt($("#" + id).val());
            }
            //console.log("pcVal:" + pcVal);
        });
    }

    if (isValid) {
        $("#dimension_pc_total").text(pcVal);
    } else {
        $("#dimension_pc_total").text("-");
    }

    if (airline && bkdConvertAirlineToMaster(airline) == "CX") {
        cXbkdDimCheckPcs();
    }
    else {
        bkdDimCheckPcs();
    }
}

function calculateWeight(validInput) {

    var isValid = true;
    if (typeof validInput !== 'undefined' && validInput != null) {
        isValid = validInput;
    }
    var totalWeight = 0;
    //var length = $(".weight_cal").length;

    if (isValid) {
        $(".weight_cal").each(function (i, el) {
            var id = el.id;
            //console.log("id: " +id);
            console.log("val: " + $("#" + id).val());
            if ($("#" + id).val() == "") {
                totalWeight += 0;
                //isValid = false;
            } else {
                totalWeight += parseFloat($("#" + id).val());
            }
            //console.log("totalWeight:" + totalWeight);
        });
    }

    if (isValid) {
        $("#dimension_weight_total").text(totalWeight.toFixed(decimalWeightRoundTo));
    } else {
        $("#dimension_weight_total").text("-");
    }

    bkdDimCheckWeight();
}

function calculateTotalVolume(validInput, roundTo) {

    var isValid = true;
    if (typeof validInput !== 'undefined' && validInput != null) {
        isValid = validInput;
    }
    var pcVal = 0;
    var length = $(".volume_cal").length;

    if (isValid) {
        $(".volume_cal").each(function (i, el) {
            var id = el.id;
            //console.log("id: " +id);
            console.log("val: " + $("#" + id).val());
            if ($("#" + id).val() == "") {
                pcVal += 0;
                //isValid = false;
            } else {
                pcVal += parseFloat($("#" + id).val());
            }
            //console.log("pcVal:" + pcVal);
        });
    }

    if (isValid) {
        if (typeof roundTo !== 'undefined' && roundTo != null) {
            $("#dimension_volume_total").text(pcVal.toFixed(roundTo));
            $(".dimension_vol_sticker").val(pcVal.toFixed(roundTo));
        } else {
            $("#dimension_volume_total").text(pcVal.toFixed(decimalRoundTo));
            $(".dimension_vol_sticker").val(pcVal.toFixed(decimalRoundTo));
        }
    } else {
        $("#dimension_volume_total").text("-");
        $("#total_in_selected_unit").text("-");
    }

    if (typeof roundTo !== 'undefined' && roundTo != null) {
        updateTotalVolInSelectUnit(roundTo);
    }
    else {
        updateTotalVolInSelectUnit(decimalRoundTo);
    }

}

function calculateRowVolume(rowID, roundTo) {
    var length = $("#dimension_length_" + rowID).val();
    var width = $("#dimension_width_" + rowID).val();
    var height = $("#dimension_height_" + rowID).val();
    var dimensionUnit = $("#dimension_cm_" + rowID).prop("checked");
    var pcs = $("#dimension_pcs_" + rowID).val();
    var volume = 0;

    //Default to use CM Unit
    var isUnitCM = dimensionUnit || typeof dimensionUnit == 'undefined' ;

    if (length != "" && width != "" && height != "" && pcs != "") {
        if (!isNaN(length) && !isNaN(width) && !isNaN(height) && !isNaN(pcs)) {
            if ( isUnitCM ) {
                volume = length * width * height * Math.pow(0.01, 3) * pcs;
            } else {
                volume = length * width * height * Math.pow(0.01, 3) * Math.pow(2.54, 3) * pcs;
                console.log(volume);
            }

            if (typeof roundTo !== 'undefined' && roundTo != null) {
                $("#dimension_vol_" + rowID).val(FormatDecInput(volume.toFixed(roundTo), roundTo, false));
            } else {
                $("#dimension_vol_" + rowID).val(FormatDecInput(volume.toFixed(decimalRoundTo), decimalRoundTo, false));
            }
        }
    } else {
        $("#dimension_vol_" + rowID).val("");
    }
}

function regVolumeCal(roundTo) {
    $(".vol_cal_input").blur(function () {
        var value = this.value;
        console.log(this.id);
        var rowID = this.id.substring(this.id.lastIndexOf("_") + 1);

        //var decVad = new RegExp('^(0|[1-9]\d*)(\.(?!0$)\d{1,3})?$');
        //var decVad = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9]|0)$/;
        if (!decVad.test(value) && this.value != "") {
            alert('Invalid input');
            //$(this).css("background-color", "#ffffcc");
            $(this).addClass("invalid_input_field");
        } else {
            //$(this).css("background-color", "#FFFFFF");
            $(this).removeClass("invalid_input_field");

            if (typeof roundTo !== 'undefined' && roundTo != null) {
                calculateRowVolume(rowID, roundTo);
                calculateTotalVolume(true, roundTo);
            } else {
                calculateRowVolume(rowID);
                calculateTotalVolume(true);
            }
        }
    });
}

function regTotalPieceCal() {
    $(".pc_cal").blur(function () {
        var value = this.value;
        console.log(this.id);
        var isValid = true;

        //var intVad = /^\+?(0|[1-9]\d*)$/;
        if (!intVad.test(value) && this.value != "") {
            alert('Invalid input');
            //$(this).css("background-color", "#ffffcc");
            $(this).addClass("invalid_input_field");
            isValid = false;
        } else {
            //$(this).css("background-color", "#FFFFFF");
            $(this).removeClass("invalid_input_field");
        }

        calculatePieces(isValid);

    });
}

function regTotalWeightCal() {
    $(".weight_cal").blur(function () {
        var value = this.value;
        console.log(this.id);
        var isValid = true;

        //var decVad = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9]|0)$/;
        if (!decVad.test(value) && this.value != "") {
            alert('Invalid input');
            //$(this).css("background-color", "#ffffcc");
            $(this).addClass("invalid_input_field");
            isValid = false;
        } else {
            //$(this).css("background-color", "#FFFFFF");
            $(this).removeClass("invalid_input_field");
        }

        calculateWeight(isValid);

    });

}

function regDimensionUnitChange(roundTo) {
    $('input[name^=dimension-unit_]').on('change', function () {
        console.log(this.id);
        var rowID = this.id.substring(this.id.lastIndexOf("_") + 1);

        var rowIsValid = true;
        var length = $("#dimension_length_" + rowID).val();
        var width = $("#dimension_width_" + rowID).val();
        var height = $("#dimension_height_" + rowID).val();

        //var decVad = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9]|0)$/;
        if (!decVad.test(length) && length != "") {
            //$("#dimension_length_"+rowID).css("background-color", "#ffffcc");
            $("#dimension_length_" + rowID).addClass("invalid_input_field");
            rowIsValid = false;
        } else {
            //$("#dimension_length_"+rowID).css("background-color", "#FFFFFF");
            $("#dimension_length_" + rowID).removeClass("invalid_input_field");
        }

        if (!decVad.test(width) && length != "") {
            //$("#dimension_width_"+rowID).css("background-color", "#ffffcc");
            $("#dimension_width_" + rowID).addClass("invalid_input_field");
            rowIsValid = false;
        } else {
            //$("#dimension_width_"+rowID).css("background-color", "#FFFFFF");
            $("#dimension_width_" + rowID).removeClass("invalid_input_field");
        }

        if (!decVad.test(height) && length != "") {
            //$("#dimension_height_"+rowID).css("background-color", "#ffffcc");
            $("#dimension_height_" + rowID).addClass("invalid_input_field");
            rowIsValid = false;
        } else {
            //$("#dimension_height_"+rowID).css("background-color", "#FFFFFF");
            $("#dimension_height_" + rowID).removeClass("invalid_input_field");
        }

        if (rowIsValid) {
            if (typeof roundTo !== 'undefined' && roundTo != null) {
                calculateRowVolume(rowID, roundTo);
                calculateTotalVolume(true, roundTo);
            } else {
                calculateRowVolume(rowID);
                calculateTotalVolume(true);
            }
        }
    });
}

function lbToKgConverter(weightInLb) {
    return parseFloat(weightInLb * lbToKgConstant);
}

function ClearAllRows(rowWrapper) {
    if (confirm(i18next.t("dimension.DeleteAllMsg"))) {
        $(rowWrapper).find('li').toArray().forEach(function (row) {
            ClearRow(row, true);
        });
    }
}

function ClearRow(row, fromDeleteAll) {
    if (fromDeleteAll || confirm(i18next.t("dimension.DeleteThisMsg"))) {
        var inputs = $(row).find("> div > input").toArray();

        inputs.forEach(function (input) {
            input.value = "";
            input.focus();
            input.blur();
        });

        if ($(row).find(".switch-toggle.switch-candy label")[0])
            $(row).find(".switch-toggle.switch-candy label")[0].click();

        var toggleBtns = $(row).find(".toggle-group").toArray();

        toggleBtns.forEach(function (btn) {
            if (!$(btn.parentElement).hasClass('off'))
                btn.click();
        });
    }
}

function updateTotalVolInSelectUnit(roundTo) {
    var selectedUnit = getData("bkd_def_cargoinfo", "VolumeUnit");

    $("#selected_unit").text(" " + getVolUnitTextByCode(selectedUnit));
    $("#total_in_selected_unit").text(getVolInSelectedUnit(selectedUnit).toFixed(roundTo));
}

function getVolInSelectedUnit(selectedUnit) {
    var totalVol = parseFloat(getData("bkd_def_dim", "TotalVolume"));
    switch (selectedUnit) {
        case "0":
            return totalVol;
            break;
        case "1":
            return totalVol * 35.3147;
            break;
        case "2":
            return totalVol * 1000000;
            break;
        case "3":
            return totalVol * 61023.744;
            break;
    }
}

//copy dimension vol to cargo vol
function copyDimVolToCargoVol() {
    var diVol = $("#total_in_selected_unit").text();
    if (parseFloat(diVol) > 0 && !isNaN(parseFloat(diVol))) {
        setData("bkd_def_cargoinfo", "Volume", diVol);
    }
}
//end dimension calculation