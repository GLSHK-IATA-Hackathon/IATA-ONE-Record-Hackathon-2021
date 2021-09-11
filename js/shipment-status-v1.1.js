//========================================================================================================================================================================================================
//Shipment Status related JavaScript by vue.js - START

function formatAPIDate(gbTS, dateformatString) {

	var _currentDateOffset = new Date().getTimezoneOffset() * 60000;
	var _returnDate = new Date(gbTS.Seconds * 1000 + _currentDateOffset);
	return moment(String(_returnDate)).format(dateformatString);

}

function getStatusDescByCode(statusCode) {
	return StatusMapping[statusCode];
}

function getNotificationDescByCode(notificationCode) {
	return NotificationMapping[notificationCode];
}

function getLatestShipmentStatusDetails() {
				
	var PieceWeigthRelatedStatusCodes = ['DLV', 'RCF', 'ARR', 'DEP', 'MAN', 'RCS', 'FOH']
	
	var intTotalFOHPieces = 0
	var dblTotalFOHWeight = 0
	
	var intTotalMANPieces = 0
	var dblTotalMANWeight = 0
	
	var intTotalShipmentPieces = 0;
	var intTotalProcessedPieces = 0;
	
	var dblTotalShipmentWeight = 0;
	var dblTotalProcessedWeight = 0;
	
	var AirportSummary = {};
	var Flight = {};
	
	var LatestShipmentStatusDetails = [];
				
	for (var i=0; i<objOneRecord.waybill.booking.shipmentDetails.containedPiece.length; i++) {
		
		var MdPort = "HKG";
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].departureLocation != null){
			MdPort = objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].departureLocation.code
		}else if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].arrivalLocation != null){
			MdPort = objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].arrivalLocation.code
		}
		
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'FOH' && MdPort == objOneRecord.waybill.booking.transportMovement.departureLocation.code) {
			
			intTotalFOHPieces += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].containedItem[0].quantity.value)
			dblTotalFOHWeight += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].grossWeight.value)
			
		}
		
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'MAN' && MdPort == objOneRecord.waybill.booking.transportMovement.departureLocation.code) {
			
			intTotalMANPieces += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].containedItem[0].quantity.value)
			dblTotalMANWeight += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].grossWeight.value)
			
		}
			
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'FOH'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'RCS'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'MAN'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'DEP'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'ARR'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'RCF'
			|| objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'DLV'
		) {
		
			if (AirportSummary[MdPort] === undefined) {
				
				AirportSummary[MdPort] = {
					
					"FOH": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"RCS": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"MAN": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"DEP": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"ARR": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"RCF": { TotalPieces: 0, TotalWeight: 0, Flights: [] },
					"DLV": { TotalPieces: 0, TotalWeight: 0, Flights: [] }
					
				}
				
			}
			
			
			AirportSummary[MdPort][objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode].TotalPieces += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].containedItem[0].quantity.value)
			
			AirportSummary[MdPort][objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode].TotalWeight += parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].grossWeight.value)
			
			Flight = {
				row : i, 
				FlightNumber : (
									objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportIdentifier != null 
									? objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportIdentifier + ' ' 
									+ (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].arrivalDate != null ? objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].arrivalDate : '') //TODO202109 FormatAPIDate
									: 
									''
								),
				EventTime : (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode == 'DEP' ? objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].event.dateTime : objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].arrivalDate),
				Airline : String(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportIdentifier).substring(0,2),
				Airport : MdPort,
				Pieces : parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].containedItem[0].quantity.value),
				Weight : parseFloat(objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].grossWeight.value)
			}
			
			AirportSummary[MdPort][objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode].Flights.push(Flight)
		
			
			
		}
		
	}
	
	if (intTotalFOHPieces >= intTotalMANPieces && intTotalFOHPieces > 0) {
		
		intTotalShipmentPieces = intTotalFOHPieces
		dblTotalShipmentWeight = dblTotalFOHWeight
		
	}
	else if (intTotalMANPieces >= intTotalFOHPieces && intTotalMANPieces > 0) {
		
		intTotalShipmentPieces = intTotalMANPieces
		dblTotalShipmentWeight = dblTotalMANWeight
		
	}
	else {
		
		intTotalShipmentPieces = parseFloat(objOneRecord.waybill.booking.shipmentDetails.totalPieceCount)
		dblTotalShipmentWeight = parseFloat(objOneRecord.waybill.booking.shipmentDetails.totalGrossWeight.value)
		
	}
	
	//console.log('Total Pieces : ' + intTotalShipmentPieces)
	
	var Airports = Object.keys(AirportSummary)
	
	Airports_loop:
	for (var i = Airports.length - 1; i >= 0; i--) {
		
		var Airport = Airports[i];
		
		for (j = 0; j < PieceWeigthRelatedStatusCodes.length; j++) {
			if (AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalPieces > intTotalProcessedPieces && AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalPieces <= intTotalShipmentPieces) {
				
				var LatestShipmentStatusDetail = {}
					
				LatestShipmentStatusDetail.Airport = Airport
				LatestShipmentStatusDetail.StatusCode = PieceWeigthRelatedStatusCodes[j]
				//LatestShipmentStatusDetail.FlightNumber = (AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].Flights.length == 1 ? AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].Flights[0].FlightNumber : '')
				LatestShipmentStatusDetail.FlightNumber = (AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].Flights.length > 0 ? AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].Flights[0].FlightNumber : '')
				
				LatestShipmentStatusDetail.Pieces = AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalPieces - intTotalProcessedPieces
				LatestShipmentStatusDetail.Weight = (AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalWeight - dblTotalProcessedWeight > dblTotalShipmentWeight - dblTotalProcessedWeight  ? dblTotalShipmentWeight - dblTotalProcessedWeight : AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalWeight - dblTotalProcessedWeight)
				
				LatestShipmentStatusDetails.unshift(LatestShipmentStatusDetail)
				
				intTotalProcessedPieces += AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalPieces - intTotalProcessedPieces
				dblTotalProcessedWeight += AirportSummary[Airport][PieceWeigthRelatedStatusCodes[j]].TotalWeight - dblTotalProcessedWeight
				
				if (intTotalProcessedPieces >= intTotalShipmentPieces) {
					break Airports_loop
				}
				
				
			}
			
		}
		
	}
	
	intLatestStatus_TotalPieces = intTotalProcessedPieces
	dblLatestStatus_TotalWeight = dblTotalProcessedWeight
	
	
	return LatestShipmentStatusDetails;
	
	
}

