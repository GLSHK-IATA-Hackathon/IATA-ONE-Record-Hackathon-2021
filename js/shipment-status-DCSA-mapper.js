function DCSAmapper(intObj, quantityVal, grossWeightVal){
	var containedPieces = []
	
	intObj.forEach((dcsaEvent, index) => {
		objDCSAs.push(dcsaEvent);
		
		var containedPieceObj = {}
		
		var containedItem = []
		containedItem[0] = {}
		
		var quantity = {}
		quantity['value'] = quantityVal
		quantity['unit'] = 'T'
		
		containedItem[0]['quantity'] = quantity
		
		var grossWeight = {}
		grossWeight['value'] = grossWeightVal
		containedPieceObj['grossWeight'] = grossWeight
		
		
		var event = []
		event[0] = {}
		event[0]['eventCode'] = dcsaEvent.transportEventTypeCode
		if (dcsaEvent.eventClassifierCode != 'ACT'){
			event[0]['eventTypeIndicator'] = 'P'
		}
		
		
		var transportSegment = []
		transportSegment[0] = {}
		
		if (dcsaEvent.transportEventTypeCode != 'ARRI'){
			var departureLocation = {}
			departureLocation['code'] = dcsaEvent.transportCall.facilityTypeCode
			transportSegment[0]['departureLocation'] = departureLocation
		}else{
			var arrivalLocation = {}
			arrivalLocation['code'] = dcsaEvent.transportCall.facilityTypeCode
			transportSegment[0]['arrivalLocation'] = arrivalLocation
		}
		
		transportSegment[0]['arrivalDate'] = dcsaEvent.eventDateTime
		transportSegment[0]['transportIdentifier'] = dcsaEvent.transportCall.modeOfTransport
		
		containedPieceObj['containedItem'] = containedItem
		containedPieceObj['event'] = event
		containedPieceObj['transportSegment'] = transportSegment
		containedPieces.push(containedPieceObj)
	})
	
	return containedPieces;
}