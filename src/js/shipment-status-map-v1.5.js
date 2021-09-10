//========================================================================================================================================================================================================
//Map related JavaScript by OpenStreeMap with LeafLet API - START

var osm_map;
var osm_map_mini;

var latLng;
var polyline;
var osm_colorIndex = 1;

var osm_hidden_markers = [];
var osm_marker_start;
var osm_marker_end;

var polylines = [];

//Marker icons

var marker_icon_locations = []
var marker_icon_planes = []
var marker_icon_circles = []
var marker_icon_circles_small = []

// Modified at 20210521 - swap color order from 1. blue 2. red to 1. red 2. blue
var marker_icon_location1 = L.icon({
	iconUrl: [image_path + 'location-red.png']
	/*
	iconSize: [30, 30],
	iconAnchor: [15, 15]
	*/
});

marker_icon_locations.push(marker_icon_location1)

var marker_icon_location2 = L.icon({
	iconUrl: [image_path + 'location-blue.png']
	/*
	iconSize: [30, 30],
	iconAnchor: [15, 15]
	*/
});

marker_icon_locations.push(marker_icon_location2)

var marker_icon_plane1 = L.icon({
	iconUrl: [image_path + 'icon-plane-red.png'],
	iconSize: [30, 30],
	iconAnchor: [15, 15]
});

marker_icon_planes.push(marker_icon_plane1)

var marker_icon_plane2 = L.icon({
	iconUrl: [image_path + 'icon-plane-blue.png'],
	iconSize: [30, 30],
	iconAnchor: [15, 15]
});

marker_icon_planes.push(marker_icon_plane2)

var marker_icon_circle1 = L.icon({
	iconUrl: [image_path + 'marker-red.png'],
	iconSize: [10, 10],
	iconAnchor: [5, 5]
});

marker_icon_circles.push(marker_icon_circle1)

var marker_icon_circle2 = L.icon({
	iconUrl: [image_path + 'marker-blue.png'],
	iconSize: [10, 10],
	iconAnchor: [5, 5]
});

marker_icon_circles.push(marker_icon_circle2)

var marker_icon_circle1_small = L.icon({
	iconUrl: [image_path + 'marker-red.png'],
	iconSize: [6, 6],
	iconAnchor: [3, 3]
});

marker_icon_circles_small.push(marker_icon_circle1_small)

var marker_icon_circle2_small = L.icon({
	iconUrl: [image_path + 'marker-blue.png'],
	iconSize: [6, 6],                  
	iconAnchor: [3, 3]             
});

marker_icon_circles_small.push(marker_icon_circle2_small)

var opened_marker;

//Map related events -- END

//Map functions -- START
function BacktoShipmentStatus() {
				
	$("#osm_map").hide();
	$("#sensor_reading_Top").hide();
	$("#sensor_reading_Bottom").hide();
	$("#temperature_and_voltage").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Left").show();
	$("#ShipmentStatus_Right").show();
	$("#list_view").show();
	
};

function ShowTemperature() {

	$("#osm_map").hide();
	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#list_view").hide();
	$("#map_view").hide();
		
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	                            
	showDeviceSensorReadings(0, 'Temperature')
	

}

function ShowHumidity() {

	$("#osm_map").hide();
	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	showDeviceSensorReadings(0, 'Humidity')

}

function ShowLight() {

	$("#osm_map").hide();
	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	showDeviceSensorReadings(0, 'Light')

}

function ShowShock() {

	$("#osm_map").hide();
	$("#ShipmentStatus_Left").hide();
	$("#temperature_and_voltage").hide();
	$("#list_view").hide();
	$("#map_view").hide();
	
	$("#ShipmentStatus_Right").show();
	$("#sensor_reading_Top").show();
	$("#sensor_reading_Bottom").show();
	$("#BackToShipmentStatusTick").show();
	
	showDeviceSensorReadings(0, 'Shock')

}



//Map related events -- END

function osm_drawMap(objSensorReadings, MapType) {

	var map

	//Create map and set view to last location of the Sensor Readings
	if (MapType == 'full') {
		osm_map = L.map('osm_map');
		//.setView([SensorReadings[SensorReadings.length-1].lat, SensorReadings[SensorReadings.length-1].lng], 3);
		map = osm_map;
		
	}
	else {
		osm_map_mini = L.map('osm_map_mini');
		//.setView([SensorReadings[SensorReadings.length-1].lat, SensorReadings[SensorReadings.length-1].lng], 3);
		map = osm_map_mini;
	}
	
	//Add tile layer with maptiler
	
	
      L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + MAPTILER_API_KEY,{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
      }).addTo(map);
	
	//Add tile layer with source from OpenStreetMap
	/*
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	}).addTo(map);
	*/
	
	//Map tile Source : Mapbox

	/*
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(osm_map_mini);
	*/

}

