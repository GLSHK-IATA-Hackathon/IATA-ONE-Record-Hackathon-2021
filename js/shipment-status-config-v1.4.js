const AWB_DEVICE_SENSOR_READING_URL_PREFIX = 'https://uat-apigateway.ezbiz.com/uat-ngttapi/TNT/GetAWBDeviceSensorReadings/'
//const MAPTILER_API_KEY = 'QkdUvnCgAlvqbwXuUKD8'
const MAPTILER_API_KEY = 'rucCROpx7iXgto56CUH4'   //no domain restriction key

var image_path = 'img/shipment-status/'

var StatusMapping = {
										
	FOH : 'Freight on hand',
	RCS : 'Airline Received',
	RCT : 'Freight received from airline',
	MAN : 'Manifest received',
	DEP : 'Departed',
	ARR : 'Arrived',
	RCF : 'Freight accepted at airport',
	NFD : 'Freight ready for pick up', 
	TFD : 'Freight transferred to airline',
	AWR : 'Documents received',
	AWD : 'Document delivered to forwarder',
	DLV : 'Delivered',
	DIS : 'Discrepancy',
	OCI : 'Other Information',
	CCD : 'Custom cleared',
	TRM : 'Freight to be transferred to airline'
	
}

var NotificationMapping = {								
	INFO : 'Information',
	WARN : 'Warning',
	DANG : 'Danger'
}

var DeviceHistoryLogLocationMapping = {
										
	"ACCEPTANCE" : "Acceptance",
	"RAMP (DEP)" : "Departure",
	"IN W/HSE" : "Warehouse",
	"RAMP (ARR)" : "Arrival",
	"DELIVERY" : "Delivery"
	
}

var ChartSeriesName = {
										
	"Temperature" : "Temperature \u2103",
	"Temperature_F" : "Temperature \u2109",
	"Humidity" : "Humidity %",
	"Light" : "Light lx",
	"Shock" : "Shock"

}

var MeasurementType_Unit = {
										
	"Temperature" : "\u2103",
	"Temperature_F" : "\u2109",
	"Humidity" : "%",
	"Light" : "lx",
	"Shock" : ""

}