function genLatestStatusList(objLatestStatusItems) {
	
	var strLatestStatus_Template = ''
	var strLatest_Status_Content = ''
	
	strLatestStatus_Template = $("#latest_status_template").html();
	
	for (var key in objLatestStatusItems) {
	
		strLatest_Status_Content += strLatestStatus_Template
		
							   .replace("{{LatestFreightStatusDetail-Airport}}", objLatestStatusItems[key].Airport)
							   .replace("{{LatestFreightStatusDetail-StatusCode-Image}}", image_path + objLatestStatusItems[key].StatusCode + '-20x20.png')
							   .replace("{{LatestFreightStatusDetail-StatusCodeDesc}}", getStatusDescByCode(objLatestStatusItems[key].StatusCode))
							   
							   
							   .replace("{{LatestFreightStatusDetail-Pieces}}", objLatestStatusItems[key].Pieces)
							   .replace("{{LatestFreightStatusDetail-Weight}}", objLatestStatusItems[key].Weight)
							   
							   .replace("{{LatestFreightStatusDetail-FlightNumber}}", objLatestStatusItems[key].FlightNumber)
							   .replace("{{LatestFreightStatusDetail-StatusCode}}", objLatestStatusItems[key].StatusCode)
							   
	}
	
	$("#Latest_Status-Content").html(strLatest_Status_Content)
	
	$("#LatestStatus-TotalPieces").html(intLatestStatus_TotalPieces)
	$("#LatestStatus_TotalWeight").html(dblLatestStatus_TotalWeight)
	
}


