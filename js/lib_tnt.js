var tnt_obj = function () {
	this.IsFav = false;
	this.Origin = "";
	this.Destination = "";
	this.Bookings = [];
	this.Details = [];
	this.Segments = [];
	this.TotalPcs = 0;
	this.TotalWeight = 0;
	this.CreateDT = "";
	this.isFavourite = false;
	this.isError = false;
	this.ErrorCode = "";
	this.ErrorMessage = "";
	this.statusMapping = [];

    this.DetailsIoT = [];
    this.Devices = [];                          //Added by Ivan Yuen at 20200304
	this.DeviceHistoryLogLocationMapping = [];  //Added by Ivan Yuen at 20200414

	this.CX_OSI_ERRCODE = "STATUS_RESPONSE_ERROR";
	this.mapStatusText = function (status) {
		if (this.statusMapping[status] == null)
			return status;
		else
			return this.statusMapping[status];
	};
	
	//Added by Ivan Yuen at 20200414 : START
	//Add Device HistoryLog Location Mapping method
	this.mapDeviceHistoryLogLocationText = function (Location) {
		if (this.DeviceHistoryLogLocationMapping[Location] == null)
			return Location;
		else
			return this.DeviceHistoryLogLocationMapping[Location];
	};
	
	//Added by Ivan Yuen at 20200414 : END
		
	
	this.mapShipmentSegment = function (line) {

		switch (line.StatusCode) {
			case "RCS":
				line.Milestone = 25;
				line.MilestoneStatus = "received";
				break;
			case "DEP":
				line.Milestone = 50;
				line.MilestoneStatus = "departed";
				break;
			case "ARR":
				line.Milestone = 75;
				line.MilestoneStatus = "arrived";
				break;
			case "DLV":
				line.Milestone = 100;
				line.MilestoneStatus = "delivered";
				break;
			default:
				line.Milestone = 0;
				line.MilestoneStatus = "booked";
				break;
		}

		for (var i = 0; i < this.Segments.length; i++) {
			var segLine = this.Segments[i];

			if (segLine.QDPieces == line.QDPieces && ((line.QDWeight != -1 && segLine.QDWeight == line.QDWeight) || line.QDWeight == -1)) {
				debugger;
				if (segLine.Port == line.Port || segLine.FlightNum == line.FlightNum || line.FlightNum == "" || segLine.FlightNum == "") {
					if (segLine.Milestone == 100) {
						return;
					}
					else if (line.Milestone == 0) {
						line.Milestone = segLine.Milestone;
						line.MilestoneStatus = segLine.MilestoneStatus;
					}

					this.Segments[i] = line;
					return;
				}
			}
		}

		// Unable to match any
		if (line.QDPieces < this.TotalPcs) {
			// Line is split shipment, remove all line which shipment is full
			for (var i = this.Segments.length - 1; i >= 0; i--) {
				if (this.Segments[i].QDPieces == this.TotalPcs) {
					this.Segments.splice(i, 1);
				}
			}
		}
		else if (line.QDPieces == this.TotalPcs) {
			// Line is in full, remove all splited line
			for (var i = this.Segments.length - 1; i >= 0; i--) {
				if (this.Segments[i].QDPieces < this.TotalPcs) {
					if (line.Milestone < this.Segments[i].Milestone)
						line.Milestone = this.Segments[i].Milestone;

					this.Segments.splice(i, 1);
				}
			}
		}

		// Add to current list
		this.Segments.push(line);
	};
	this.processResponse = function (res, isFavourite) {
		this.statusMapping["BKD"] = "Booking confirmed";
		this.statusMapping["LAT"] = "Late Acceptance Time";
		this.statusMapping["RCS"] = "Airline Received";
		this.statusMapping["DEP"] = "Departed";
		this.statusMapping["ARR"] = "Arrived";
		this.statusMapping["RCF"] = "Freight accepted at airport";
		this.statusMapping["AWR"] = "Documents received";
		this.statusMapping["NFD"] = "Freight ready for pick up";
		this.statusMapping["AWD"] = "Document delivered to forwarder";
		this.statusMapping["DLV"] = "Delivered";

		this.statusMapping["MAN"] = "Manifest received";
		this.statusMapping["OCI"] = "Other Information";
		// this.statusMapping["PRE"] = "";
		// this.statusMapping["TGC"] = "";
		this.statusMapping["TFD"] = "Freight transferred to airline";
		this.statusMapping["RCT"] = "Freight received from airline";
		this.statusMapping["FOH"] = "Freight on hand";
		// this.statusMapping["DDL"] = "";
		this.statusMapping["CCD"] = "Custom cleared";
		this.statusMapping["TRM"] = "Freight to be transferred to airline";
		// this.statusMapping["CRC"] = "";
		// this.statusMapping["DIS"] = "";

		this.isFavourite = isFavourite;
		this.TotalPcs = res.QDPieces;
		this.TotalWeight = res.QDWeight + "kg";
		this.CreateDT = res.CreateDT;
		this.AWBPrefix = res.AWBPrefix;
		this.AWBSuffix = res.AWBSuffix;
		this.Origin = res.Origin;
		this.Destination = res.Destination;
		this.AWBDate = "-";

		this.Bookings = [];
		this.Details = [];
		this.Segments = [];

		var consolidatedResult = {};
		var FOHCnt = 0;
		var FOHWgt = 0;
        
		if (res.FreightStatusDetails != null && res.FreightStatusDetails.length > 0) {
			// Walkthrough the detail
			for (var i = 0; i < res.FreightStatusDetails.length; i++) {
				var line = res.FreightStatusDetails[i];

				if (line.StatusCode == "BKD") {
					// Booking information
					var bk = {};

					bk.DepPort = line.MDPort1;
					bk.ArrPort = line.MDPort2;
					
					/*
						MODIFICATION START : Modified by Ivan Yuen at 20200501
						Change Date Format from dd/MM/yyyy HH:mm to dd MMM yyyy HH:mm
					*/
					bk.DTTime = line.DTTime == null ? "" : getAPIDate(line.DTTime).ToString("dd MMM yyyy HH:mm");
					bk.ATTime = line.ATTime == null ? "" : getAPIDate(line.ATTime).ToString("dd MMM yyyy HH:mm");
					/*
						bk.DTTime = line.DTTime == null ? "" : getAPIDate(line.DTTime).ToString("dd/MM/yyyy HH:mm");
						bk.ATTime = line.ATTime == null ? "" : getAPIDate(line.ATTime).ToString("dd/MM/yyyy HH:mm");
						
						MODIFICATION END : Modified by Ivan Yuen at 20200501
					*/
					
					bk.Airline = line.MDCarrierCode == "" ? "blank" : line.MDCarrierCode.toLowerCase();
					bk.FlightNum = line.MDCarrierCode + line.MDFlightNum;
					
					/*
						MODIFICATION START : Modified by Ivan Yuen at 20200501
						Change Date Format from dd/MM/yyyy HH:mm to dd MMM yyyy HH:mm
					*/
					
					bk.MDDate = line.MDDate == null ? "" : getAPIDate(line.MDDate).ToString("dd MMM yyyy HH:mm");
					
					/*
						
						bk.MDDate = line.MDDate == null ? "" : getAPIDate(line.MDDate).ToString("dd/MM/yyyy HH:mm");
						
						MODIFICATION END : Modified by Ivan Yuen at 20200501
					*/
					
					bk.QDPieces = line.QDPieces;
					bk.QDWeight = line.QDWeight > -1 ? line.QDWeight + "kg" : "";
					bk.Status = "";

					var found = false;
					for (var j = 0; j < this.Bookings.length; j++) {
						if (this.Bookings[j].FlightNum == bk.FlightNum) {
							this.Bookings[j] = bk;
							found = true;
							break;
						}
					}

					if (i + 1 <= res.FreightStatusDetails.length) {
						var extraLine = res.FreightStatusDetails[i + 1];

						// OSI after BKD - this line contains extra booking information from CX
						if (extraLine != null && extraLine.StatusCode == "OSI") {
							// skip to next line for next iteration
							i++;

							var re = /^([A-Z]{3}) TO ([A-Z]{3}) ([A-Z ]*)$/;
							var matches = re.exec(extraLine.OSILine1);

							if (matches && matches.length >= 4) {
								bk.Status = matches[3];
							}
						}
					}

					if (!found) {
						this.Bookings.push(bk);
					}
				}
				else if (line.StatusCode == "ULD") {
					if (this.Details.length > 0) {
						this.Details[this.Details.length - 1].Remarks += (this.Details[this.Details.length - 1].Remarks == "" ? "" : ";");
						this.Details[this.Details.length - 1].Remarks += line.ULDType + line.ULDSerNo + line.ULDOwnerCode;
					}
					else {
						// ULD line should not exist on its own
					}
				}
				else {
					var detail = {};
					detail.row = i;
					detail.Highlight = "";
					detail.StatusCode = line.StatusCode;

					if (line.OSILine1 == this.CX_OSI_ERRCODE) {
						this.isError = true;
						this.ErrorCode = line.OSILine1;

						if (this.ErrorMessage != "") {
							this.ErrorMessage += ", ";
						}
						this.ErrorMessage += line.OSILine2;
						continue;
					}
					else {
						detail.StatusText = this.mapStatusText(line.StatusCode);
						detail.QDPieces = line.QDPieces;
						detail.QDWeight = line.QDWeight > -1 ? line.QDWeight + "kg" : "";
					}
					detail.Port = line.MDPort1;
					detail.Airline = line.MDCarrierCode == "" ? "blank" : line.MDCarrierCode.toLowerCase();
					detail.FlightNum = line.MDCarrierCode + line.MDFlightNum;

					if (line.StatusCode == "DEP") {
						
						/*
							MODIFICATION START : Modified by Ivan Yuen at 20200501
							Change Date Format from dd/MM HH:mm to dd MMM HH:mm
						*/
						detail.EventDate = line.DTTime == null ? "" : getAPIDate(line.DTTime).ToString("dd MMM HH:mm");
						/*
							detail.EventDate = line.DTTime == null ? "" : getAPIDate(line.DTTime).ToString("dd/MM HH:mm");
							
							MODIFICATION END : Modified by Ivan Yuen at 20200501
						*/
						

						if (this.AWBDate == "-") {
							this.AWBDate = getAPIDate(line.DTTime).ToString("dd/MM");
						}
					}
					else {
					
						/*
							MODIFICATION START : Modified by Ivan Yuen at 20200501
							Change Date Format from dd/MM HH:mm to dd MMM HH:mm
						*/
						detail.EventDate = line.MDDate == null ? "" : getAPIDate(line.MDDate).ToString("dd MMM HH:mm");
						/*
							detail.EventDate = line.MDDate == null ? "" : getAPIDate(line.MDDate).ToString("dd/MM HH:mm");
							
							MODIFICATION END : Modified by Ivan Yuen at 20200501
						*/
					}

					detail.Remarks = "";

					this.Details.push(detail);
					//this.mapShipmentSegment(detail)

					if (line.StatusCode == "FOH") {
						FOHCnt += line.QDPieces;
						FOHWgt += line.QDWeight;
					}

					if (line.StatusCode == "FOH" ||
						line.StatusCode == "RCS" ||
						line.StatusCode == "DEP" ||
						line.StatusCode == "ARR" ||
						line.StatusCode == "DLV"
					) {
						if (consolidatedResult[line.MDPort1] === undefined) {
							consolidatedResult[line.MDPort1] =
								{
									"FOH": { qty: 0, flight: [] },
									"RCS": { qty: 0, flight: [] },
									"DEP": { qty: 0, flight: [] },
									"ARR": { qty: 0, flight: [] },
									"DLV": { qty: 0, flight: [] }
								}
						}

						consolidatedResult[line.MDPort1][line.StatusCode].qty += line.QDPieces;
						consolidatedResult[line.MDPort1][line.StatusCode].flight.push({
							"row": i,
							"flightNo": line.MDCarrierCode + line.MDFlightNum,
							/* 
								MODIFICATION START - Modified by Ivan Yuen at 20200501
								Use DTTime for Status Code = 'DEP', MDDate for other status codes
							*/
							"eventDate": line.MDDate == null ? "" : (line.StatusCode == "DEP" ? getAPIDate(line.DTTime).ToString("dd MMM HH:mm") : getAPIDate(line.MDDate).ToString("dd MMM HH:mm")),
							/*
								"eventDate": line.MDDate == null ? "" : getAPIDate(line.MDDate).ToString("dd/MM HH:mm"),
								MODIFICATION END - Modified by Ivan Yuen at 20200501
							 */
							
							"airline": line.Airline,
							"port": line.MDPort1,
							"pcs": line.QDPieces,
							"wgt": line.QDWeight > -1 ? line.QDWeight : 0
						});
					}
				}
			}

			if (FOHCnt == 0) {
				FOHCnt = res.QDPieces;
				FOHWgt = res.QDWeight;
			}

			var processedCnt = 0;
			var processedWgt = 0;
			var keys = Object.keys(consolidatedResult);

			for (var i = keys.length - 1; i >= 0; i--) {
				var k = keys[i];
				if (consolidatedResult[k]["DLV"].qty > 0 && FOHCnt > processedCnt) {
					for (var z = consolidatedResult[k]["DLV"].flight.length - 1; z >= 0; z--) {

						var pcs;
						var wgt;
						var line = {};
						var f = consolidatedResult[k]["DLV"].flight[z];

						if (processedCnt + f.pcs > FOHCnt) {
							pcs = FOHCnt - processedCnt;
							wgt = FOHWgt - processedWgt;
						}
						else {
							pcs = f.pcs;
							wgt = f.wgt;
						}

						line.StatusText = this.mapStatusText("DLV");
						line.row = f.row;
						line.Port = f.port;
						line.Airline = f.airline;
						line.FlightNum = f.flightNo;
						line.EventDate = f.eventDate;
						line.QDPieces = pcs;
						line.QDWeight = wgt + "kg";
						line.StatusCode = "DLV";
						line.Milestone = 100;
						line.MilestoneStatus = "delivered";
						line.Remarks = "";

						processedCnt += f.pcs;
						processedWgt += f.wgt;

						this.Segments.unshift(line);

						if (processedCnt >= FOHCnt)
							break;
					}
				}

				if (consolidatedResult[k]["DEP"].qty > processedCnt && FOHCnt > processedCnt) {
					for (var z = consolidatedResult[k]["DEP"].flight.length - 1; z >= 0; z--) {

						var pcs;
						var wgt;
						var line = {};
						var f = consolidatedResult[k]["DEP"].flight[z];

						if (processedCnt + f.pcs > FOHCnt) {
							pcs = FOHCnt - processedCnt;
							wgt = FOHWgt - processedWgt;
						}
						else {
							pcs = f.pcs;
							wgt = f.wgt;
						}

						line.StatusText = this.mapStatusText("DEP");
						line.row = f.row;
						line.Port = f.port;
						line.Airline = f.airline;
						line.FlightNum = f.flightNo;
						line.EventDate = f.eventDate;
						line.QDPieces = pcs;
						line.QDWeight = wgt + "kg";
						line.StatusCode = "DEP";
						if (i >= 1)
							line.Milestone = 75;
						else
							line.Milestone = 50;
						line.MilestoneStatus = "departed";
						line.Remarks = "";

						processedCnt += f.pcs;
						processedWgt += f.wgt;

						this.Segments.unshift(line);

						if (processedCnt >= FOHCnt)
							break;
					}
				}

				if (consolidatedResult[k]["ARR"].qty > processedCnt && FOHCnt > processedCnt) {
					for (var z = consolidatedResult[k]["ARR"].flight.length - 1; z >= 0; z--) {

						var pcs;
						var wgt;
						var line = {};
						var f = consolidatedResult[k]["ARR"].flight[z];

						if (processedCnt + f.pcs > FOHCnt) {
							pcs = FOHCnt - processedCnt;
							wgt = FOHWgt - processedWgt;
						}
						else {
							pcs = f.pcs;
							wgt = f.wgt;
						}

						line.StatusText = this.mapStatusText("ARR");
						line.row = f.row;
						line.Port = f.port;
						line.Airline = f.airline;
						line.FlightNum = f.flightNo;
						line.EventDate = f.eventDate;
						line.QDPieces = pcs;
						line.QDWeight = wgt + "kg";
						line.StatusCode = "ARR";
						line.Milestone = 75;
						line.MilestoneStatus = "arrived";
						line.Remarks = "";

						processedCnt += f.pcs;
						processedWgt += f.wgt;

						this.Segments.unshift(line);

						if (processedCnt >= FOHCnt)
							break;
					}
				}

				if (consolidatedResult[k]["RCS"].qty > processedCnt && FOHCnt > processedCnt) {
					for (var z = consolidatedResult[k]["RCS"].flight.length - 1; z >= 0; z--) {

						var pcs;
						var wgt;
						var line = {};
						var f = consolidatedResult[k]["RCS"].flight[z];

						if (processedCnt + f.pcs > FOHCnt) {
							pcs = FOHCnt - processedCnt;
							wgt = FOHWgt - processedWgt;
						}
						else {
							pcs = f.pcs;
							wgt = f.wgt;
						}

						line.StatusText = this.mapStatusText("RCS");
						line.row = f.row;
						line.Port = f.port;
						line.Airline = f.airline;
						line.FlightNum = f.flightNo;
						line.EventDate = f.eventDate;
						line.QDPieces = pcs;
						line.QDWeight = wgt + "kg";
						line.StatusCode = "RCS";
						line.Milestone = 25;
						line.MilestoneStatus = "received";
						line.Remarks = "";

						processedCnt += f.pcs;
						processedWgt += f.wgt;

						this.Segments.unshift(line);

						if (processedCnt >= FOHCnt)
							break;
					}
				}

				if (consolidatedResult[k]["FOH"].qty > processedCnt && FOHCnt > processedCnt) {
					for (var z = consolidatedResult[k]["FOH"].flight.length - 1; z >= 0; z--) {

						var pcs;
						var wgt;
						var line = {};
						var f = consolidatedResult[k]["FOH"].flight[z];

						if (processedCnt + f.pcs > FOHCnt) {
							pcs = FOHCnt - processedCnt;
							wgt = FOHWgt - processedWgt;
						}
						else {
							pcs = f.pcs;
							wgt = f.wgt;
						}

						line.StatusText = this.mapStatusText("FOH");
						line.row = f.row;
						line.Port = f.port;
						line.Airline = f.airline;
						line.FlightNum = f.flightNo != null ? f.flightNo : "";
						line.EventDate = f.eventDate;
						line.QDPieces = pcs;
						line.QDWeight = wgt + "kg";
						line.StatusCode = "FOH";
						line.Milestone = 0;
						line.MilestoneStatus = "";
						line.Remarks = "";

						processedCnt += f.pcs;
						processedWgt += f.wgt;

						this.Segments.unshift(line);

						if (processedCnt >= FOHCnt)
							break;
					}
				}
			}

			for (var i = 0; i < this.Details.length; i++) {
				for (var j = 0; j < this.Segments.length; j++) {
					if (this.Details[i].row == this.Segments[j].row) {
						this.Details[i].Highlight = "highlighted";
					}
				}
			}
		} else {
			this.isError = true;

			if (res.FailReason == 2) { // Unsupported Airline
				this.ErrorCode = "ERR_NOT_SUPPORTED";
				this.ErrorMessage = "Unsupported Airline";
			} else if (res.FailReason == 3) { // Timeout / Not found			
				this.ErrorCode = "ERR_NOT_UPDATE";
				this.ErrorMessage = "AWB Not Update";
			}
		}

		if (res.FreightStatusDevices != null && res.FreightStatusDevices.length > 0) {
			for (var i = 0; i < res.FreightStatusDevices.length; i++) {
				var iot = {}
				iot.DeviceName = res.FreightStatusDevices[i].DeviceName;
				iot.Vendor = res.FreightStatusDevices[i].Vendor;
				iot.AttachDT = getAPIDate(res.FreightStatusDevices[i].DeviceAttachDT);
				iot.DetachDT = getAPIDate(res.FreightStatusDevices[i].DeviceDetachDT);
				iot.TempUBound = res.FreightStatusDevices[i].TemperatureUBound;
				iot.TempLBound = res.FreightStatusDevices[i].TemperatureLBound;

				iot.Status = []

				for (var j = 0; j < res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs.length; j++) {
					var iotStatus = {}
					iotStatus.Time = getAPIDate(res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].TimeOfReport);
					iotStatus.Battery = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Battery;
					iotStatus.Light = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Light;
					iotStatus.Temperature = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Temperature;
					iotStatus.Humidity = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Humidity;
					iotStatus.Longitude = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Longitude;
					iotStatus.Latitude = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Latitude;

					iot.Status.push(iotStatus);
				}

				this.DetailsIoT.push(iot);
			}
        }

        //Added by Ivan Yuen at 20200304 : START
        //Add Mapping for FreightStatus_Device objects in TNT response to Device objects in tnt_obj

        if (res.FreightStatusDevices != null && res.FreightStatusDevices.length > 0) {
		
			//Added by Ivan Yuen at 20200414 : START
			//Device HistoryLog Location Mapping
			
			this.DeviceHistoryLogLocationMapping["ACCEPTANCE"] = "Acceptance";
			this.DeviceHistoryLogLocationMapping["RAMP (DEP)"] = "Departure";
			this.DeviceHistoryLogLocationMapping["IN W/HSE"] = "Warehouse";
			this.DeviceHistoryLogLocationMapping["RAMP (ARR)"] = "Arrival";
			this.DeviceHistoryLogLocationMapping["DELIVERY"] = "Delivery";
		
			//Added by Ivan Yuen at 20200414 : END

            for (var i = 0; i < res.FreightStatusDevices.length; i++) {

                var Device = {}

                Device.DeviceSeq = res.FreightStatusDevices[i].DeviceSeq;
                Device.DeviceName = res.FreightStatusDevices[i].DeviceName;
                Device.ULDNo = res.FreightStatusDevices[i].ULDNo;
                Device.Vendor = res.FreightStatusDevices[i].Vendor;
                Device.DeviceAttachDT = getAPIDate(res.FreightStatusDevices[i].DeviceAttachDT);
                Device.DeviceDetachDT = getAPIDate(res.FreightStatusDevices[i].DeviceDetachDT);
                Device.TemperatureLBound = res.FreightStatusDevices[i].TemperatureLBound;
                Device.TemperatureUBound = res.FreightStatusDevices[i].TemperatureUBound;
                Device.TemperatureUnit = res.FreightStatusDevices[i].TemperatureUnit;
                Device.VoltageAtOrigin = res.FreightStatusDevices[i].VoltageAtOrigin;
                Device.VoltageAtDestination = res.FreightStatusDevices[i].VoltageAtDestination;
                Device.VoltageUnit = res.FreightStatusDevices[i].VoltageUnit;

                Device.DeviceHistoryLogs = []

                for (var j = 0; j < res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs.length; j++) {

                    var DeviceHistoryLog = {}

                    DeviceHistoryLog.DeviceHistoryLogSeq = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].DeviceHistoryLogSeq;
                    DeviceHistoryLog.TimeOfReport = getAPIDate(res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].TimeOfReport);
                    DeviceHistoryLog.Station = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Station;
                    
					//Modified by Ivan Yuen at 20200414 : START
					//Use this.mapDeviceHistoryLogLocationText method to map Device HistoryLog Location Text
					DeviceHistoryLog.Location = this.mapDeviceHistoryLogLocationText(res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Location);
					//DeviceHistoryLog.Location = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Location;
                    //Modified by Ivan Yuen at 20200414 : END
					
					DeviceHistoryLog.Latitude = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Latitude;
                    DeviceHistoryLog.Longitude = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Longitude;
                    DeviceHistoryLog.Temperature = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Temperature;
                    DeviceHistoryLog.Battery = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Battery;
                    DeviceHistoryLog.Light = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Light;
                    DeviceHistoryLog.Voltage = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Voltage;
                    DeviceHistoryLog.Humidity = res.FreightStatusDevices[i].FreightStatusDeviceHistoryLogs[j].Humidity;

                    Device.DeviceHistoryLogs.push(DeviceHistoryLog)

                }

                this.Devices.push(Device)


            }


        }


        //Added by Ivan Yuen at 20200304 : END
	}
};

function isAWB(awb) {
	if(awb == "157-61239012")
		return true;
	var re = /^[0-9]{3}-[0-9]{8}$/;
	if (!re.test(awb)) {
		return false;
	}
	var suffix = parseInt(awb.substring(4, 11));
	var checkDigit = parseInt(awb.substring(11));
	return (suffix % 7 == checkDigit);
}

String.prototype.insert = function (index, string) {
	if (index > 0)
		return this.substring(0, index) + string + this.substring(index, this.length);
	else
		return string + this;
};