var LocalizedStrings = {
	
	"ShipmentTracking" : 	{
								"en" : "Track Your Shipment",
								"tc" : "貨件追蹤",
								"sc" : "货件追踪",
								"de" : "Sendungsverfolgung",
								"es" : "Rastrea tu envío"
							},				
	"MasterAirWaybill" : 	{
								"en" : "Master Air Waybill",
								"tc" : "空運提單",
								"sc" : "空运提单",
								"de" : "Master AWB",
								"es" : "Master AWB"
							},				
	"Pieces" : 				{
								"en" : "Pieces",
								"tc" : "件數",
								"sc" : "件数",
								"de" : "Stücke",
								"es" : "Piezas"
							},
	"Weight" : 				{
								"en" : "Weight",
								"tc" : "重量",
								"sc" : "重量",
								"de" : "Gewicht",
								"es" : "Peso"
							},
	"LatestStatus" : 		{
								"en" : "Latest Status",
								"tc" : "最新狀況",
								"sc" : "最新状况",
								"de" : "Letzter Status",
								"es" : "Último estado"
							},
	"BookingStatus" : 	{
								"en" : "Booking Status",
								"tc" : "訂艙狀況",
								"sc" : "订舱状况",
								"de" : "Buchungsstatus",
								"es" : "Estado de la reservación"
							},
	"ShipmentHistory" : 	{
								"en" : "Shipment History",
								"tc" : "貨物情況",
								"sc" : "货物情况",
								"de" : "Sendungshistorie",
								"es" : "Historial de envíos"
							},
	"NoLatestStatusRecord" : {
								"en" : "No Latest Status Record",
								"tc" : "沒有最新狀況記錄",
								"sc" : "没有最新状况记录",
								"de" : "Kein aktueller Statuseintrag",
								"es" : "Sin registro de estado más reciente"
							},
	"NoShipmentHistoryRecord" : {
								"en" : "No Shipment History Record",
								"tc" : "沒有貨物情況記錄",
								"sc" : "没有货物情况记录",
								"de" : "Kein Sendungsverlaufsdatensatz",
								"es" : "Sin registro de historial de envío"
							},
	"NoNotificationRecord" : {
								"en" : "No Notification Record",
								"tc" : "沒有通知記錄",
								"sc" : "没有通知记录",
								"de" : "Kein Benachrichtigungsdatensatz",
								"es" : "Sin registro de notificación"
							},					
	"Remarks" : 	{
								"en" : "Remarks",
								"tc" : "備註",
								"sc" : "备註",
								"de" : "Bemerkungen",
								"es" : "Observaciones"
							},
							
	"Port" : 				{
								"en" : "Port",
								"tc" : "航站",
								"sc" : "航站",
								"de" : "Hafen",
								"es" : "Puerto"
							},
	"Status" : 				{
								"en" : "Status",
								"tc" : "情況",
								"sc" : "情況",
								"de" : "Status",
								"es" : "Estado"
							},
	"Flight" : 				{
								"en" : "Flight",
								"tc" : "航班編號",
								"sc" : "航班编号",
								"de" : "Flugnummer",
								"es" : "número de vuelo"
							},
	"Milestone" : 				{
								"en" : "Milestone",
								"tc" : "進度",
								"sc" : "进度",
								"de" : "Meilenstein",
								"es" : "Hito"
							},
	"Depart" : 				{
								"en" : "Depart",
								"tc" : "出發",
								"sc" : "出发",
								"de" : "Abfahren",
								"es" : "Salir"
							},	
	"Arrival" : 				{
								"en" : "Arrival",
								"tc" : "抵達",
								"sc" : "抵达",
								"de" : "Ankunft",
								"es" : "Llegada"
							},
	"DepartTime" : 			{
								"en" : "Depart On",
								"tc" : "出發時間",
								"sc" : "出发时间",
								"de" : "Abfahrt am",
								"es" : "Salida el"
							},	
	"ArrivalTime" : 		{
								"en" : "Arrival On",
								"tc" : "抵達時間",
								"sc" : "抵达时间",
								"de" : "Ankunft am",
								"es" : "Llegada el"
							},
    "Total" : 				{
								"en" : "Total",
								"tc" : "總數",
								"sc" : "总数",
								"de" : "Gesamt",
								"es" : "Total"
							},
	"TemperatureAndVoltageInfo" : 	{
								"en" : "Temperature & Voltage Information",
								"tc" : "溫度資料",
								"sc" : "温度資料",
								"de" : "Temperatur- und Spannungsinformationen",
								"es" : "Información de temperatura y voltaje"
		
							},
	"TemperatureRange" : 	{
								"en" : "Temperature Range",
								"tc" : "溫度範圍",
								"sc" : "温度範围",
								"de" : "Temperaturbereich",
								"es" : "Rango de temperatura"
		
							},
	"Unit" :				{
								"en" : "Unit",
								"tc" : "單位",
								"sc" : "单位",
								"de" : "Einheit",
								"es" : "Unidad"
		
							},
	"Station" : 			{
								"en" : "Station",
								"tc" : "航站",
								"sc" : "航站",
								"de" : "Bahnhof",
								"es" : "Estación"
							},
	"CheckPoint" : 			{
								"en" : "Check Point",
								"tc" : "檢查點",
								"sc" : "检查点",
								"de" : "Kontrollpunkt",
								"es" : "Punto de control"
							},
	"Action" : 			{
								"en" : "Action",
								"tc" : "採取行動",
								"sc" : "采取行动",
								"de" : "Aktion",
								"es" : "Acción"
							},						
	"ProductName" : 		{
								"en" : "Ultra Track",
								"tc" : "智貨查",
								"sc" : "智货查",
								"de" : "Ultra Track",
								"es" : "Ultra Track"
							},
	"Latitude" : 			{
								"en" : "Latitude",
								"tc" : "緯度",
								"sc" : "纬度",
								"de" : "Breite",
								"es" : "Latitud"
							},
	"Longitude" : 			{
								"en" : "Longitude",
								"tc" : "經度",
								"sc" : "经度",
								"de" : "Längengrad",
								"es" : "Longitud"
							},
	"Temperature" : 			{
								"en" : "Temperature",
								"tc" : "溫度",
								"sc" : "温度",
								"de" : "Temperatur",
								"es" : "Temperatura"
							},
	"Temperature-Abbrev" : 	{
								"en" : "Temp",
								"tc" : "溫度",
								"sc" : "温度",
								"de" : "Temperatur",
								"es" : "Temperatura"
							},
	"Voltage" : 			{
								"en" : "Voltage",
								"tc" : "電壓",
								"sc" : "电压",
								"de" : "Stromspannung",
								"es" : "Voltaje"
							},
	"Voltage-Abbrev" : 		{
								"en" : "Volt",
								"tc" : "電壓",
								"sc" : "电压",
								"de" : "Volt",
								"es" : "Voltio"
							},
	"Humidity" : 			{
								"en" : "Relative humidity",
								"tc" : "相對濕度",
								"sc" : "相对湿度",
								"de" : "Relative Luftfeuchtigkeit",
								"es" : "Humedad relativa"
							},
	"Light" : 				{
								"en" : "Light",
								"tc" : "光度",
								"sc" : "光度",
								"de" : "Licht",
								"es" : "Luz"
							},
	"Shock" : 				{
								"en" : "Shock",
								"tc" : "震動",
								"sc" : "震动",
								"de" : "Schock",
								"es" : "Choque"
							},
	"DateTime" : 		{
								"en" : "DateTime",
								"tc" : "時間",
								"sc" : "时间",
								"de" : "Terminzeit",
								"es" : "Fecha y hora"
							},
	"LastUpdateTime" : 		{
								"en" : "Last Update Time",
								"tc" : "最後更新時間",
								"sc" : "最後更新时间",
								"de" : "Letzte Aktualisierungszeit",
								"es" : "Último tiempo de actualización"
							},
	"EventTime" : 			{
								"en" : "Event Time",
								"tc" : "發生時間",
								"sc" : "发生时间",
								"de" : "Ereigniszeit",
								"es" : "Hora del evento"
							},
	"Device" : 				{
								"en" : "Device",
								"tc" : "裝置",
								"sc" : "装置",
								"de" : "Gerät",
								"es" : "Dispositivo"
							},
	"SeeSensorData" : 		{
								"en" : "See Sensor Data",
								"tc" : "查看傳感器資料",
								"sc" : "查看传感器资料",
								"de" : "Ansicht von Sensordaten",
								"es" : "ver datos del sensor"
							},
	"Product" : 			{
								"en" : "Product ",
								"tc" : "產品",
								"sc" : "产品",
								"de" : "Produkt",
								"es" : "Producto"
							},
	"Transportation" : 			{
								"en" : "Transportation ",
								"tc" : "運輸",
								"sc" : "运输",
								"de" : "Transport",
								"es" : "Transporte"
							}
	
	
	
	
	
}