function getBookingItems() {
	
	return objOneRecord.waybill.booking.shipmentDetails.containedPiece.filter(function (objContainedPiece) {
		return objContainedPiece.event[0].eventCode  == 'BKD' 
	});	
		
}

function genBookingList(objBookingItems) {
	
	var strBooking_Template = ''
	var strBooking_Content = ''
	
	strBooking_Template = $("#booking_status_template").html();
	
	strBooking_Template = populateLocalizedStrings(strBooking_Template, strCurrentLanguage)
	
	
	
	for (var key in objBookingItems) {
	
		var statusVar = "SPACE CONFIRMED"
		if (objBookingItems[key].serviceRequest !=null && objBookingItems[key].serviceRequest[0] != null && objBookingItems[key].serviceRequest[0].code == 'OSI'){
			statusVar = objBookingItems[key].serviceRequest[0].description
		}
		strBooking_Content += strBooking_Template
		
							   .replace("{{Booking-MDPort1}}", objBookingItems[key].transportSegment[0].departureLocation.code)
							   .replace("{{Booking-Plane-Image}}", image_path + 'plane-20x20.png')
							   .replace("{{Booking-MDPort2}}", objBookingItems[key].transportSegment[0].arrivalLocation.code)
							   
							   .replace("{{Booking-FlightNumber}}", objBookingItems[key].transportSegment[0].transportIdentifier)
							   .replace("{{Booking-FlightDate}}", (objBookingItems[key].transportSegment[0].arrivalDate != null ? objBookingItems[key].transportSegment[0].arrivalDate : ''))
							   
							   .replace("{{Booking-DTTime}}", (objBookingItems[key].transportSegment[0].event[0].dateTime != null ? objBookingItems[key].transportSegment[0].event[0].dateTime : ''))
							   .replace("{{Booking-ATTime}}", (objBookingItems[key].transportSegment[0].event[1].dateTime != null ? objBookingItems[key].transportSegment[0].event[1].dateTime : ''))
							   
							   .replace("{{Booking-QDPieces}}", parseFloat(objBookingItems[key].containedItem[0].quantity.value))
							   .replace("{{Booking-QDWeight}}", parseFloat(objBookingItems[key].grossWeight.value))
							   .replace("{{Booking-Status}}", statusVar)
							   
							   /*
							   .replace("{{Booking-Status}}", (getBookingOSILine(objBookingItems[key].DetailSeq - 1) != '' ? getBookingOSILine(objBookingItems[key].DetailSeq - 1).replace(/[A-Z]{3} TO [A-Z]{3} /g, '').replace(/\w+/g, function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();}) : ''))*/  //TODO202109
							   
							   
							  
			
		
	}
	
	$("#Booking-Content").html(strBooking_Content)
	
	
}

function getBookingOSILine(intFreightStatusDetailIndex) {
	return (objOneRecord.FreightStatusDetails[intFreightStatusDetailIndex + 1] && objOneRecord.FreightStatusDetails[intFreightStatusDetailIndex + 1].StatusCode == 'OSI' ? objOneRecord.FreightStatusDetails[intFreightStatusDetailIndex + 1].OSILine1 : '')
}

function getULDInfo(intFreightStatusDetailIndex) {
				
	var strULDInfo = ""
	
	for (var i=intFreightStatusDetailIndex + 1; i < objOneRecord.waybill.booking.shipmentDetails.containedPiece.length; i++) {
	
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode != 'ULD') {
			break;
		}
		else {
			
			strULDInfo += (strULDInfo == '' ? '' : ' / ') + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.uIdTypeCode + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.serialNumber + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.ownerCode
			
		}
		
	}
	
	return strULDInfo
	
}

function getULDInfo2(intFreightStatusDetailIndex) {
				
	var strULDInfo = ""
	
	for (var i=intFreightStatusDetailIndex + 1; i < objOneRecord.waybill.booking.shipmentDetails.containedPiece.length; i++) {
	
		if (objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].event[0].eventCode != 'ULD') {
			break;
		}
		else {
			
			strULDInfo += (strULDInfo == '' ? '' : ' / ') + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.uIdTypeCode + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.serialNumber + objOneRecord.waybill.booking.shipmentDetails.containedPiece[i].transportSegment[0].transportedUIds.ownerCode
			
		}
		
	}
	
	return strULDInfo
	
}
			