function osm_addNGTTDeviceSensorReadingOnMap(objMap, objNGTTDeviceSensorReading, blnAddDeviceSensorReadingMarkers) {

	
	latLng = [];
	resetOSMPolyLineColorIndex()
	
	var blnCrossDateLine = false
	var intLatLngIndex = 0
	
	var blnMultiFlightsShipment = false
	var strCurrentFlightNumber = ""
	
	var objDeviceSensorReadings
	var objFlightReadings
	
	var locations = [];
	var location;
	
	osm_marker_start = null; //Added at 20210222 : reinitialize osm_marker_start variable so both mini-map and normal map got start marker
	osm_marker_end = null; //Added at 20210309 : reinitialize osm_marker_end variable so both mini-map and normal map got end marker
	
	//Test if flight path cross International Date Line
	for (var i = 0; i < objNGTTDeviceSensorReading.flight.length; i++) {
		if (objNGTTDeviceSensorReading.flight[i+1] != null && 
			((objNGTTDeviceSensorReading.flight[i].longitude < 0 && objNGTTDeviceSensorReading.flight[i+1].longitude >= 0) || (objNGTTDeviceSensorReading.flight[i].longitude >= 0 && objNGTTDeviceSensorReading.flight[i+1].longitude < 0)
			) &&
			(360 - Math.abs(objNGTTDeviceSensorReading.flight[i].longitude) - Math.abs(objNGTTDeviceSensorReading.flight[i+1].longitude) < 180)	
		) {
			blnCrossDateLine = true
			break
		}
	}	
	
	//console.log('Cross IDL : ' + blnCrossDateLine)	
	
	//Test if shipment is a multi-flights shipment
	if (objNGTTDeviceSensorReading.flight.length > 0) {
		
		for (var i = 0; i < objNGTTDeviceSensorReading.flight.length; i++) {
			
			if (i != objNGTTDeviceSensorReading.flight.length - 1 && objNGTTDeviceSensorReading.flight[i].flightNum != objNGTTDeviceSensorReading.flight[i+1].flightNum) {
				blnMultiFlightsShipment = true
				break
			}
			
		}
		
	}
	
	// console.log('Multi-flights shipment : ' + blnMultiFlightsShipment);
	
	if (!blnMultiFlightsShipment) {
	
		//Single Flight Shipment
		//Draw flight and sensor reading paths together
		
		latLng = [];
		
		// Modified at 20210527 - START
		// Disable changing color between device to avoid confusion
		// incrementOSMPolyLineColorIndex() 
		// Modified at 20210527 - END
		
		
		
		for (var i=0; i<objNGTTDeviceSensorReading.devices.length; i++) {
			
			locations = []; //re-initialize locations array to clear location data from previous device
			
			if (objNGTTDeviceSensorReading.devices[i].mapPointData.length > 0) {
			
				objDeviceSensorReadings = objNGTTDeviceSensorReading.devices[i].mapPointData
				
				for (var j = 0; j < objDeviceSensorReadings.length; j++) {
					
					//Skip the reading if latitude or longitude is missing
					if (objDeviceSensorReadings[j].latitude == null || objDeviceSensorReadings[j].longitude == null) {
						continue
					}
					
					/*
					latLng[intLatLngIndex] = [];
			
					latLng[intLatLngIndex][0] = objDeviceSensorReadings[j].latitude
					latLng[intLatLngIndex][1] = adjustLongitude(objDeviceSensorReadings[j].longitude, blnCrossDateLine)
						
					intLatLngIndex++
					*/
					
					location = {};
					
					//location.dateTime = objDeviceSensorReadings[j].latLongDateTime
					location.dateTime = new Date(objDeviceSensorReadings[j].latLongDateTime);
					location.latitude = objDeviceSensorReadings[j].latitude
					location.longitude = adjustLongitude(objDeviceSensorReadings[j].longitude, blnCrossDateLine)
					
					locations.push(location)
					
					/*
					if (
						(
							j != objDeviceSensorReadings.length - 1 
							&& (objDeviceSensorReadings[j].source == 'G' && objDeviceSensorReadings[j+1].source == 'F') 
						)
					) {
						
						//next device sensor reading is in-flight, draw flight path
						
						objFlightReadings = objNGTTDeviceSensorReading.flight
						
						if (objFlightReadings.length > 0) {
		
							for (var k = 0; k < objFlightReadings.length; k++) {
								
								latLng[intLatLngIndex] = [];
								
								latLng[intLatLngIndex][0] = objFlightReadings[k].latitude
								latLng[intLatLngIndex][1] = adjustLongitude(objFlightReadings[k].longitude, blnCrossDateLine)
								
								intLatLngIndex++
								
								
							}
							
						}
						
						
					}
					*/
					
					
					
				}
				
				objFlightReadings = objNGTTDeviceSensorReading.flight
						
				if (objFlightReadings.length > 0) {

					for (var k = 0; k < objFlightReadings.length; k++) {
						
						/*
						latLng[intLatLngIndex] = [];
						
						latLng[intLatLngIndex][0] = objFlightReadings[k].latitude
						latLng[intLatLngIndex][1] = adjustLongitude(objFlightReadings[k].longitude, blnCrossDateLine)
						
						intLatLngIndex++
						*/
						
						location = {};
					
						location.dateTime = objFlightReadings[k].dateTime
						location.latitude = objFlightReadings[k].latitude
						location.longitude = adjustLongitude(objFlightReadings[k].longitude, blnCrossDateLine)
						
						locations.push(location)
						
						
					}
					
				}
				
				//sort the combined (device + flight) locations based on their dateTime
				locations.sort(function (a, b) {
					return a.dateTime - b.dateTime
				});	

				latLng = []
				intLatLngIndex = 0
				
				for (z=0; z<locations.length; z++) {
					
					latLng[intLatLngIndex] = [];
						
					latLng[intLatLngIndex][0] = locations[z].latitude
					latLng[intLatLngIndex][1] = locations[z].longitude
					
					intLatLngIndex++
					
				}

				if (latLng.length > 0) {
					//console.log("latLng", latLng);
					// if(i == 0 && !blnAddDeviceSensorReadingMarkers){
					// 	var drawMapPromise = new Promise((resolve, reject) => {
					// 		drawMapAnimation(latLng, objMap);
					// 	});
					// 	drawMapPromise.then(
					// 		result => { polylines.push(result); }
					// 	);
					// }
					// else if(blnAddDeviceSensorReadingMarkers){
					// 	polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
					// 	polylines.push(polyline);
					// }
					
					polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
					polylines.push(polyline);

					//Create marker at first (have readings) device sensor reading START location
					if (osm_marker_start == null) {
						
						osm_marker_start = L.marker([latLng[0][0], latLng[0][1]], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
					
					}
					
					//Create marker and set map view at last (have readings) device sensor reading END location
					
					//Remove previous end markers
					if (osm_marker_end != null) {
						osm_marker_end.remove(objMap);
					}
						
					osm_marker_end = L.marker([latLng[latLng.length-1][0], latLng[latLng.length-1][1]], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ] /*, rotationAngle: objFlightReadings[objFlightReadings.length-1].direction , zIndexOffset : 1000*/}).addTo(objMap)
					objMap.setView([latLng[latLng.length-1][0], latLng[latLng.length-1][1]], 3);
					
					// console.log("polylines", polylines);
					// console.log("osm_marker_start", osm_marker_start);
					// console.log("osm_marker_end", osm_marker_end);
					
					latLng = []
					intLatLngIndex = 0
					
				}
			}
		
		}
	}
	else {
	
		//Draw path for sensor readings
	
		for (var i=0; i<objNGTTDeviceSensorReading.devices.length; i++) {
			
			
			if (objNGTTDeviceSensorReading.devices[i].mapPointData.length > 0) {
				
				var objDeviceSensorReadings = objNGTTDeviceSensorReading.devices[i].mapPointData
			
				/*
				for (var i = 0; i < objDeviceSensorReadings.length; i++) {
			
					if (i == objDeviceSensorReadings.length - 1 || objDeviceSensorReadings[i].latitude == null || objDeviceSensorReadings[i].longitude == null) {
						
						if (latLng.length > 0) {
							
							polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
							polylines.push(polyline)
							
							latLng = [];
							intLatLngIndex = 0
						}
						
					}
					else {
						
						latLng[intLatLngIndex] = [];
						latLng[intLatLngIndex][0] = objDeviceSensorReadings[i].latitude
						latLng[intLatLngIndex][1] = objDeviceSensorReadings[i].longitude
						intLatLngIndex++
					
					}
				
					
					
				}
				*/
				
				
				for (var j = 0; j < objDeviceSensorReadings.length; j++) {
				
					if (objDeviceSensorReadings[j].latitude != null && objDeviceSensorReadings[j].longitude != null) {
						
							latLng[intLatLngIndex] = [];
				
							latLng[intLatLngIndex][0] = objDeviceSensorReadings[j].latitude
							latLng[intLatLngIndex][1] = adjustLongitude(objDeviceSensorReadings[j].longitude, blnCrossDateLine)
							
							intLatLngIndex++
						
					}
						
						
					if (
						(
							j == objDeviceSensorReadings.length - 1 
							/*
								Modified at 20210319 : Change the checking for location change in order to add a new polyline by time difference of the readings (difference larger than 30 mins)
								as the original source field for determining the change is not longer available in mapPointData array
							*/
							|| (Math.floor((objDeviceSensorReadings[j+1].latLongDateTime - objDeviceSensorReadings[j].latLongDateTime) / 1000 / 60) > intTimeDiffThresholdinMinutes4SameAirport)
							/*
							|| (objDeviceSensorReadings[j].source == 'G' && objDeviceSensorReadings[j+1].source == 'F') 
							|| (objDeviceSensorReadings[j].source == 'F' && objDeviceSensorReadings[j+1].source == 'G') 
							*/
						)
						&&
						latLng.length > 0 
					) {
							
							polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
							polylines.push(polyline)
							
							//Added at 20210521 - START
							//draw start and end markers at last device first and last reading position instead of start and end position of flight path
							
							//Create marker at first (have readings) device sensor reading START location
							
							//Modified at 20210615 - START
							//Disable creating start marker when drawing device reading path, start maker creation will be put at the end of the function which will compare which reading from flight readings and sensor readings comes first
							
							//if (osm_marker_start == null) {
								
								//osm_marker_start = L.marker([latLng[0][0], latLng[0][1]], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
							
							//}
							
							//Modified at 20210615 - END
							
							//Create marker and set map view at last (have readings) device sensor reading END location
							
							//Remove previous end markers
							
							//Modified at 20210615 - START
							//Disable creating end marker when drawing device reading path, end maker creation will be put at the end of the function which will compare which reading from flight readings and sensor readings comes last
							
							//if (osm_marker_end != null) {
								//osm_marker_end.remove(objMap);
							//}
								
							//osm_marker_end = L.marker([latLng[latLng.length-1][0], latLng[latLng.length-1][1]], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ] /*, rotationAngle: objFlightReadings[objFlightReadings.length-1].direction , zIndexOffset : 1000*/}).addTo(objMap)
					
							//Modified at 20210615 - END
					        
							//Added at 20210521 - END
							latLng = []
							intLatLngIndex = 0
							
					}
						
						
					
					
				}
			
				
				
				//Create marker at sensor reading START location
				//osm_marker_start = L.marker([objDeviceSensorReadings[0].latitude, objDeviceSensorReadings[0].longitude], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)

			
				//Create marker at sensor reading END location
				//osm_marker_end = L.marker([objDeviceSensorReadings[objDeviceSensorReadings.length-1].latitude, objDeviceSensorReadings[objDeviceSensorReadings.length-1].longitude], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ], rotationAngle: objDeviceSensorReadings[objDeviceSensorReadings.length-1].direction, zIndexOffset : 1000}).addTo(objMap)

				
				if (latLng.length > 0) {
					objMap.setView([latLng[latLng.length-1][0], latLng[latLng.length-1][1]], 3);
				}
				else {
					objMap.setView([HKG_Location.latitude, HKG_Location.longitude], 3);
				}
				
			}
			
			
		}
		
		
		//Draw path for flight
		
		latLng = [];
		
		// Modified at 20210527 - START
		// Disable changing color between device to avoid confusion
		// incrementOSMPolyLineColorIndex() //change color to red for flight path
		// Modified at 20210527 - END
		
		var objFlightReadings = objNGTTDeviceSensorReading.flight
		
		var strCurrentFlightNumber = ''
		var dblBearing = 0
		
		if (objFlightReadings.length > 0) {
			
			for (var i = 0; i < objFlightReadings.length; i++) {
				
				strCurrentFlightNumber = objFlightReadings[i].flightNum
				
				latLng[intLatLngIndex] = [];
				
				latLng[intLatLngIndex][0] = objFlightReadings[i].latitude
				latLng[intLatLngIndex][1] = adjustLongitude(objFlightReadings[i].longitude, blnCrossDateLine)
				
				
				if (i == objFlightReadings.length - 1 ||  objFlightReadings[i+1].flightNum != strCurrentFlightNumber) {
					
					polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
					polylines.push(polyline)
					
					latLng = []
					intLatLngIndex = 0
					
					
				}
				else {
					
					intLatLngIndex++
					
				}
				
			}
			
			
			//polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
			//polylines.push(polyline)
			
			//Added at 20210521 - START
			//draw start and end markers at last device first and last reading position instead of start and end position of flight path
			//so following code will be disabled
			
			// //Create marker at sensor reading START location
			// osm_marker_start = L.marker([objFlightReadings[0].latitude, adjustLongitude(objFlightReadings[0].longitude, blnCrossDateLine)], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
			// //osm_marker_start = L.marker([objFlightReadings[0].latitude, objDeviceSensorReadings[0].longitude], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
			// //osm_marker_start = L.marker([latLng[0][0], latLng[0][1]], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)
			
			
			// //Create marker at sensor reading END location
			// osm_marker_end = L.marker([objFlightReadings[objFlightReadings.length-1].latitude, adjustLongitude(objFlightReadings[objFlightReadings.length-1].longitude, blnCrossDateLine)], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ]/*, rotationAngle: objFlightReadings[objFlightReadings.length-1].direction, zIndexOffset : 1000*/}).addTo(objMap)

			//Added at 20210521 - END
			
			objMap.setView([objFlightReadings[objFlightReadings.length-1].latitude, objFlightReadings[objFlightReadings.length-1].longitude], 3);
			
		}
		
		// Modified at 20210527 - START
		// Disable changing color between device to avoid confusion
		// incrementOSMPolyLineColorIndex()  //Added at 20210319 : restore color to blue for device sensor path
		// Modified at 20210527 - END
		
		// Modified at 20210615 - START
		// Draw start marker by comparing which reading from flight readings and sensor readings comes first
		// Draw end marker by comparing which reading from flight readings and sensor readings comes last
	
		if (
			(objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData.length > 0)
			||
			objFlightReadings.length > 0
		) {
			var start_marker_locations = []
			var start_marker_location
			
			var end_marker_locations = []
			var end_marker_location
			
			if (objNGTTDeviceSensorReading.devices.length > 0 && objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData.length > 0) {
				start_marker_location = {
											dateTime:objNGTTDeviceSensorReading.devices[0].mapPointData[0].latLongDateTime, 
											latitude:objNGTTDeviceSensorReading.devices[0].mapPointData[0].latitude, 
											longitude:objNGTTDeviceSensorReading.devices[0].mapPointData[0].longitude
										};
										
				start_marker_locations.push(start_marker_location)
				
				end_marker_location = {
											dateTime:objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData[objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData.length-1].latLongDateTime, 
											latitude:objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData[objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData.length-1].latitude, 
											longitude:objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData[objNGTTDeviceSensorReading.devices[objNGTTDeviceSensorReading.devices.length-1].mapPointData.length-1].longitude
										};
										
				end_marker_locations.push(end_marker_location)
				
				
				
			}
			
			if (objFlightReadings.length > 0) {
				start_marker_location = {
											dateTime:objFlightReadings[0].dateTime, 
											latitude:objFlightReadings[0].latitude, 
											longitude:objFlightReadings[0].longitude
										};
										
				start_marker_locations.push(start_marker_location)
				
				end_marker_location = {
											dateTime:objFlightReadings[objFlightReadings.length-1].dateTime, 
											latitude:objFlightReadings[objFlightReadings.length-1].latitude, 
											longitude:objFlightReadings[objFlightReadings.length-1].longitude
										};
										
				end_marker_locations.push(end_marker_location)
			}
				
			//sort start_marker_locations in ascending order
			start_marker_locations.sort(function (a, b) {
				return (a.dateTime > b.dateTime ? 1 : -1)
			});	
			
			//Take first element of start_marker_locations to draw start marker
			osm_marker_start = L.marker([start_marker_locations[0].latitude, adjustLongitude(start_marker_locations[0].longitude, blnCrossDateLine)], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex]}).addTo(objMap)
			
			
			//sort end_marker_locations in ascending order
			end_marker_locations.sort(function (a, b) {
				return (a.dateTime > b.dateTime ? 1 : -1)
			});	
			
			//Take last element of end_marker_locations to draw end marker
			osm_marker_end = L.marker([end_marker_locations[end_marker_locations.length-1].latitude, adjustLongitude(end_marker_locations[end_marker_locations.length-1].longitude, blnCrossDateLine)], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex]}).addTo(objMap)
				
		}
		// Modified at 20210615 - END
	
	}
	
	if (blnAddDeviceSensorReadingMarkers) {
		
		var blnTemperatureAvailable = false
		var blnHumidityAvailable = false
		var blnLightAvailable = false
		var blnShockAvailable = false
		
		var AvailableMeasurementTypes = []
		
		if (blnMultiFlightsShipment) {
		
			// Modified at 20210527 - START
			// Disable changing color between device to avoid confusion
			// //incrementOSMPolyLineColorIndex() //Modified at 20210319 : keep color for device sensor markers to blue
			// Modified at 20210527 - END
			
		}
		
		if (objNGTTDeviceSensorReading.flight.length > 0) {
			objFlightReadings = objNGTTDeviceSensorReading.flight

			if (blnMultiFlightsShipment) {
			
				// Modified at 20210527 - START
				// Disable changing color between device to avoid confusion
				// incrementOSMPolyLineColorIndex() 
				// Modified at 20210527 - END
				
			}
	
			for (var i = 0; i < objFlightReadings.length; i++) {
			
				var contentString =  '<div style="width: 320px;height:200px;">' +
										'<div>' +
											'<div class="shipment-status_map_awb_no" style="border-bottom:1px solid #c0c0c0;margin-bottom:2px">' + objOneRecord.waybill.waybillPrefix + '-' + objOneRecord.waybill.waybillNumber + 
												'<div class="shipment-status_map_flight"><img src="' + image_path + 'flight.png">' + objFlightReadings[i].flightNum + '</div>' +
												'<div class="shipment-status_map_location"><img src="' + image_path + 'location.png"> ' + LocalizedStrings['Latitude'][strCurrentLanguage] + ' : ' + objFlightReadings[i].latitude + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + LocalizedStrings['Longitude'][strCurrentLanguage] + ' : ' + objFlightReadings[i].longitude + '</div><br/>' +
												'<div>' +
													'<table cellpadding="4">' +
														'<tr class="shipment-status_map_sensor_reading_title">' +
														'<tr class="shipment-status_map_sensor_image_time"><td colspan="4">' + LocalizedStrings['EventTime'][strCurrentLanguage] + ' : ' + moment(String(objFlightReadings[i].dateTime)).format("YYYY-MM-DD HH:mm") + '</td></tr>' +
														'<tr class="shipment-status_map_sensor_link"><td colspan="4"><a id="ShowTemperature_Flight" onclick="ShowTemperature()" style="text-decoration : underline;cursor : pointer; pointer-events: auto;">' + LocalizedStrings['SeeSensorData'][strCurrentLanguage] + '</a></td></tr>' 
													'</table>' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>'
					

					var marker = L.marker([objFlightReadings[i].latitude, adjustLongitude(objFlightReadings[i].longitude, blnCrossDateLine)], {icon: marker_icon_circles[intCurrentOSMPolyLineColorIndex]})
						.addTo(objMap)
						.bindPopup(contentString)
						.on('mouseover', function(ev) { 
								if (opened_marker != null) {
									opened_marker.closePopup();
								}
								ev.target.openPopup(); 
								opened_marker = marker;
							}
						)
					
						//.on('mouseout', function(ev) { ev.target.closePopup(); });
					
					
					osm_hidden_markers.push(marker)
			
			
				
			}
		
			//Added at 20210319 
			if (blnMultiFlightsShipment) {
			
				// Modified at 20210527 - START
				// Disable changing color between device to avoid confusion
				// incrementOSMPolyLineColorIndex() //restore color to blue for device sensor markers
				// Modified at 20210527 - END
				
			}
			
		}
		
		for (var i=0; i<objNGTTDeviceSensorReading.devices.length; i++) {
		
			AvailableMeasurementTypes = []
			
			if (objNGTTDeviceSensorReading.devices[i].mapPointData.length > 0) {
				
				objDeviceSensorReadings = objNGTTDeviceSensorReading.devices[i].mapPointData
				
				if (getLastAvailableSensorReading(objDeviceSensorReadings, 'Temperature') != null) {
					blnTemperatureAvailable = true
					AvailableMeasurementTypes.push('Temperature')
				}
				
				if (getLastAvailableSensorReading(objDeviceSensorReadings, 'Humidity') != null) {
					blnHumidityAvailable = true
					AvailableMeasurementTypes.push('Humidity')
				}
				
				if (getLastAvailableSensorReading(objDeviceSensorReadings, 'Light') != null) {
					blnLightAvailable = true
					AvailableMeasurementTypes.push('Light')
				}
				
				if (getLastAvailableSensorReading(objDeviceSensorReadings, 'Shock') != null) {
					blnShockAvailable = true
					AvailableMeasurementTypes.push('Shock')
				}
				
				//Add sensor markers to flight path for each sensor readings
				for (var j = 0; j < objDeviceSensorReadings.length; j++) {

					//Modified at 20210527 - START 
					//Add checking to only show the marker of last reading for a given lat/lng in order to improve map navigation performance
					//if (objDeviceSensorReadings[j].latitude != null && objDeviceSensorReadings[j].longitude != null) {
					if (
						(objDeviceSensorReadings[j].latitude != null && objDeviceSensorReadings[j].longitude != null) 
						&&
						(
							j == objDeviceSensorReadings.length - 1 
							||
							(
								objDeviceSensorReadings[j].latitude != objDeviceSensorReadings[j+1].latitude 
								||
								objDeviceSensorReadings[j].longitude != objDeviceSensorReadings[j+1].longitude
							)
						)
					)
					{
					//Modified at 20210527 - END
						var contentString = '<div style="width:320px;height1:250px;">' +
											'<div>' +
												'<div class="shipment-status_map_awb_no" style="border-bottom:1px solid #c0c0c0;margin-bottom:2px">' + objOneRecord.waybill.waybillPrefix + '-' + objOneRecord.waybill.waybillNumber + '<br/>' + LocalizedStrings['Device'][strCurrentLanguage] + ': ' + objNGTTDeviceSensorReading.devices[i].id + '</div>' +
												//'<div class="shipment-status_map_flight"><img src="' + image_path + 'flight.png"> CX 251 HKG to LHR</div>' +
												'<div class="shipment-status_map_location"><img src="' + image_path + 'location.png">' + LocalizedStrings['Latitude'][strCurrentLanguage] + ': ' + objDeviceSensorReadings[j].latitude + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + LocalizedStrings['Longitude'][strCurrentLanguage] + ': ' + objDeviceSensorReadings[j].longitude + '</div>' +
												'<div class="shipment-status_event_time">' + LocalizedStrings['EventTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objDeviceSensorReadings[j].latLongDateTime)).format("YYYY-MM-DD HH:mm") + '</div>'
													 
												contentString += '<div style="padding-top:5px">'														
						
												contentString += '<table>' 		
						
												for (var k=0; k <= 3; k++) {
												
													if (k == 0 || k == 2) {
														contentString += '<tr>'
													}
													
													contentString += '<td>' 
													
													if (k < AvailableMeasurementTypes.length) {
													
														contentString += '<table cellpadding="1">' 
														
														contentString += '<tr class="shipment-status_map_sensor_reading_title">' 
														
														contentString += '<td width="100">' + (AvailableMeasurementTypes[k] == 'Temperature' ? (objNGTTDeviceSensorReading.inCooltainer ? LocalizedStrings['Product'][strCurrentLanguage] : LocalizedStrings['Transportation'][strCurrentLanguage]) : '') + LocalizedStrings[AvailableMeasurementTypes[k]][strCurrentLanguage] + '</td>' 
														
														contentString += '</tr>' 
														
														contentString += '<tr class="shipment-status_map_sensor_reading">' 
														
														contentString += '<td><a id="Show' + AvailableMeasurementTypes[k] + '" onclick="Show' + AvailableMeasurementTypes[k] + '()" style="cursor:pointer; pointer-events: auto;"><img src="' + image_path + AvailableMeasurementTypes[k].toLowerCase() + '-small.png">&nbsp;&nbsp;' + objDeviceSensorReadings[j][AvailableMeasurementTypes[k].toLowerCase()] + MeasurementType_Unit[AvailableMeasurementTypes[k]] + '</a></td>'
														
														contentString += '</tr>' 
														
														contentString += '</tr>' 
														
														contentString += '<tr class="shipment-status_event_time">' 
														
														contentString += '<td>' + LocalizedStrings['EventTime'][strCurrentLanguage] + ' (UTC): ' + moment(String(objDeviceSensorReadings[j][AvailableMeasurementTypes[k].toLowerCase() + 'DateTime'])).format("YYYY-MM-DD HH:mm") + '</td>'
														
														contentString += '</tr>' 
														
														contentString += '</table>' 
														
													}
													else {
														
														contentString += '&nbsp;'
													}
													
													contentString += '</td>' 
													
													if (k == 1 || k == 3) {
														contentString += '</tr>'
													}
												
												}
												
												contentString += '</table>' 						
												
												contentString += '</div>'														
						
												contentString += '<div><a id="ShowTemperature_DeviceSensorReading" onclick="ShowTemperature()" style="text-decoration : underline;cursor : pointer; pointer-events: auto;">' + LocalizedStrings['SeeSensorData'][strCurrentLanguage] + '</a></div>' 
												
											contentString += '</div>' +
											'</div>'
						var marker = L.marker([objDeviceSensorReadings[j].latitude, adjustLongitude(objDeviceSensorReadings[j].longitude, blnCrossDateLine)], {icon: marker_icon_circles[intCurrentOSMPolyLineColorIndex]})
							.addTo(objMap)
							.bindPopup(contentString)
							.on('mouseover', function(ev) { 
									if (opened_marker != null) {
										opened_marker.closePopup();
									}
									ev.target.openPopup(); 
									opened_marker = marker;
								}
							)
						
							//.on('mouseout', function(ev) { ev.target.closePopup(); });
						
						if (i==0 && j==objDeviceSensorReadings.length-1) {
							marker.openPopup();
						}
						
						osm_hidden_markers.push(marker)
				
					}
			
				}
			
				
				
			}
			
			
		}
	}
	
	//Fit map with flight path
	//objMap.fitBounds(polyline.getBounds());
	if (objNGTTDeviceSensorReading.flight.length > 0) {
		
		objFlightReadings = objNGTTDeviceSensorReading.flight
		
		objMap.fitBounds([
		[objFlightReadings[0].latitude, adjustLongitude(objFlightReadings[0].longitude, blnCrossDateLine)],
		[objFlightReadings[objFlightReadings.length-1].latitude, adjustLongitude(objFlightReadings[objFlightReadings.length-1].longitude, blnCrossDateLine)],
		]);
	}
}