var HKG_Location = {
	
	"latitude" : 22.298328,
	"longitude" : 113.934465
}

// Modified at 20210521 - START
// swap color order from 1. blue 2. red to 1. red 2. blue
var color = ['#FF5C59', '#65A0D1']
//var color = ['#65A0D1', '#FF5C59']
//Modified at 20210521 - END

var awb_device_sensor_reading_url
var vue_ShipmentStatus

var strJSON_FreightStatus
var objOneRecord
var objNotification
var objBookingItems
var objLatestStatusItems
var objShipmentHistoryItems
var objNotificationItems
var objOSILineItems

var strJSON_NGTTDeviceSensorReading
var objNGTTDeviceSensorReading 

var strCurrentLanguage = 'en'

var intCurrentDeviceIndex = 0
var strCurrentSensorReadingType = 'Humidity'

var intCurrentOSMPolyLineColorIndex = 0
var intTimeDiffThresholdinMinutes4SameAirport = 30 //Added at 20210409

var intNoOfLabelsinCategoryAxis = 20


var strCurrentShipmentHistorySortDirection = 'asc'
var strCurrentNotificationSortDirection = 'asc'

var intLatestStatus_TotalPieces = 0
var dblLatestStatus_TotalWeight = 0

function initalize_ui() {
	
	
	var strTNTResult_Template = ''
	var strTNTResult_Content = ''
	
	strTNTResult_Template = $("#tnt_result_template").html();
	
	//Add image path to all images
	strTNTResult_Template = strTNTResult_Template.replace(/{{image_path}}/g, image_path + (image_path.charAt(image_path.length-1) != '/' ? '/' : ''))
	
	//Populate Localized Strings
	strTNTResult_Template = populateLocalizedStrings(strTNTResult_Template, strCurrentLanguage)
	
	strTNTResult_Content = strTNTResult_Template
	
	$("#TNT_Result-Content").html(strTNTResult_Content)
	
	
	//Add image path to all images
	
	/*
	if (objOneRecord == null) {
		$("#tnt_result").hide()
		$("#tnt_result img").each(function(){$(this).attr("src", image_path + $(this).attr("src"));})
		$("#tnt_result").show()
	}
	*/

	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#temperature_and_voltage").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	$("#BackToShipmentStatusTick").hide();

	$("#ShipmentStatus_Left").show();
	$("#ShipmentStatus_Right").show();
	
	// Suppress moment.js Deprecation Warnings
	moment.suppressDeprecationWarnings = true;
	
}