function getShipmentHistoryItems() {
	
	return objOneRecord.waybill.booking.shipmentDetails.containedPiece.filter(function (objContainedPiece) {
		return objContainedPiece.event[0].eventCode  != 'BKD' && objContainedPiece.event[0].eventCode != 'OSI' && objContainedPiece.event[0].eventCode != 'ULD'//TODO202109
	});

}

function getNotificationItems() {	
	return objNotification.notification;
}

function genShipmentHistoryList(objShipmentHistoryItems) {
	
	var strShipment_History_Template = ''
	var strShipment_History_Content = ''
	
	strShipment_History_Template = $("#shipment_history_template").html();
	
	strShipment_History_Template = populateLocalizedStrings(strShipment_History_Template, strCurrentLanguage)
	
	var fn = ''
	var lastFn = ''
	
	for (var key in objShipmentHistoryItems) {
	
		var MdPort = "HKG"
		if (objShipmentHistoryItems[key].transportSegment[0].departureLocation!=null){
			MdPort = objShipmentHistoryItems[key].transportSegment[0].departureLocation.code;
		}else if (objShipmentHistoryItems[key].transportSegment[0].arrivalLocation!=null){
			MdPort = objShipmentHistoryItems[key].transportSegment[0].arrivalLocation.code;
		}
		
		if (objShipmentHistoryItems[key].transportSegment[0].transportIdentifier != null && objShipmentHistoryItems[key].transportSegment[0].transportIdentifier != ''){
			fn = objShipmentHistoryItems[key].transportSegment[0].transportIdentifier;
			lastFn = fn;
		}else{
			
		}
		
		var Actual = 'Y'
		if (objShipmentHistoryItems[key].event[0] !=null && objShipmentHistoryItems[key].event[0].eventTypeIndicator == 'P'){
			Actual = 'N'
		}

		strShipment_History_Content += strShipment_History_Template
									   .replace("class=\"shipment-status_status\"", Actual == 'N' ? "class=\"shipment-status_status\" style=\"color:red;\"": "class=\"shipment-status_status\"")
									   .replace("{{ShipmentHistory-StatusCode-Image}}", image_path + objShipmentHistoryItems[key].event[0].eventCode + '.png')
									   .replace("{{ShipmentHistory-StatusCode)}}", getStatusDescByCode(objShipmentHistoryItems[key].event[0].eventCode))
									   .replace("{{ShipmentHistory-MDPort1}}", MdPort)
									   .replace("{{ShipmentHistory-EventTime}}", ((objShipmentHistoryItems[key].event[0].eventCode == 'DEP' && objShipmentHistoryItems[key].transportSegment[0].event.dateTime != null) || (objShipmentHistoryItems[key].event[0].eventCode != 'DEP' && objShipmentHistoryItems[key].transportSegment[0].arrivalDate != null) ? (objShipmentHistoryItems[key].event[0].eventCode == 'DEP' ? objShipmentHistoryItems[key].transportSegment[0].event.dateTime: objShipmentHistoryItems[key].transportSegment[0].arrivalDate) : ''))  //TODO202109 FORMAT date
									   .replace("{{ShipmentHistory-FlightInfo}}", ((objShipmentHistoryItems[key].transportSegment[0].transportIdentifier != null && objShipmentHistoryItems[key].transportSegment[0].transportIdentifier != '') ? LocalizedStrings['Flight'][strCurrentLanguage] + ': ' + objShipmentHistoryItems[key].transportSegment[0].transportIdentifier + ' ' + (objShipmentHistoryItems[key].transportSegment[0].arrivalDate != null ? objShipmentHistoryItems[key].transportSegment[0].arrivalDate : '') : LocalizedStrings['Flight'][strCurrentLanguage] + ': ' + lastFn + ' ' + (objShipmentHistoryItems[key].transportSegment[0].arrivalDate != null ? objShipmentHistoryItems[key].transportSegment[0].arrivalDate : '')))
									   .replace("{{ShipmentHistory-QDPieces}}", parseFloat(objShipmentHistoryItems[key].containedItem[0].quantity.value))
									   .replace("{{ShipmentHistory-QDWeight}}", parseFloat(objShipmentHistoryItems[key].grossWeight.value))
									   .replace("{{ShipmentHistory-Remarks}}", (getULDInfo2(objShipmentHistoryItems[key].DetailSeq - 1) != '' ? LocalizedStrings['Remarks'][strCurrentLanguage] + ': ' + getULDInfo2(objShipmentHistoryItems[key].DetailSeq - 1) : '')) //TODO202109
			
		
	}
	
	$("#ShipmentHistory-Content").html(strShipment_History_Content)
	
	
}

