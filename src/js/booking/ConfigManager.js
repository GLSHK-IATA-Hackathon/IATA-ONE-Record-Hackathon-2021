/*
 * The below functions require:
 * 1. https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js
 */

function configManager() {
    var version = Date.now().toString();
	var configFilePath = '/web.config.js'
	
	this.injectConfig = function () {
		return new Promise(function (subResolve) {
			var loaded;
			var s = document.createElement("script");
			var h = document.getElementsByTagName("script")[0];
			s.src = configFilePath + "?" + version;

			h.parentNode.insertBefore(s, h);

			s.onreadystatechange = s.onload = function () {
				if (!loaded) {
					subResolve();
				}
				loaded = true;
			};
		});
	}


}

var ConfigManager = Object.freeze(new configManager());