function initialize_shipment_status() {
	
	//Get OSI Line items in Freight Status Details
	objOSILineItems = getOSILineItems()       //TODO202109    double check mapping
	
	
	if (objOSILineItems.length == getEventItems().length) {   //TODO202109    double check mapping
		
		//Freight Status Detail Items contain only OSI Lines, the shipment should have issue so only display OSI Line Content
		//console.log('All Items is OSI Line.')
		
		genOSILineContent(objOSILineItems)
		
		$("#Latest_Status_Table-Error-OSILine").show()
		$("#Shipment_History_Table-Error-OSILine").show()
		$("#Notification_Table-Error-OSILine").show()
		
		$("#Latest_Status_Table").hide()
		$("#Latest_Status_Table-No-Result").hide()
		$("#Shipment_History_Table").hide()
		$("#Shipment_History_Table-No-Result").hide()
		$("#Notification_Table").hide()
		$("#Notification_Table-No-Result").hide()
		$("#Temperature_And_Voltage_Link").hide()
		
	}
	else {
		
		//Freight Status Detail Items contain not only OSI Lines, the shipment should be normal so continue with normal shipment status processing
		//console.log('Not All Items is OSI Line.')
		
		$("#Latest_Status_Table-Error-OSILine").hide()
		$("#Shipment_History_Table-Error-OSILine").hide()
		$("#Notification_Table-Error-OSILine").hide()
		
		//Adjust DateTime fields in Freight Status Details by their Day Change Indicator
		//adjustDateTimeByDayChangeIndicator(objOneRecord.FreightStatusDetails)   //TODO202109  commentout as 1R no mapping
		
		//Fill in Freight Status Information
		
		//Freight Status Master
		$("#FreightStatus-AWBPrefix").html(objOneRecord.waybill.waybillPrefix)
		$("#FreightStatus-AWBSuffix").html(objOneRecord.waybill.waybillNumber)
		$("#FreightStatus-CreateDT").html((objOneRecord.waybill.booking.shipmentDetails.event.dateTime != null ? objOneRecord.waybill.booking.shipmentDetails.event.dateTime : ''))  //TODO202109 formatDate
		
		$("#FreightStatus-Origin").html(objOneRecord.waybill.booking.transportMovement.departureLocation.code)    //TODO202109 1R map wrong
		$("#FreightStatus-Destination").html(objOneRecord.waybill.booking.transportMovement.arrivalLocation.code)
		
		$("#FreightStatus-QDPieces").html(objOneRecord.waybill.booking.shipmentDetails.totalPieceCount)
		$("#FreightStatus-QDWeight").html(objOneRecord.waybill.booking.shipmentDetails.totalGrossWeight.value)
		
		//Freight Status Details - Latest Status
		objLatestStatusItems = getLatestShipmentStatusDetails()
		
		if (objLatestStatusItems.length > 0) {
			genLatestStatusList(objLatestStatusItems)
			$("#Latest_Status_Table").show()
			$("#Latest_Status_Table-No-Result").hide()
		}
		else {
			
			$("#Latest_Status_Table").hide()
			$("#Latest_Status_Table-No-Result").show()
			
		}
		
		
		//Freight Status Details - Shipment History
		objShipmentHistoryItems = getShipmentHistoryItems()
		
		if (objShipmentHistoryItems.length > 0) {
			
			genShipmentHistoryList(objShipmentHistoryItems)
			toggleSortShipmentHistory()
			$("#Shipment_History_Table").show()
			$("#Shipment_History_Table-No-Result").hide()
		}
		else {
			$("#Shipment_History_Table").hide()
			$("#Shipment_History_Table-No-Result").show()
		}

		objNotificationItems = getNotificationItems();
		
		if (objNotificationItems.length > 0) {
			
			genNotificationList(objNotificationItems)
			toggleSortNotification()
			$("#Notification_Table").show()
			$("#Notification_Table-No-Result").hide()
		}
		else {
			$("#Notification_Table").hide()
			$("#Notification_Table-No-Result").show()
		}

		//Freight Status Details - Booking
		
		objBookingItems = getBookingItems() 
		genBookingList(objBookingItems)
		
		//Freight Status Devices
		$("#Temperature_And_Voltage_Link").hide()
		/*  //TODO202109
		if (objOneRecord.FreightStatusDevices.length > 0 && objOneRecord.FreightStatusDevices[0].FreightStatusDeviceHistoryLogs.length > 0) {
			genDevicesTemperatureAndVoltageList()
			$("#Temperature_And_Voltage_Link").show()
		}
		else {
			$("#Temperature_And_Voltage_Link").hide()
		}*/
		
	}

	
	
	
	
	
	
	//By jQuery getJSON method
	
	/*
	$.getJSON(url, function(result){
		
		objNGTTDeviceSensorReading = result
		
		//Convert DateTime field in Sensor Reading from String to Date
		for (var i = 0; i<objNGTTDeviceSensorReading.devices.length; i++) {
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].reading, 'dateTime')
		}

		convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.flight, 'dateTime')
		
		//Draw the mini map
		osm_drawMap(objNGTTDeviceSensorReading.devices[0].reading, 'mini');
		osm_addDeviceInfoOnMap(objNGTTDeviceSensorReading.devices[0].ID, osm_map_mini, objNGTTDeviceSensorReading.flight, objNGTTDeviceSensorReading.devices[0].reading, false);

		// Fill Humidity and its sparkline
		$("#humidity").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].humidity + '%')
		plotsparklines('#sparklines_humid', objNGTTDeviceSensorReading.devices[0].reading, 'Humidity') 

		// Fill Temperature and its sparkline
		$("#temperature").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].temperature + '&deg;C')
		plotsparklines('#sparklines_temp', objNGTTDeviceSensorReading.devices[0].reading, 'Temperature')
		
	});
	*/
	
}

