/*!
 * ASP.NET SignalR JavaScript Library v2.2.1
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['bookingHub'] = this.createHubProxy('bookingHub'); 
        proxies['bookingHub'].client = { };
        proxies['bookingHub'].server = {
            addAddressBookContact: function (contact) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["AddAddressBookContact"], $.makeArray(arguments)));
             },

            checkSchedulerProcess: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["checkSchedulerProcess"], $.makeArray(arguments)));
             },

            deleteTemplateRecord: function (component, templateID) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["DeleteTemplateRecord"], $.makeArray(arguments)));
             },

            execute: function (context) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["Execute"], $.makeArray(arguments)));
             },

            getAddressBookList: function (addrCode, count) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAddressBookList"], $.makeArray(arguments)));
             },

            getAirlineBookingDetailTemplates: function (airline) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAirlineBookingDetailTemplates"], $.makeArray(arguments)));
             },

            getAirlineKeyShipper: function (airline) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAirlineKeyShipper"], $.makeArray(arguments)));
             },

            getAirlineListByPort: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAirlineListByPort"], $.makeArray(arguments)));
             },

            getAirlineTemplates: function (airline, afterAction) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAirlineTemplates"], $.makeArray(arguments)));
             },

            getAirlineTemplatesMultiAWB: function (airline) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAirlineTemplatesMultiAWB"], $.makeArray(arguments)));
             },

            getAjaxBasicInfo: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAjaxBasicInfo"], $.makeArray(arguments)));
             },

            getAWBStockList: function (awbPrefix, awbSuffix) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetAWBStockList"], $.makeArray(arguments)));
             },

            getBooking: function (airline, awbPrefix, awbSuffix) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetBooking"], $.makeArray(arguments)));
             },

            getBookingHistorySummary: function (airline, awbPrefix, awbSuffix) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetBookingHistorySummary"], $.makeArray(arguments)));
             },

            getBookingTranRecord: function (airline, awbPrefix, awbSuffix, tranId, refTranId) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetBookingTranRecord"], $.makeArray(arguments)));
             },

            getDefaultOptionalValue: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetDefaultOptionalValue"], $.makeArray(arguments)));
             },

            getGoodsDescTypeList: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetGoodsDescTypeList"], $.makeArray(arguments)));
             },

            getIATACode: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetIATACode"], $.makeArray(arguments)));
             },

            getIATACodeForRS: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetIATACodeForRS"], $.makeArray(arguments)));
             },

            getLHStockAgtAccountNo: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetLHStockAgtAccountNo"], $.makeArray(arguments)));
             },

            getNGTTDeviceIDFormat: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetNGTTDeviceIDFormat"], $.makeArray(arguments)));
             },

            getNGTTSHC: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetNGTTSHC"], $.makeArray(arguments)));
             },

            getPortInfo: function (src) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetPortInfo"], $.makeArray(arguments)));
             },

            getPriorityTypeList: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetPriorityTypeList"], $.makeArray(arguments)));
             },

            getSpecialHandlingCode: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetSpecialHandlingCode"], $.makeArray(arguments)));
             },

            getTemplateRecordList: function (component, templateName, count) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetTemplateRecordList"], $.makeArray(arguments)));
             },

            getTemplateRecordLoad: function (component, templateID) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetTemplateRecordLoad"], $.makeArray(arguments)));
             },

            getUserInfo: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["GetUserInfo"], $.makeArray(arguments)));
             },

            processMessage: function (msg) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["ProcessMessage"], $.makeArray(arguments)));
             },

            saveTemplateRecord: function (template) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SaveTemplateRecord"], $.makeArray(arguments)));
             },

            searchBookings: function (userID, fromDate, toDate, origin, dest, type) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SearchBookings"], $.makeArray(arguments)));
             },

            searchBookingsByAWB: function (userID, fromDate, toDate, awbPrefix, awbSuffix, type) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SearchBookingsByAWB"], $.makeArray(arguments)));
             },

            searchBookingsOfCurrentCompany: function (searchDay) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SearchBookingsOfCurrentCompany"], $.makeArray(arguments)));
             },

            searchBookingsOfCurrentUser: function (searchDay) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SearchBookingsOfCurrentUser"], $.makeArray(arguments)));
             },

            setLogger: function () {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SetLogger"], $.makeArray(arguments)));
             },

            submit: function (jsonObject) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["Submit"], $.makeArray(arguments)));
             },

            submitDraft: function (jsonObject) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SubmitDraft"], $.makeArray(arguments)));
             },

            submitMulti: function (jsonObject) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SubmitMulti"], $.makeArray(arguments)));
             },

            submitMultiAirline: function (jsonObject) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SubmitMultiAirline"], $.makeArray(arguments)));
             },

            submitMultiDraft: function (jsonObject) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["SubmitMultiDraft"], $.makeArray(arguments)));
             },

            writeAjaxRequestLog: function (requestPath, responseTime, success) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["WriteAjaxRequestLog"], $.makeArray(arguments)));
             },

            writeSpreadsheetBookingLog: function (bookings) {
                return proxies['bookingHub'].invoke.apply(proxies['bookingHub'], $.merge(["WriteSpreadsheetBookingLog"], $.makeArray(arguments)));
             }
        };

        proxies['flightAvailabilityHub'] = this.createHubProxy('flightAvailabilityHub'); 
        proxies['flightAvailabilityHub'].client = { };
        proxies['flightAvailabilityHub'].server = {
            execute: function (context) {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["Execute"], $.makeArray(arguments)));
             },

            flightAvailabilityPortQuery: function (searchString) {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["FlightAvailabilityPortQuery"], $.makeArray(arguments)));
             },

            flightAvailabilitySearch: function (authKey, orig, dest, flightDate, airlines, isReqFromFS) {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["FlightAvailabilitySearch"], $.makeArray(arguments)));
             },

            flightCapacitySearch: function (authKey, carrierCode, orig, dest, flightNum, allotmentId, flightDate) {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["FlightCapacitySearch"], $.makeArray(arguments)));
             },

            hello: function () {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["Hello"], $.makeArray(arguments)));
             },

            processMessage: function (msg) {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["ProcessMessage"], $.makeArray(arguments)));
             },

            setLogger: function () {
                return proxies['flightAvailabilityHub'].invoke.apply(proxies['flightAvailabilityHub'], $.merge(["SetLogger"], $.makeArray(arguments)));
             }
        };

        proxies['trackAndTraceHub'] = this.createHubProxy('trackAndTraceHub'); 
        proxies['trackAndTraceHub'].client = { };
        proxies['trackAndTraceHub'].server = {
            dashboardSearch: function (allAccount, isToday) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["DashboardSearch"], $.makeArray(arguments)));
             },

            execute: function (context) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["Execute"], $.makeArray(arguments)));
             },

            getFavouriteAWBs: function (allAccount) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["GetFavouriteAWBs"], $.makeArray(arguments)));
             },

            hello: function () {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["Hello"], $.makeArray(arguments)));
             },

            processMessage: function (msg) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["ProcessMessage"], $.makeArray(arguments)));
             },

            setLogger: function () {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["SetLogger"], $.makeArray(arguments)));
             },

            toggleFavouriteAWB: function (awbPrefix, awbSuffix, port, shipmentDate) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["ToggleFavouriteAWB"], $.makeArray(arguments)));
             },

            trackAndTraceMultiSearch: function (awbList) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["TrackAndTraceMultiSearch"], $.makeArray(arguments)));
             },

            trackAndTraceSearch: function (awbPrefix, awbSuffix, getLatest) {
                return proxies['trackAndTraceHub'].invoke.apply(proxies['trackAndTraceHub'], $.merge(["TrackAndTraceSearch"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));