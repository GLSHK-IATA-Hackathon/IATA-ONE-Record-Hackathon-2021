//========================================================================================================================================================================================================
//Sensor Readings related JavaScript by Kendo UI chart and grid - START

// Chart and Grid related events - START 


function plotTemperature() {

	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).removeClass('active');
	strCurrentSensorReadingType = 'Temperature';
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).addClass('active');
	
	plotChart(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, "Temperature");
	
}

function plotHumidity() {

	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).removeClass('active');
	strCurrentSensorReadingType = 'Humidity';
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).addClass('active');
	
	plotChart(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, "Humidity");
	
}

function plotLight() {
	
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).removeClass('active');
	strCurrentSensorReadingType = 'Light';
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).addClass('active');

	plotChart(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, "Light");
	
}

function plotShock() {
	
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).removeClass('active');
	strCurrentSensorReadingType = 'Shock';
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).addClass('active');

	plotChart(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, "Shock");
	

}

function BackToShipmentStatus() {

	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#BackToShipmentStatusTick").hide();
	$("#temperature_and_voltage").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Left").show();
	$("#ShipmentStatus_Right").show();
	
	if (objNGTTDeviceSensorReading != null && objNGTTDeviceSensorReading.devices != null && objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[0].reading.length > 0) {
		$("#list_view").show();
	}
	
}