function initialize_device_sensor_reading() {
	
	var objLastAvailableSensorReading
	
	if (objNGTTDeviceSensorReading.devices != null && objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[0].reading.length > 0) {
		
		//Added at 20210210 - START
		$("#TNT_Result-Content").html($("#TNT_Result-Content").html().replace(new RegExp("{{LocalizedString-Temperature}}", 'g'), (objNGTTDeviceSensorReading.inCooltainer ? LocalizedStrings['Product'][strCurrentLanguage] : LocalizedStrings['Transportation'][strCurrentLanguage]) + LocalizedStrings['Temperature'][strCurrentLanguage]))
		//Added at 20210210 - END
		
		//Convert DateTime field in Sensor Reading from String to Date and add Temperature in Fahrenheit Scale
		for (var i = 0; i<objNGTTDeviceSensorReading.devices.length; i++) {
			//Temporary clone reading as mapPointData as mapPointData array is under development by COIMS
			objNGTTDeviceSensorReading.devices[i].mapPointData = JSON.parse(JSON.stringify(objNGTTDeviceSensorReading.devices[i].reading))  //TODO202109 need remove
			
			
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].reading, 'dateTime')
			//Remove reading entries with just lat/lng but no sensor readings
			objNGTTDeviceSensorReading.devices[i].reading = objNGTTDeviceSensorReading.devices[i].reading.filter(function (objSensorReading) {
																return objSensorReading.temperature != null || objSensorReading.humidity != null || objSensorReading.light != null || objSensorReading.shock != null
															})
															
			//Added at 20210222 - START
			//Convert DateTime fields in mapPointData array from String to Date
			/* TODO202109
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].mapPointData, 'latLongDateTime')
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].mapPointData, 'temperatureDateTime')
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].mapPointData, 'humidityDateTime')
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].mapPointData, 'lightDateTime')
			convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.devices[i].mapPointData, 'shockDateTime')
			*/
			//Added at 20210222 - END
															
															
			addTemperatureinF(objNGTTDeviceSensorReading.devices[i].reading)
		}

		convertJSONArrayDateTimeFieldFromStringToDate(objNGTTDeviceSensorReading.flight, 'dateTime')
		
		//Added at 20210521 - START
		//Sort device array based on latLongDateTime of last mapPointData item
		
		objNGTTDeviceSensorReading.devices.sort(function (a, b) {
			return (a.reading[a.reading.length-1].dateTime > b.reading[b.reading.length-1].dateTime ? 1 : -1)
		});		
		
		//Added at 20210521 - END
		
		
		//Sensor Reading Device Buttons
	
		if (objNGTTDeviceSensorReading.devices != null && objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[0].reading.length > 0) {
			genSensorReadingDevicesList() 
		}
		
		
		//Show Sensor reading Summary section in Shipment Status
		$("#sensor_reading_Summary").show();
		$("#list_view").show();
		
		//Hide Sensor reading measurement type related UI components if it is not available
		/*
		if (objNGTTDeviceSensorReading.devices[0].reading[0].humidity == null) {
			$("#shipment-status_sensor_reading_humidity_group").hide();
			$("#button_plot_humidity").hide();
		}
		
		if (objNGTTDeviceSensorReading.devices[0].reading[0].light == null) {
			$("#shipment-status_sensor_reading_light_group").hide();
			$("#button_plot_light").hide();
		}
		
		if (objNGTTDeviceSensorReading.devices[0].reading[0].shock == null) {
			$("#shipment-status_sensor_reading_shock_group").hide();
			$("#button_plot_shock").hide();
		}
		*/
		
		
		//Draw the mini map
						
		if (osm_map != null) {
			
			osm_map.remove()
			osm_map = null
			
		}
		
		if (osm_map_mini != null) {
			
			osm_map_mini.remove()
			osm_map_mini = null
			
		}
		
		//Draw the mini map
		osm_drawMap(objNGTTDeviceSensorReading.devices[0].reading, 'mini');
		osm_addNGTTDeviceSensorReadingOnMap(osm_map_mini, objNGTTDeviceSensorReading, false);
		//osm_addDeviceInfoOnMap(objNGTTDeviceSensorReading.devices[0].id, osm_map_mini, objNGTTDeviceSensorReading.flight, objNGTTDeviceSensorReading.devices[0].reading, false);

		//Show and fill Temperature and its sparkline if it is available or hide the UI component if it is not available
		objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Temperature')
		if (objLastAvailableSensorReading != null) {
			$("#shipment-status_sensor_reading_temperature_group").show();
			$("#button_plot_temperature").show();
			$("#temperature").html(objLastAvailableSensorReading.temperature + '&deg;C' + ' (' + convertTemperatureCToF(objLastAvailableSensorReading.temperature) + '&deg;F)')
			$("#temperature_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
			plotsparklines('#sparklines_temp', objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Temperature')
		}
		else {
			$("#shipment-status_sensor_reading_temperature_group").hide();
			$("#button_plot_temperature").hide();
		}
		
		//$("#temperature").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].temperature + '&deg;C' + ' (' + convertTemperatureCToF(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].temperature) + '&deg;F)')
		//plotsparklines('#sparklines_temp', objNGTTDeviceSensorReading.devices[0].reading, 'Temperature')
		
		//Show and fill Humidity and its sparkline if it is available or hide the UI component if it is not available
		objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Humidity')
		if (objLastAvailableSensorReading != null) {
			$("#shipment-status_sensor_reading_humidity_group").show();
			$("#button_plot_humidity").show();
			$("#humidity").html(objLastAvailableSensorReading.humidity + '%')
			$("#humidity_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
			plotsparklines('#sparklines_humid', objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Humidity') 
		}
		else {
			$("#shipment-status_sensor_reading_humidity_group").hide();
			$("#button_plot_humidity").hide();
		}
		
		//$("#humidity").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].humidity + '%')
		//plotsparklines('#sparklines_humid', objNGTTDeviceSensorReading.devices[0].reading, 'Humidity') 
		
		//Show and fill Light and its sparkline if it is available or hide the UI component if it is not available
		objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Light')
		if (objLastAvailableSensorReading != null) {
			$("#shipment-status_sensor_reading_light_group").show();
			$("#button_plot_light").show();
			$("#light").html(objLastAvailableSensorReading.light + 'lx')
			$("#light_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
			plotsparklines('#sparklines_light', objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Light') 
		}
		else {
			$("#shipment-status_sensor_reading_light_group").hide();
			$("#button_plot_light").hide();
		}

		//$("#light").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].light + 'lx')
		//plotsparklines('#sparklines_light', objNGTTDeviceSensorReading.devices[0].reading, 'Light')
		
		//Show and fill Shock and its sparkline if it is available or hide the UI component if it is not available
		objLastAvailableSensorReading = getLastAvailableSensorReading(objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Shock')
		if (objLastAvailableSensorReading != null) {
			$("#shipment-status_sensor_reading_shock_group").show();
			$("#button_plot_shock").show();
			$("#shock").html(objLastAvailableSensorReading.shock)
			$("#shock_last_update_time").html(LocalizedStrings['LastUpdateTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objLastAvailableSensorReading.dateTime)).format("YYYY-MM-DD HH:mm"))
			plotsparklines('#sparklines_shock', objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].reading, 'Shock')
		}
		else {
			$("#shipment-status_sensor_reading_shock_group").hide();
			$("#button_plot_shock").hide();
		}
		
		//$("#shock").html(objNGTTDeviceSensorReading.devices[0].reading[objNGTTDeviceSensorReading.devices[0].reading.length-1].shock)
		//plotsparklines('#sparklines_shock', objNGTTDeviceSensorReading.devices[0].reading, 'Shock')
		
		
		//Add Temperature Scale button
		if (!$("#Temperature-Scale-Button").data("kendoSwitch")) {
			$("#Temperature-Scale-Button").kendoSwitch({
				messages: {
					checked: "&deg;F",
					unchecked: "&deg;C"
				}
				,
				change: function (e) {
					showDeviceSensorReadings(intCurrentDeviceIndex, 'Temperature')
				}
				
			});
		}
		
		
	}
	else {
		
		$("#sensor_reading_Summary").hide()
		
	}
	
}

function populateLocalizedStrings(strContent, strLanguage) {
	
	var strProcessedContent
	
	strProcessedContent = strContent
	
	for (var key in LocalizedStrings) {
		
		if (key != 'Temperature') {
			
			strProcessedContent = strProcessedContent.replace(new RegExp("{{LocalizedString-" + key + "}}", 'g'), LocalizedStrings[key][strLanguage])
			
		}
		
	}
	
	return strProcessedContent
	
}

function convertJSONArrayDateTimeFieldFromStringToDate(objJSONArray, strDateTimeFieldName) {
	
	for (var i = 0; i<objJSONArray.length; i++) {
	
		if (objJSONArray[i][strDateTimeFieldName] != null) { //Added at 20210222 : add checking for availability of the datetime field
			//objJSONArray[i][strDateTimeFieldName] = new Date(Date.parse(objJSONArray[i][strDateTimeFieldName]))
			objJSONArray[i][strDateTimeFieldName] = new Date(objJSONArray[i][strDateTimeFieldName])
		}
		
	}
}

function addTemperatureinF(objJSONArray) {
	
	for (var i = 0; i<objJSONArray.length; i++) {
	
		objJSONArray[i].temperature_f = (objJSONArray[i].temperature == null ? null : convertTemperatureCToF(objJSONArray[i].temperature))
		
	}
	
}



function getCookie(cname) {
	
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
						c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
		}
	}
	return "";
}

function convertTemperatureCToF(TempinC) {
	
	return (TempinC * 9 / 5 + 32).toFixed(2)
	
}

function getLastAvailableSensorReading(objSensorReadings, MeasurementType) {
	
	var objLastAvailableSensorReading
	
	for (var i = objSensorReadings.length - 1; i>=0; i--) {
		if (objSensorReadings[i][MeasurementType.toLowerCase()] != null) {
			objLastAvailableSensorReading = objSensorReadings[i]
			break
		}
	}
	
	return objLastAvailableSensorReading
}




function resetOSMPolyLineColorIndex() {
	
	intCurrentOSMPolyLineColorIndex = 0
		
}

function incrementOSMPolyLineColorIndex() {
	
	if (intCurrentOSMPolyLineColorIndex == color.length - 1) {
		
		intCurrentOSMPolyLineColorIndex = 0
		
	}
	else {
		
		intCurrentOSMPolyLineColorIndex++
	}
	
}

function getDayChangeIndicator_DayIncrement(strDayChangeIndicator) {
	
	var intDayChangeIndicatorOffset = 4 
	var intDayIncrement = 0
	
	switch(strDayChangeIndicator) {
		case 'P':
			intDayIncrement = -1
			break;
		case 'N':
			intDayIncrement = 1
			break;
		case 'S':
			intDayIncrement = 2
			break;
		case 'T':
			intDayIncrement = 3
			break;
		case 'A':	
		case 'B':
		case 'C':
		case 'D':
		case 'E':
		case 'F':
		case 'G':
		case 'H':
		case 'I':
		case 'J':
		case 'K':
		case 'L':
			intDayIncrement = strDayChangeIndicator.charCodeAt(0) - 'A'.charCodeAt(0) + intDayChangeIndicatorOffset
			break;
		default:
			intDayIncrement = 0
    
	}
	
	return intDayIncrement

	
}

function adjustDateTimeByDayChangeIndicator(arrFreightStatusDetails) {
	
	for (var i = 0; i<arrFreightStatusDetails.length; i++) {
	
		if (arrFreightStatusDetails[i].MDDate != null && arrFreightStatusDetails[i].MDDayChgIndicator != '') {
			
			arrFreightStatusDetails[i].MDDate.Seconds = arrFreightStatusDetails[i].MDDate.Seconds + (getDayChangeIndicator_DayIncrement(arrFreightStatusDetails[i].MDDayChgIndicator) * 24 * 60 * 60)
			
		}
		
		if (arrFreightStatusDetails[i].DTTime != null && arrFreightStatusDetails[i].DTDayChgIndicator != '') {
			
			arrFreightStatusDetails[i].DTTime.Seconds = arrFreightStatusDetails[i].DTTime.Seconds + (getDayChangeIndicator_DayIncrement(arrFreightStatusDetails[i].DTDayChgIndicator) * 24 * 60 * 60)
			
		}
		
		if (arrFreightStatusDetails[i].ATTime != null && arrFreightStatusDetails[i].ATDayChgIndicator != '') {
			
			arrFreightStatusDetails[i].ATTime.Seconds = arrFreightStatusDetails[i].ATTime.Seconds + (getDayChangeIndicator_DayIncrement(arrFreightStatusDetails[i].ATDayChgIndicator) * 24 * 60 * 60)
			
		}
		
	}
	
}