async function drawMapAnimation(latLng, objMap){
	var i = 1;
	var drawMap = setInterval(function(){
		if(i <= latLng.length){
			try{
				var currentLatLng = latLng.slice(0,i);
				L.polyline(currentLatLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);

				//Remove previous end markers
				if (osm_marker_end != null) {
					osm_marker_end.remove(objMap);
				}
			
				osm_marker_end = L.marker([currentLatLng[currentLatLng.length-1][0], currentLatLng[currentLatLng.length-1][1]], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ] /*, rotationAngle: objFlightReadings[objFlightReadings.length-1].direction , zIndexOffset : 1000*/}).addTo(objMap);
			}
			catch(ex){
				console.log(ex);
			}
			i++;
		}
		else{
			polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
			polylines.push(polyline);
			clearInterval(drawMap);
		}
	}, 10);
}

// Modified at 20210319 : Comment out old method to avoid confusion
/*
function osm_addDeviceInfoOnMap(DeviceName, objMap, objFlightReadings, objDeviceSensorReadings, blnAddDeviceSensorReadingMarkers) {

	
	latLng = [];
	resetOSMPolyLineColorIndex()
	
	//Create Location array for Sensor Readings

	//Draw path for sensor readings
	
	var latLngIndex = 0;
	
	if (objDeviceSensorReadings.length > 0) {
		
		for (var i = 0; i < objDeviceSensorReadings.length; i++) {
		
			if (objDeviceSensorReadings[i].latitude == null || objDeviceSensorReadings[i].longitude == null) {
				
				if (latLng.length > 0) {
					
					polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
					latLng = [];
					latLngIndex = 0	
				}
				
			}
			else {
			
				latLng[latLngIndex] = [];
				latLng[latLngIndex][0] = objDeviceSensorReadings[i].latitude
				latLng[latLngIndex][1] = objDeviceSensorReadings[i].longitude
				latLngIndex++
			
			}
		
			
			
		}
		
		
		
		//Create marker at sensor reading START location
		osm_marker_start = L.marker([objDeviceSensorReadings[0].latitude, objDeviceSensorReadings[0].longitude], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)

	
		//Create marker at sensor reading END location
		osm_marker_end = L.marker([objDeviceSensorReadings[objDeviceSensorReadings.length-1].latitude, objDeviceSensorReadings[objDeviceSensorReadings.length-1].longitude], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ], rotationAngle: objDeviceSensorReadings[objDeviceSensorReadings.length-1].direction, zIndexOffset : 1000}).addTo(objMap)

		
		objMap.setView([objDeviceSensorReadings[objDeviceSensorReadings.length-1].latitude, objDeviceSensorReadings[objDeviceSensorReadings.length-1].longitude], 3);
		
	}
	
	
	
	//Draw path for flight
	
	latLng = [];
	incrementOSMPolyLineColorIndex() 
	
	if (objFlightReadings.length > 0) {
	
		for (var i = 0; i < objFlightReadings.length; i++) {
		
			latLng[i] = [];
			
			latLng[i][0] = objFlightReadings[i].latitude
			latLng[i][1] = objFlightReadings[i].longitude
		
		
			
		}
	
		polyline = L.polyline(latLng, {color:color[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap);
		
		//Create marker at sensor reading START location
		osm_marker_start = L.marker([objFlightReadings[0].latitude, objFlightReadings[0].longitude], {icon: marker_icon_locations[intCurrentOSMPolyLineColorIndex ]}).addTo(objMap)

	
		//Create marker at sensor reading END location
		osm_marker_end = L.marker([objFlightReadings[objFlightReadings.length-1].latitude, objFlightReadings[objFlightReadings.length-1].longitude], {icon: marker_icon_planes[intCurrentOSMPolyLineColorIndex ], rotationAngle: objFlightReadings[objFlightReadings.length-1].direction, zIndexOffset : 1000}).addTo(objMap)

		
		objMap.setView([objFlightReadings[objFlightReadings.length-1].latitude, objFlightReadings[objFlightReadings.length-1].longitude], 3);
		
	}
	
	
	

	//Fit map with flight path
	objMap.fitBounds(polyline.getBounds());
	
	
	
	if (blnAddDeviceSensorReadingMarkers) {
	
		//Add sensor markers to flight path for each sensor readings
		for (var i = 0; i < objDeviceSensorReadings.length; i++) {


			var contentString =  '<div style="width: 320px;height:200px;">' +
								'<div>' +
									'<div class="shipment-status_map_awb_no" style="border-bottom:1px solid #c0c0c0;margin-bottom:2px">' + vue_ShipmentStatus.FreightStatus.AWBPrefix + '-' + vue_ShipmentStatus.FreightStatus.AWBSuffix + '<br/>Device : ' + DeviceName + '</div>' +
										//'<div class="shipment-status_map_flight"><img src="' + image_path + 'flight.png"> CX 251 HKG to LHR</div>' +
										'<div class="shipment-status_map_location"><img src="' + image_path + 'location_cx.png"> Latitude : ' + objDeviceSensorReadings[i].latitude + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Longitude : ' + objDeviceSensorReadings[i].longitude + '</div><br/>' +
										'<div>' +
											'<table cellpadding="4">' +
												'<tr class="shipment-status_map_sensor_reading_title">' +
												'<td align="center">Temperature</td>' +
												(objNGTTDeviceSensorReading.devices[0].reading[0].humidity == null ? '' : '<td align="center">Relative humidity</td>') +
												(objNGTTDeviceSensorReading.devices[0].reading[0].light == null ? '' : '<td align="center">Light</td>') +
												(objNGTTDeviceSensorReading.devices[0].reading[0].shock == null ? '' : '<td align="center">Shock</td>') +
												'</tr>' +
												'<tr class="shipment-status_map_sensor_reading">' +
												'<td align="center"><a id="ShowTemperature" onclick="ShowTemperature()" style="cursor:pointer; pointer-events: auto;"><img src="' + image_path + 'temperature-small.png">&nbsp;&nbsp;' + objDeviceSensorReadings[i].temperature + '&deg;C</a></td>' + 
												(objNGTTDeviceSensorReading.devices[0].reading[0].humidity == null ? '' : '<td align="center"><a id="ShowHumidity" onclick="ShowHumidity()" style="cursor:pointer; pointer-events: auto;"><img src="' + image_path + 'humidity-small.png">&nbsp;&nbsp;' + objDeviceSensorReadings[i].humidity + '</a></td>') + 
												(objNGTTDeviceSensorReading.devices[0].reading[0].light == null ? '' : '<td align="center"><a id="ShowLight" onclick="ShowLight()" style="cursor:pointer; pointer-events: auto;"><img src="' + image_path + 'light-small.png">&nbsp;&nbsp;' + objDeviceSensorReadings[i].light + '</a></td>') + 
												(objNGTTDeviceSensorReading.devices[0].reading[0].shock == null ? '' : '<td align="center"><a id="ShowHumidity" onclick="ShowShock()" style="cursor:pointer; pointer-events: auto;"><img src="' + image_path + 'shock-small.png">&nbsp;&nbsp;' + objDeviceSensorReadings[i].shock + '</a></td>') + 
												'</tr>' +
												'<tr class="shipment-status_map_sensor_image_time"><td colspan="4">Image Time : ' + moment(String(objDeviceSensorReadings[i].dateTime)).format("yyyy-MM-DD HH:mm") + '</td></tr>' +
												'<tr class="shipment-status_map_sensor_link"><td colspan="4"><a id="BacktoShipmentStatus" onclick="BacktoShipmentStatus()" style="text-decoration : underline;cursor : pointer; pointer-events: auto;">See all shipment history</a></td></tr>' 
											'</table>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>'
			

			var marker = L.marker([objDeviceSensorReadings[i].latitude, objDeviceSensorReadings[i].longitude], {icon: marker_icon_circle1})
				.addTo(objMap)
				.bindPopup(contentString)
				.on('mouseover', function(ev) { 
						if (opened_marker != null) {
							opened_marker.closePopup();
						}
						ev.target.openPopup(); 
						opened_marker = marker;
					}
				)
			
				//.on('mouseout', function(ev) { ev.target.closePopup(); });
			
			if (i==objDeviceSensorReadings.length-1) {
				marker.openPopup();
			}
			
			osm_hidden_markers.push(marker)
		
			
	
		}
		
	}
	
}
*/

function osm_clearDeviceInfoOnMap(objMap, objDeviceSensorReadings) {
	
		osm_marker_start.remove(objMap);
		osm_marker_end.remove(objMap);
		
		if (osm_hidden_markers != null) {
			
			var intMarkerCount = osm_hidden_markers.length
			
			for (var i=0; i < intMarkerCount; i++) {
		
				osm_hidden_markers[i].remove(objMap)
		
			}
			
			osm_hidden_markers = [];
			
		}
		
		
		if (polylines != null) {
			
			var intPolylinesCount = polylines.length
			
			for (var i=0; i < intPolylinesCount; i++) {
		
				polylines[i].remove(objMap)
		
			}
			
			polylines = [];
			
		}
		
}

function adjustLongitude(dblLongitude, blnCrossDateLine) {
	return (blnCrossDateLine ? L.Util.wrapNum(dblLongitude, [0,360], true) : dblLongitude)
}

//Map functions -- END

////Map related JavaScript by OpenStreeMap with LeafLet API - START
//========================================================================================================================================================================================================