function showDeviceSensorReadings(intDeviceIndex, strSensorReadingType) {
	
	var objLastAvailableSensorReading
	
	//Update Device buttons
	$("#Device" + intCurrentDeviceIndex).removeClass('active');
	intCurrentDeviceIndex = intDeviceIndex
	$("#Device" + intCurrentDeviceIndex).addClass('active');
	
	//Update Sensor Reading buttons
	
	//Temperature
	objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Temperature')
	if (objLastAvailableSensorReading != null) {
		$("#button_plot_temperature").show();
		$("#button_temperature").html(objLastAvailableSensorReading.temperature + '&deg;C' + ' (' + convertTemperatureCToF(objLastAvailableSensorReading.temperature) + '&deg;F)')
		$("#button_temperature_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
	}
	else {
		$("#button_plot_temperature").hide();
	}
	
	//Humidity
	objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Humidity')
	if (objLastAvailableSensorReading != null) {
		$("#button_plot_humidity").show();
		$("#button_humidity").html(objLastAvailableSensorReading.humidity + '%')
		$("#button_humidity_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
	}
	else {
		$("#button_plot_humidity").hide();
	}
	
	//Light
	objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Light')
	if (objLastAvailableSensorReading != null) {
		$("#button_plot_light").show();
		$("#button_light").html(objLastAvailableSensorReading.light + 'lx')
		$("#button_light_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
	}
	else {
		$("#button_plot_light").hide();
	}
	
	//Shock
	objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Shock')
	if (objLastAvailableSensorReading != null) {
		$("#button_plot_shock").show();
		$("#button_shock").html(objLastAvailableSensorReading.shock)
		$("#button_shock_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
	}
	else {
		$("#button_plot_shock").hide();
	}
	
	/*
	if (objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading.length > 0) {
		$("#button_temperature").html(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading[objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading.length-1].temperature + '&deg;C' + ' (' + convertTemperatureCToF(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].temperature) + '&deg;F)')
		$("#button_humidity").html(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading[objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading.length-1].humidity + '%')
		$("#button_light").html(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading[objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading.length-1].light + 'lx')
		$("#button_shock").html(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading[objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading.length-1].shock)
	}
	else {
		
		$("#button_temperature").html('-')
		$("#button_humidity").html('-')
		$("#button_light").html('-')
		$("#button_shock").html('-')
		
	}
	*/
	
	plotsparklines('#button_sparklines_temp', objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Temperature') 
	plotsparklines('#button_sparklines_humid', objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Humidity') 
	plotsparklines('#button_sparklines_light', objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Light') 
	plotsparklines('#button_sparklines_shock', objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, 'Shock') 
	
	
	/*
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).removeClass('active');
	strCurrentSensorReadingType = strSensorReadingType
	$("#button_plot_" + strCurrentSensorReadingType.toLowerCase()).addClass('active');
	*/
	
	strCurrentSensorReadingType = 'Temperature';
	
	//Plot Chart
	plotChart(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading, strCurrentSensorReadingType);
	
	//Draw Grid
	drawGrid(objNGTTDeviceSensorReading.devices[intCurrentDeviceIndex].reading)
	
	//$("#button_plot_humidity").addClass('active');
	
}

$("#BackToShipmentStatusTick").click(function() {
	
	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#ShipmentStatus_Left").show();
	$("#ShipmentStatus_Right").show();
	
});
			
// Chart and Grid related events - END 
			
// Chart and Grid related functions - START 
function genSensorReadingDevicesList() {
	
	var strSensorReading_DeviceButton_Template = ''
	var strSensorReading_DeviceButton_Content = ''
	
	strSensorReading_DeviceButton_Template = $("#sensor_reading_device_button_template").html();
	
	strSensorReading_DeviceButton_Template = populateLocalizedStrings(strSensorReading_DeviceButton_Template, strCurrentLanguage)
	
	for (var key in objNGTTDeviceSensorReading.devices) {
	
		strSensorReading_DeviceButton_Content +=  strSensorReading_DeviceButton_Template
		
												.replace(/{{SensorReading-DeviceIndex}}/g, key)
												.replace("{{SensorReading-DeviceID}}", objNGTTDeviceSensorReading.devices[key].id)
												.replace("{{DeviceButtonClass}}", (key == 0 ? ' active' : ''))
												
	}
	
	$("#SensorReading-DeviceButton-Content").html(strSensorReading_DeviceButton_Content)
	
	
}


function plotChart(objSensorReadings, MeasurementType) {
	
	var arrDepArrTime = []
	var objDepArrTime
	
	for (var i = 0; i < objSensorReadings.length; i++) {
			
		if (i < objSensorReadings.length - 1 && objSensorReadings[i].source == 'G' && objSensorReadings[i+1].source == 'F') {
			
			objDepArrTime = {}
			objDepArrTime.value = objSensorReadings[i+1].dateTime
			objDepArrTime.label = {text : "Departed", font: '8pt Consolas',	position : "outside"}
			arrDepArrTime.push(objDepArrTime)
			
		}
		
		if (i < objSensorReadings.length - 1 && objSensorReadings[i].source == 'F' && objSensorReadings[i+1].source == 'G') {
			
			objDepArrTime = {}
			objDepArrTime.value = objSensorReadings[i+1].dateTime
			objDepArrTime.label = {text : "Arrived", font: '8pt Consolas',	position : "outside"}
			arrDepArrTime.push(objDepArrTime)
			
		}
		
		
	}
	
	
	//calculate the step in category axis based on the time difference (in minutes) between first and last sensor readings
	
	var intTimeDiffinMins
	var intStep = 1
	
	
	if (objSensorReadings.length > 0) {
		
		intTimeDiffinMins = Math.round((objSensorReadings[objSensorReadings.length -1].dateTime.getTime() - objSensorReadings[0].dateTime.getTime()) / 1000 / 60)
		
		if (objSensorReadings.length == 1) {
			//Only one sensor reading, set step to 1
			intStep = 1
		}
		else if (objSensorReadings.length < intNoOfLabelsinCategoryAxis) {
			//Number of sensor Readings is less than number of labels to be shown in Category Axis, use number of sensor readings - 1 as base to divide time diff in minutes
			intStep = Math.floor(intTimeDiffinMins / (objSensorReadings.length - 1))
		}
		else {
			intStep = Math.floor(intTimeDiffinMins / (intNoOfLabelsinCategoryAxis - 1))
		}
	}
	
				
	$("#chart").kendoChart({
		/*
		title: {
			text: ChartSeriesName[MeasurementType],
			font: "10pt Arial",
			position : "top"
		},
		*/
		legend : {
			position : "left",
			offsetY: -170,
			labels : {
				rotation : 270
			},
			markers: {
			  visible: false,
			}
			
		},
		renderAs: "canvas",
		dataSource: {
			data: objSensorReadings
		},
		series: [{
			//name : ChartSeriesName[(MeasurementType == 'Temperature' ? ($("#Temperature-Scale-Button").is(':checked') ? 'Temperature_F' : 'Temperature') :  MeasurementType)],
			name : LocalizedStrings[MeasurementType][strCurrentLanguage] + ' ' + MeasurementType_Unit[(MeasurementType == 'Temperature' ? ($("#Temperature-Scale-Button").is(':checked') ? 'Temperature_F' : 'Temperature') :  MeasurementType)],
			type: "line",
			color: "#65A0D1",
			style: "smooth",
			field: (MeasurementType == 'Temperature' ? ($("#Temperature-Scale-Button").is(':checked') ? 'Temperature_F' : 'Temperature') :  MeasurementType).toLowerCase(),
			categoryField: "dateTime",
			visibleInLegend: true,
			markers: {
				visible : false
			}
			
			
		}],
		categoryAxis: {
			
			labels: {
				rotation: "auto",
				format: 'MMM-dd HH:mm',
				step : intStep  //added to not show all category (X) values when baseUnit is set to "minutes" instead of "fit"
			},
			
			//added to reduce the interval for gridlines drawing when baseUnit is set to "minutes" instead of "fit"
			majorGridLines: {
			  step: 100
			},
			
			notes : {
				line : {
					length : 330,
					dashType : "dashDot"
				},
				data : arrDepArrTime
				/*
				
				data : [{
							value : new Date('2020-06-08 13:00:32'),
							label : {
								text : "Departed",
								font: "8pt Consolas",
								position : "outside"
							}
						},
						{
							value : new Date('2020-06-08 22:25:45'),
							label : {
								text : "Arrived",
								font: "8pt Consolas",
								position : "outside"
							}
						}
				]
				*/
			},
			
			baseUnit: "minutes",  //Set baseUnit to "minutes" instead of "fit" to avoid misleading when series values are aggregated 
			baseUnitStep: 1,      //Set baseUnitStep to 1 for maximum accuracy 
			
		
		},
		/*
		tooltip: {
			visible: true,
			font : "10pt Consolas",
			format: "{0}&deg;C",
			template: "#= series.name #: #= value #"
		},
		*/
		pannable: {
			lock: "y"
		},
		zoomable: {
			mousewheel: {
				lock: "y"
			},
			selection: {
				lock: "y"
			}
		}
	
	});

	
	//Show/Hide Temperature scale button based on MeasurementType
	$("#Temperature-Scale").css("visibility", (MeasurementType == "Temperature" ? "visible" : "hidden") );
		
	

}

function plotsparklines(strElementId, objSensorReadings, MeasurementType) {
	
	$(strElementId).kendoSparkline({
		dataSource: {
			data: objSensorReadings
		},
		chartArea: {background:"transparent"},
		series: [{
			name : MeasurementType,
			type: "line",
			width : 2,
			color: "#65A0D1",
			style: "smooth",
			field: MeasurementType.toLowerCase(),
			//categoryField: "dateTime",
			markers: {
				visible : false
			}
			
		}],
		 categoryAxis: {
			field: "dateTime",
			//baseUnit: "fit"
			baseUnit: "minutes",  //Set baseUnit to "minutes" instead of "fit" to avoid misleading when series values are aggregated 
			baseUnitStep: 1
		},
		tooltip: {
			visible: true,
			font : "10pt Consolas",
			format: "{0} " + MeasurementType_Unit[MeasurementType]
			//,
			//background:"transparent"
			//template: "#= series.name #: #= value #"
		}
		
		
	});

	
}


function drawGrid(objSensorReadings) {
	
	
	$("#grid").kendoGrid({
		dataSource: {
			data: objSensorReadings,
			pageSize: 10,
			sort: { field: "dateTime", dir: "desc" }
		},
		//height: 400,
		groupable: false,
		sortable: true,
		pageable: {
			refresh: false,
			pageSizes: true,
			buttonCount: 5
		},
		columns: [
					{
						field: "dateTime",
						title: LocalizedStrings['DateTime'][strCurrentLanguage] + " (UTC)",
						format: "{0: dd MMM yyyy HH:mm:ss}",
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						},
						width : '20%'
					}, 
					/*
					{
						field: "latitude",
						title: "Latitude",
						headerAttributes: {
							"class": "shipment-status_sensor_reading_table_header",
							style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					}, 
					{
						field: "longitude",
						title: "Longitude",
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					*/
					{
						field: ($("#Temperature-Scale-Button").is(':checked') ? "temperature_f" : "temperature"),
						title: LocalizedStrings['Temperature'][strCurrentLanguage],
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					/*
					{
						field: "temperature",
						title: "Temperature \u2103",
						hidden : (objNGTTDeviceSensorReading.devices[0].reading[0].temperature == null || $("#Temperature-Scale").is(':checked')),
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					{
						field: "temperature_f",
						title: "Temperature \u2109",
						hidden : (objNGTTDeviceSensorReading.devices[0].reading[0].temperature_f == null || !$("#Temperature-Scale").is(':checked')),
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					*/
					{
						field: "humidity",
						title: LocalizedStrings['Humidity'][strCurrentLanguage] + " %",
						hidden : (objNGTTDeviceSensorReading.devices[0].reading[0].humidity == null),
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					{
						field: "light",
						title: LocalizedStrings['Light'][strCurrentLanguage] + " lx",
						hidden : (objNGTTDeviceSensorReading.devices[0].reading[0].light == null),
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
					},
					{
						field: "shock",
						title: LocalizedStrings['Shock'][strCurrentLanguage],
						hidden : (objNGTTDeviceSensorReading.devices[0].reading[0].shock == null),
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						  style: "text-align: right;"
						},
						attributes: {
							"class": "shipment-status_sensor_reading_table_cell",
							style: "text-align: right;"
						},
						width : '16%'
						
					}
		]
	});
	
	//Set Column Title for Temperature - START
	//Note : Column Tile cannot be change by using declaration setting after the grid has been created
	
	var grid = $("#grid").data("kendoGrid");
	
	var options = grid.getOptions();
	options.columns[getGridColumnIndexByFieldName(options.columns, ($("#Temperature-Scale-Button").is(':checked') ? 'temperature_f' : 'temperature'))].title = LocalizedStrings['Temperature'][strCurrentLanguage] + ($("#Temperature-Scale-Button").is(':checked') ? "\u2109" : "\u2103")
	
	grid.setOptions(options);
	
	//Set Column Title for Temperature - END
}

function drawTemperatureAndVoltageGrid(strGridId, objDeviceHistoryLogs) {

	$("#" + strGridId).kendoGrid({
		dataSource: {
			data: objDeviceHistoryLogs,
			pageSize: 10
		},
		//height: 400,
		width : 580,
		groupable: false,
		sortable: true,
		pageable: {
			refresh: false,
			pageSizes: true,
			buttonCount: 5
		},
		columns: [
					{
						field: "Station",
						title: LocalizedStrings['Station'][strCurrentLanguage],
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						},
						width : '10%'
					},
					{
						field: "Location",
						title: LocalizedStrings['CheckPoint'][strCurrentLanguage],
						template: '#= DeviceHistoryLogLocationMapping[Location] #',
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						},
						width : '20%'
					},
					{
						field: "Temperature",
						title: LocalizedStrings['Temperature-Abbrev'][strCurrentLanguage],
						headerAttributes: {
							"class": "shipment-status_sensor_reading_table_header",
							style: "text-align: right;"
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						  style: "text-align: right;"
						},
						width : '10%'
					},
					{
						field: "Voltage",
						title: LocalizedStrings['Voltage-Abbrev'][strCurrentLanguage],
						headerAttributes: {
							"class": "shipment-status_sensor_reading_table_header",
							style: "text-align: right;"
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						  style: "text-align: right;"
						},
						width : '10%'
					},
					{
						field: "TimeOfReport",
						title: LocalizedStrings['EventTime'][strCurrentLanguage],
						//format: "{0: dd MMM yyyy HH:mm:ss}",
						template: '#= formatAPIDate(TimeOfReport, "DD MMM YYYY HH:mm:ss") #',
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						},
						width : '25%'
					},
					{
						
						title: LocalizedStrings['Action'][strCurrentLanguage],
						headerAttributes: {
						  "class": "shipment-status_sensor_reading_table_header",
						},
						attributes: {
						  "class": "shipment-status_sensor_reading_table_cell",
						},
						width : '10%'
					}
					
		]
	});
	
}

function getGridColumnIndexByFieldName(arrColumns, strFieldName) {
	
	var found_index = 0
	
	for (var i=0; i<arrColumns.length; i++) {
			
		if (arrColumns[i].field == strFieldName) {
			found_index = i
			break
		}
		
	}
	
	return found_index
	
	
}


// Chart and Grid related functions - END

//Sensor Readings related JavaScript by Kendo UI chart and grid - END
//========================================================================================================================================================================================================