function genNotificationList(objNotificationItems){
	var strNotification_Template = ''
	var strNotification_Content = ''
	
	strNotification_Template = $("#notification_template").html();
	
	strNotification_Template = populateLocalizedStrings(strNotification_Template, strCurrentLanguage)
	
	for (var key in objNotificationItems) {
		strNotification_Content += strNotification_Template
		.replace("{{Notification-NotificationCode-Image}}", "img/notification/" + objNotificationItems[key].notificationCode + '.png')
		.replace("{{Notification-NotificationCode)}}", getNotificationDescByCode(objNotificationItems[key].notificationCode))
		.replace("{{Notification-NotificationTime}}", objNotificationItems[key].notificationTime)
		.replace("{{Notification-NotificationDesc}}", objNotificationItems[key].notificationDesc)
	}
	
	$("#Notification-Content").html(strNotification_Content)
}

function getOSILineItems() {
	/*
	return objOneRecord.FreightStatusDetails.filter(function (FreightStatusDetail) {
		return FreightStatusDetail.StatusCode == 'OSI'
	});			*/
	
	return objOneRecord.waybill.booking.shipmentDetails.containedPiece.filter(function (objContainedPiece) {
		//console.log(objContainedPiece);
		return objContainedPiece.event[0].eventCode == 'BKD'
	});
		
}

function genOSILineContent(objOSILineItems) {
	
	var strOSILineContent = ''
	
	for (var key in objOSILineItems) {
		
		strOSILineContent += (strOSILineContent == '' ? '' : ', ') + objOSILineItems[key].OSILine2
		
	}
	
	$("#Latest_Status-OSILine-Content").html(strOSILineContent)
	$("#ShipmentHistory-OSILine-Content").html(strOSILineContent)
	
}

function toggleSortShipmentHistory() {
	
	//Toggle Sort Direction
	strCurrentShipmentHistorySortDirection = (strCurrentShipmentHistorySortDirection == 'asc' ? 'desc' : 'asc')
	$("#Shipment_History_Sort_Direction_Image").attr('src', image_path + 'sort-' + strCurrentShipmentHistorySortDirection + '.png') 
	
	if (strCurrentShipmentHistorySortDirection == 'asc') {
			objShipmentHistoryItems.sort(function (a, b) {
						//return a.DetailSeq - b.DetailSeq
						return (a.transportSegment[0].arrivalDate > b.transportSegment[0].arrivalDate ? 1 : -1)
					});		
	}
	else {
		
		objShipmentHistoryItems.sort(function (a, b) {
						//return b.DetailSeq - a.DetailSeq
						return (a.transportSegment[0].arrivalDate > b.transportSegment[0].arrivalDate ? -1 : 1)
					});			
		
	}
	
	genShipmentHistoryList(objShipmentHistoryItems)
	
}

