$(function(){ $("html").addClass("general"); });

// Error Message
function CreateSkinErrorMessage() {
	if (arguments.length == 0) {
		debugger;
		console.log("Usage: CreateSkinErrorMessage(msg, item1, desc1, item2, desc2, etc...);");
		return;
	}
	var err_main = $("#error_main_template").html();
	err_main = err_main.replace("$ERR_MESSAGE$", arguments[0]);
	
	var err_item_template = $("#error_item_template").html();
	
	var err_items = "";
	
	for (var i=1; i<arguments.length -1; i+=2) {
		var title = arguments[i];
		var desc = (arguments.length > i+1?arguments[i+1]:"");
		err_items += err_item_template
			.replace("$ERR_TITLE$", title)
			.replace("$ERR_DESCRIPTION$", desc);
	}
	
	err_main = err_main.replace("$ERR_ITEMS$", err_items);
	
	return err_main;
}

function ToggleLoading(show, message) {
	
	$(".wbg").css("pointer-events", "");
	$(".wbg").css("opacity", "");
	$(".wbg").css("filter", "");
	
	if (message == null)
		message = "Loading...";
	
	$("#loading #loading_message").html(message);
	$("#loading_partial").addClass("disabled");
	
	if (show)
		$("#loading").removeClass("disabled");
	else
		$("#loading").addClass("disabled");	
	
}

function TogglePartialLoading(show, message, disableInput) {
	if (message == null)
		message = "Loading more results. This may take a while...";
	
	$("#loading_message_partial").html(message);
	$("#loading").addClass("disabled");
	
	if (show) {
		$("#loading_partial").removeClass("disabled");
		if (disableInput) {
			$(".wbg").css("pointer-events", "none");
			$(".wbg").css("opacity", "0.4");
			$(".wbg").css("filter", "alpha(opacity=40)");
		}
	}
	else {
		$("#loading_partial").addClass("disabled");		
		//debugger;
		$(".wbg").css("pointer-events", "");	
		$(".wbg").css("opacity", "");
		$(".wbg").css("filter", "");
	}	
}

function RepositionFooter() {
	var docHeight = $(window).height();
		var footerHeight = $('.footer').height();
		var footerTop = $('.footer').position().top + footerHeight;  
		
		if (footerTop < docHeight) {
			$('.footer').css('margin-top', (docHeight - footerTop) - 38 + 'px');
		}
}

// Search string by regular expression
String.prototype.regexIndexOf = function(regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

// String insert
String.prototype.insert = function (index, string) {
	if (index > 0)
		return this.substring(0, index) + string + this.substring(index, this.length);
	else
		return string + this;
};

// String repeat n times
String.prototype.times = function(n) {
	var s = '';
	for (var i = 0; i < n; i++)
		s += this;
	return s;
};

// Zero padding
String.prototype.zp = function(n) { return '0'.times(n - this.length) + this; }
Number.prototype.zp = function(n) { return this.toString().zp(n); }

// Global variable for Weekday / Months name
var gsDayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var gsDayShortNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var gsMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var gsMonthShortNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var gsAMPM = ['AM','PM'];

var gsDayNames_zh_HK = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
var gsDayShortNames_zh_HK = ['日','一','二','三','四','五','六'];
var gsMonthNames_zh_HK = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
var gsMonthShortNames_zh_HK = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
var gsAMPM_zh_HK = ['上午','下午'];

var gsDayNames_zh_CN = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
var gsDayShortNames_zh_CN = ['日','一','二','三','四','五','六'];
var gsMonthNames_zh_CN = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
var gsMonthShortNames_zh_CN = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
var gsAMPM_zh_CN = ['上午','下午'];

Date.prototype.ToString = function(f)
{
	if (!this.valueOf())
		return '&nbsp;';

	var d = this;

	return f.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|hh|h|HH|H|mm|m|ss|s|tt\/p)/gi,
		function($1)
		{
			var sDayNames;
			var sDayShortNames;
			var sMonthNames;
			var sMonthShortNames;
			var sAMPM;
			
			if (_currentCulture == "zh-HK") {
				sDayNames = gsDayNames_zh_HK;
				sDayShortNames = gsDayShortNames_zh_HK;
				sMonthNames = gsMonthNames_zh_HK;
				sMonthShortNames = gsMonthShortNames_zh_HK;
				sAMPM = gsAMPM_zh_HK;
			}
			else if (_currentCulture == "zh_CN") {
				sDayNames = gsDayNames_zh_CN;
				sDayShortNames = gsDayShortNames_zh_CN;
				sMonthNames = gsMonthNames_zh_CN;
				sMonthShortNames = gsMonthShortNames_zh_CN;
				sAMPM = gsAMPM_zh_CN;
			}
			else {
				sDayNames = gsDayNames;
				sDayShortNames = gsDayShortNames;
				sMonthNames = gsMonthNames;
				sMonthShortNames = gsMonthShortNames;
				sAMPM = gsAMPM;
			}
			
			switch ($1)
			{	
				case 'yyyy': return d.getFullYear().zp(4);		
				case 'yy': return d.getFullYear().zp(4).slice(2,4);	
				case 'MMMM':  return sMonthNames[d.getMonth()];	
				case 'MMM':  return sMonthShortNames[d.getMonth()];
				case 'MM':   return (d.getMonth() + 1).zp(2);
				case 'M':   return (d.getMonth() + 1);				
				case 'dddd': return sDayNames[d.getDay()];
				case 'ddd':  return sDayShortNames[d.getDay()];
				case 'dd':   return d.getDate().zp(2);
				case 'd':    return d.getDate();
				case 'hh':   return ((h = d.getHours() % 12) ? h : 12).zp(2);
				case 'h':   return ((h = d.getHours() % 12) ? h : 12);
				case 'HH':   return d.getHours().zp(2);
				case 'H':   return d.getHours();
				case 'mm':   return d.getMinutes().zp(2);
				case 'm':   return d.getMinutes();
				case 'ss':   return d.getSeconds().zp(2);
				case 's':   return d.getSeconds();				
				case 'tt':  return d.getHours() < 12 ? sAMPM[0] : sAMPM[1];
			}
		}
	);
};

