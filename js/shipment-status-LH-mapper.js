function LHmapper(LHTrackingShipment){
	var oneRecordObj = {}
	
	var waybill = {}
	waybill['waybillNumber'] = LHTrackingShipment.shipmentTrackingStatus.shipment.shipmentId.aWBNumber
	waybill['waybillPrefix'] = LHTrackingShipment.shipmentTrackingStatus.shipment.shipmentId.carrierNumericCode
	
	var booking = {}
	var shipmentDetails = {}
	var containedPiece = []
	
	var arrivalLocation = {}
	arrivalLocation['code'] = LHTrackingShipment.shipmentTrackingStatus.booking.destination
	
	var departureLocation = {}
	departureLocation['code'] = LHTrackingShipment.shipmentTrackingStatus.booking.origin
	
	var transportMovement = {}
	transportMovement['arrivalLocation'] = arrivalLocation
	transportMovement['departureLocation'] = departureLocation
	
	var totalGrossWeight = {}
	totalGrossWeight['unit'] = 'K'
	totalGrossWeight['value'] = LHTrackingShipment.shipmentTrackingStatus.booking.totals.weight
	
	
	
	var eventBase = {}
	eventBase.dateTime = LHTrackingShipment.shipmentTrackingStatus.booking.bookingTime
	eventBase.eventName = 'CREATE'
	

	//BKD
	containedPiece.push(getBKD(LHTrackingShipment))
	
	
	
    LHTrackingShipment.shipmentTrackingStatus.milestonePlan.milestones.milestone.forEach((mileston, index) => {
		
		var isComplete = 0;
		
		if (mileston.actualTime != null && mileston.actualTime != ''){
			isComplete = 1
		}else{
			isComplete = 0;
		}
			
		
		var containedPieceObj = {}
		var containedItem = []
		containedItem[0] = {}
		
		var quantity = {}
		if (isComplete != 0){
			quantity['value'] = String(mileston.actualTotals[0].noOfPieces)
			quantity['unit'] = 'T'
		} else{
			quantity['value'] = String(mileston.plannedTotals.noOfPieces)
			quantity['unit'] = 'T'
		}
		
		containedItem[0]['quantity'] = quantity
		
		var event = []
		event[0] = {}
		event[0]['eventCode'] = mileston.type
		if (isComplete != 0){
			//event[0]['eventTypeIndicator'] = 'A'
		} else{
			event[0]['eventTypeIndicator'] = 'P'
		}
		
		
		var grossWeight = {}
		if (isComplete != 0){
			grossWeight['value'] = mileston.actualTotals[0].weight
		} else{
			grossWeight['value'] = mileston.plannedTotals.weight
		}

		
		var transportSegment = []
		transportSegment[0] = {}
		
		var arrivalLocation = {}
		arrivalLocation['code'] = mileston.flight.flightSegmentDestination
		
		var departureLocation = {}
		departureLocation['code'] = mileston.flight.flightSegmentOrigin
		
		if (mileston.type != 'ARR' &&  mileston.type != 'DLV' && mileston.type != 'RCF' && mileston.type != 'NFD'){
			transportSegment[0]['departureLocation'] = departureLocation
		}else{
			transportSegment[0]['arrivalLocation'] = arrivalLocation
		}
		
		if (isComplete != 0){
			transportSegment[0]['arrivalDate'] = mileston.actualTime
		} else{
			transportSegment[0]['arrivalDate'] = mileston.plannedTime
		}
		
		
		transportSegment[0]['transportIdentifier'] = mileston.flight.flightCarrierCode + mileston.flight.flightNumber
		
		var eventObjArr = []
		if(mileston.events.event != null && 1<0){ //skip this part
			mileston.events.event.forEach((eventItem, index) => {
				var eventObj = {}
				if (eventItem.type != 'ARR'){
					eventObj['eventName'] = 'DEP'
				}else{
					eventObj['eventName'] = 'ARR'
				}
				eventObj['dateTime'] = eventItem.actualTime
				eventObj['eventTypeIndicator'] = 'P'
				eventObjArr.push(eventObj)
			})
			transportSegment[0]['event'] = eventObjArr
		}else{
			
			if (mileston.type == 'DEP'){
				var eventObj = {}
				if (isComplete != 0){
					eventObj['dateTime'] = mileston.actualTime
				}else{
					eventObj['dateTime'] = mileston.plannedTime
				}
				
				eventObjArr.push(eventObj)
				transportSegment[0]['event'] = eventObjArr
			}
		}
		
		containedPieceObj['containedItem'] = containedItem
		containedPieceObj['event'] = event
		containedPieceObj['grossWeight'] = grossWeight
		containedPieceObj['transportSegment'] = transportSegment
		
		containedPiece.push(containedPieceObj)
    });
	shipmentDetails['containedPiece'] = containedPiece
	shipmentDetails['totalGrossWeight'] = totalGrossWeight
	shipmentDetails['totalPieceCount'] = LHTrackingShipment.shipmentTrackingStatus.booking.totals.noOfPieces
	shipmentDetails['event'] = eventBase
	booking['transportMovement'] = transportMovement
	booking['shipmentDetails'] = shipmentDetails
	waybill['booking'] = booking
	oneRecordObj['waybill'] = waybill
	
    return oneRecordObj;
}