function toggleSortNotification() {
	
	//Toggle Sort Direction
	strCurrentNotificationSortDirection = (strCurrentNotificationSortDirection == 'asc' ? 'desc' : 'asc')
	
	$("#Notification_Sort_Direction_Image").attr('src', image_path + 'sort-' + strCurrentNotificationSortDirection + '.png') 
	
	if (strCurrentNotificationSortDirection == 'asc') {
		objNotificationItems.sort(function (a, b) {
						return (a.notificationTime > b.notificationTime ? 1 : -1)
					});		
	}
	else {
		objNotificationItems.sort(function (a, b) {
						return (a.notificationTime > b.notificationTime ? -1 : 1)
					});			
		
	}
	genNotificationList(objNotificationItems)
	
}

function genDevicesTemperatureAndVoltageList() {
	
	var strTemperature_and_Voltage_Template = ''
	var strTemperature_and_Voltage_Content = ''
	
	strTemperature_and_Voltage_Template = $("#temperature_and_voltage_template").html();
	
	strTemperature_and_Voltage_Template = populateLocalizedStrings(strTemperature_and_Voltage_Template, strCurrentLanguage)
	
	//Added at 20210210 - START
	var strULDNo = ''
	objOneRecord.FreightStatusDevices.sort(function (a, b) {
						return (a.ULDNo == b.ULDNo ? 0 : (a.ULDNo > b.ULDNo ? 1 : -1))
					});	
	//Added at 20210210 - END
					
	
	for (var key in objOneRecord.FreightStatusDevices) {
		
		if (strULDNo != objOneRecord.FreightStatusDevices[key].ULDNo) { //Add if condition at 20210210
	
			strTemperature_and_Voltage_Content +=  strTemperature_and_Voltage_Template
			
													.replace("{{TemperatureAndVoltage-Device-TemperatureLBound}}", objOneRecord.FreightStatusDevices[key].TemperatureLBound)
													.replace("{{TemperatureAndVoltage-Device-TemperatureUBound}}", objOneRecord.FreightStatusDevices[key].TemperatureUBound)
													.replace("{{TemperatureAndVoltage-Device-TemperatureUnit}}", objOneRecord.FreightStatusDevices[key].TemperatureUnit)
													
													.replace("{{TemperatureAndVoltage-Device-ULDNo}}", objOneRecord.FreightStatusDevices[key].ULDNo)
													.replace("{{TemperatureAndVoltage-Device-VoltageAtOrigin}}", objOneRecord.FreightStatusDevices[key].VoltageAtOrigin)	
													.replace("{{TemperatureAndVoltage-Device-VoltageAtDestination}}", objOneRecord.FreightStatusDevices[key].VoltageAtDestination)	
													.replace("{{TemperatureAndVoltage-Device-VoltageUnit}}", objOneRecord.FreightStatusDevices[key].VoltageUnit)	
													
													.replace("{{TemperatureAndVoltage-DeviceIndex}}", objOneRecord.FreightStatusDevices[key].DeviceSeq-1)	
			
			//Added at 20210210 - START
			strULDNo = objOneRecord.FreightStatusDevices[key].ULDNo
			//Added at 20210210 - END
		}
		
		

	}
	
	
	$("#Temperature_and_Voltage-Content").html(strTemperature_and_Voltage_Content)
	
	
}

//Shipment Status Events - START

function showTemperatureAndVoltage() {

	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#ShipmentStatus_Left").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#BackToShipmentStatusTick").show();
	$("#temperature_and_voltage").show();
	
	//Added at 20210210 - START
	var strULDNo = ''
	objOneRecord.FreightStatusDevices.sort(function (a, b) {
						return (a.ULDNo == b.ULDNo ? 0 : (a.ULDNo > b.ULDNo ? 1 : -1))
					});	
	//Added at 20210210 - END
	
	for (var i = 0; i< objOneRecord.FreightStatusDevices.length; i++) {
		
		if (strULDNo != objOneRecord.FreightStatusDevices[i].ULDNo) { //Add if condition at 20210210
			//Modified at 20210211 : Use objOneRecord.FreightStatusDevices[i].DeviceSeq-1 instead of i as the DeviceSeq may not be same as i due to FreightStatusDevices has been sorted
			drawTemperatureAndVoltageGrid('FreightStatusDevice' + (objOneRecord.FreightStatusDevices[i].DeviceSeq-1), objOneRecord.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs)
			//drawTemperatureAndVoltageGrid('FreightStatusDevice' + i, objOneRecord.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs)
			//Added at 20210210 - START
			strULDNo = objOneRecord.FreightStatusDevices[i].ULDNo
			//Added at 20210210 - END
		}
	}
}