Date.prototype.convertFromServerDate = function(datestring) {
	return datestring.convertToDate();
};
String.prototype.convertToDate = function() {
	var datestring = this.valueOf();
	return new Date(datestring.substring(0, 4), 
					parseInt(datestring.substring(4, 6))-1,
					datestring.substring(6, 8), 
					datestring.substring(8, 10), 
					datestring.substring(10, 12), 
					datestring.substring(12, 14), 
					datestring.substring(14));
}

Date.prototype.addDays = function(days)
{
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
};

Date.prototype.addMinutes = function(minutes) {	
	var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() + minutes*60000);
	return dat;
};

Date.prototype.addSeconds = function(minutes) {	
	var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() + minutes*1000);
	return dat;
};

Date.prototype.getDateOnly = function() {	
	var dat = new Date(this.valueOf());
	return new Date(dat.getFullYear(),dat.getMonth(),dat.getDate());
};

var _currentDateOffset = new Date().getTimezoneOffset()*60000;

function getAPIDate(gbTS) {
	//console.log(new Date().getTimezoneOffset());
	//console.log(_currentDateOffset/60000);
	return new Date(gbTS.Seconds*1000 + _currentDateOffset);
}

var DateDiff = {

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000*7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

function updateQueryStringParameter(uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		return uri + separator + key + "=" + value;
	}
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&/]" + name + "([/=]([^&#]*)|&|#|/|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function i18nInitCore(cdnVersion) {
	$.ajaxSetup({
		async: false
	});

	if (cdnVersion == null) {
		cdnVersion = "0"
	}
	var enPromise = jQuery.getJSON("./locales/translation_en-US.json?v=" + cdnVersion, 
		function(eData) { 
			console.log("core - enUS");
			i18next.addResources('en-US', 'translation', eData); 
		}
	);
	
	if (_currentCulture != "en-US") {
		var otherPromise = jQuery.getJSON("./locales/translation_" + _currentCulture + ".json?v=" + cdnVersion, 
			function(data) { 
				i18next.addResources(_currentCulture, 'translation', data); 
			}
		);
		
		$.when(enPromise, otherPromise).then(function() {
			$("html").localize();
		});
	}
	else {
		$.when(enPromise).then(function() {
			$("html").localize();
		});
	}
}	

function i18nInit(path, cdnVersion) {
	$.ajaxSetup({
		async: false
	});

	if (cdnVersion == null) {
		cdnVersion = "0"
	}
	var enPromise = jQuery.getJSON("./locales/translation_en-US.json?v=" + cdnVersion, 
		function(eData) { 
			i18next.addResources('en-US', 'translation', eData); 
		}
	);
	
	if (_currentCulture != "en-US") {
		var otherPromise = jQuery.getJSON("./locales/translation_" + _currentCulture + ".json?v=" + cdnVersion, 
			function(data) { 
				i18next.addResources(_currentCulture, 'translation', data); 
			}
		);
		
		$.when(enPromise, otherPromise).then(function() {
			$("html").localize();
		});
	}
	else {
		$.when(enPromise).then(function() {
			$("html").localize();
		});
	}
}	
	
function enableClassicLink(link) {
	$("#classicLink").removeClass("disabled");
	$("#classicLinkHref").prop("href", link);
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

function getUTCDateString(d) {
	var strMonth = "";
	var strDay = "";
	if ( d instanceof Date) {
		strMonth = (d.getUTCMonth() + 1).toString();
		if (strMonth.length ==  1)  {
			strMonth = "0" + strMonth;
		}
		strDay = d.getUTCDate().toString();
		if (strDay.length ==  1)  {
			strDay = "0" + strDay;
		}
		
	}
	return d.getUTCFullYear().toString() + "-" + strMonth + "-" + strDay ;
}