function getBKD(LHTrackingShipment){
	
	var totalGrossWeight = {}
	totalGrossWeight['unit'] = 'K'
	totalGrossWeight['value'] = LHTrackingShipment.shipmentTrackingStatus.booking.totals.weight
	
	
	var containedPieceObj = {}
	var containedItem = []
	containedItem[0] = {}
	
	var quantity = {}
	quantity['value'] = String(LHTrackingShipment.shipmentTrackingStatus.booking.totals.noOfPieces)
	quantity['unit'] = 'T'
	
	containedItem[0]['quantity'] = quantity
	containedPieceObj['containedItem'] = containedItem
	
	var event = []
	event[0] = {}
	event[0]['eventCode'] = 'BKD'
		
	containedPieceObj['event'] = event
	
	containedPieceObj['grossWeight'] = totalGrossWeight
	
	var serviceRequest = []
	var serviceRequestObj = {}
	serviceRequestObj['code'] = 'OSI'
	serviceRequestObj['description'] = LHTrackingShipment.shipmentTrackingStatus.booking.confirmationStatus
	serviceRequest.push(serviceRequestObj)
	containedPieceObj['serviceRequest'] = serviceRequest
	
	var transportSegment = []
	transportSegment[0] = {}
	
	var arrivalLocation = {}
	arrivalLocation['code'] = LHTrackingShipment.shipmentTrackingStatus.booking.destination
	
	var departureLocation = {}
	departureLocation['code'] = LHTrackingShipment.shipmentTrackingStatus.booking.origin
	
	transportSegment[0]['departureLocation'] = departureLocation
	transportSegment[0]['arrivalLocation'] = arrivalLocation
	
	
	transportSegment[0]['arrivalDate'] = LHTrackingShipment.shipmentTrackingStatus.booking.bookingTime
	
	
	transportSegment[0]['transportIdentifier'] = LHTrackingShipment.shipmentTrackingStatus.milestonePlan.milestones.milestone[0].flight.flightCarrierCode + LHTrackingShipment.shipmentTrackingStatus.milestonePlan.milestones.milestone[0].flight.flightNumber
	
	var eventObj = []
	var eventObjDEP = {}
	eventObjDEP['eventName'] = 'DEP'
	
	var depObj = []
	depObj = getDEP(LHTrackingShipment)
	eventObjDEP['dateTime'] = getSTD(depObj)
	eventObjDEP['eventTypeIndicator'] = 'S'
	eventObj.push(eventObjDEP)
	
	var eventObjARR = {}
	eventObjARR['eventName'] = 'ARR'
	var arrObj = []
	arrObj = getARR(LHTrackingShipment)
	eventObjARR['dateTime'] = getSTA(arrObj)
	eventObjARR['eventTypeIndicator'] = 'S'
	eventObj.push(eventObjARR)
	
	transportSegment[0]['event'] = eventObj
				
	containedPieceObj['transportSegment'] = transportSegment
	return containedPieceObj;
}


function getDEP(LHTrackingShipment){
	return LHTrackingShipment.shipmentTrackingStatus.milestonePlan.milestones.milestone.filter(function (objMilestone) {
		return objMilestone.type == 'DEP' && objMilestone.station == LHTrackingShipment.shipmentTrackingStatus.booking.origin
	});
}

function getSTD(objDEP){
	return objDEP[0].plannedTime
}



function getARR(LHTrackingShipment){
	return LHTrackingShipment.shipmentTrackingStatus.milestonePlan.milestones.milestone.filter(function (objMilestone) {
		return objMilestone.type == 'ARR' && objMilestone.station == LHTrackingShipment.shipmentTrackingStatus.booking.destination
	});
}

function getSTA(objARR){
	return objARR[0].plannedTime
}