function BackToShipmentStatus_Temp() {

	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#temperature_and_voltage").hide();
	$("#BackToShipmentStatusTick").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Left").show();
	$("#ShipmentStatus_Right").show();
	
	if (objNGTTDeviceSensorReading.devices != null && objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[0].reading.length > 0) {
		$("#list_view").show();
	}
	
}

function toggleBookingStatus() {

	$("#Booking_Status_Table").toggle();
	$("#Booking_Status_Image").attr('src', ($("#Booking_Status_Image").attr('src') == image_path + 'arrow-right.png' ? image_path + 'arrow-down.png' : image_path + 'arrow-right.png')) 

}
			
function showFullMap() {

	$("#ShipmentStatus_Left").hide();
	$("#ShipmentStatus_Right").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#temperature_and_voltage").hide();
	$("#BackToShipmentStatusTick").hide();
	$("#list_view").hide();
	
	$("#osm_map").show();
	$("#map_view").show();
	
	if (osm_map == null) {
		osm_drawMap(objNGTTDeviceSensorReading.devices[0].reading, 'full');
		osm_addNGTTDeviceSensorReadingOnMap(osm_map, objNGTTDeviceSensorReading, true);
		//osm_addDeviceInfoOnMap(objNGTTDeviceSensorReading.devices[0].id, osm_map, objNGTTDeviceSensorReading.flight, objNGTTDeviceSensorReading.devices[0].reading, true);
	}
	

}



function ShipmentStatus_ShowTemperature() {

	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#osm_map").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	showDeviceSensorReadings(0, 'Temperature')
	

}		

function ShipmentStatus_ShowHumidity() {

	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#osm_map").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	
	showDeviceSensorReadings(0, 'Humidity')

}

function ShipmentStatus_ShowLight() {

	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#osm_map").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	
	showDeviceSensorReadings(0, 'Light')

}

function ShipmentStatus_ShowShock() {

	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#osm_map").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	
	showDeviceSensorReadings(0, 'Shock')

}


/*
$("#map_expand").click(function() {
				
	$("#ShipmentStatus_Left").hide();
	$("#ShipmentStatus_Right").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#BackToShipmentStatusTick").hide();
	$("#osm_map").show();
	
	osm_drawMap(objNGTTDeviceSensorReading.devices[0].reading, 'full');
	osm_addDeviceInfoOnMap(objNGTTDeviceSensorReading.devices[0].id, osm_map, objNGTTDeviceSensorReading.flight, objNGTTDeviceSensorReading.devices[0].reading, true);
	
});
*/

//Shipment Status Events - END

//Tab UI function - START
			
function switchTab(objTab, tabName) {
  
	// Declare all variables
	var i, tabcontent, tablinks;

	  // Get all elements with class="tabcontent" and hide them
	  tabcontent = document.getElementsByClassName("shipment-status_tabcontent");
	  for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	  }

	  // Get all elements with class="tablinks" and remove the class "active"
	  tablinks = document.getElementsByClassName("tablinks");
	  for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	  }

	  // Show the current tab, and add an "active" class to the button that opened the tab
	  document.getElementById(tabName).style.display = "block";
	  objTab.className += " active";

}

//Tab UI function - END


//202109
function getEventItems() {
	/*
	return objOneRecord.FreightStatusDetails.filter(function (FreightStatusDetail) {
		return FreightStatusDetail.StatusCode == 'OSI'
	});			*/
	
	return objOneRecord.waybill.booking.shipmentDetails.containedPiece.filter(function (objContainedPiece) {
		return objContainedPiece.event[0].eventCode  != null && objContainedPiece.event[0].eventCode != ''
	});
		
}


//Shipment Status related JavaScript by vue.js - END
//========================================================================================================================================================================================================
