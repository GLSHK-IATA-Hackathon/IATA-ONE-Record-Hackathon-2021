/*
 * The below functions require:
 * 1. https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js
 */

function injectionManager() {
    var version = '?_=20210715';

    var defStylePath = '/DesktopModules/MVC/Booking/Style/';
    var defScriptPath = '/js/bookingdetail/';
    var defServicePath = '/js/bookingdetail/';
	var defConfigPath = '/';
	
	this.injectConfig = function () {
		var configFile = 'web.config.js'
		return new Promise(function (subResolve) {
			var loaded;
			var s = document.createElement("script");
			var h = document.getElementsByTagName("script")[0];
			s.src = defConfigPath + configFile + version;

			h.parentNode.insertBefore(s, h);

			s.onreadystatechange = s.onload = function () {
				if (!loaded) {
					subResolve();
				}
				loaded = true;
			};
		});
	}

    this.injectScripts = function (scripts) {
        return Promise.all(scripts.map(function (script) {
            return new Promise(function (subResolve) {
                var loaded;
                var s = document.createElement("script");
                var h = document.getElementsByTagName("script")[0];
                s.src = defScriptPath + script + version;

                h.parentNode.insertBefore(s, h);

                s.onreadystatechange = s.onload = function () {
                    if (!loaded) {
                        subResolve();
                    }
                    loaded = true;
                };
            });
        }));
    }

    this.injectThirdPartyScripts = function (scripts) {
        return Promise.all(scripts.map(function (script) {
            return new Promise(function (subResolve) {
                var loaded;
                var s = document.createElement("script");
                var h = document.getElementsByTagName("script")[0];
                s.src = script;

                h.parentNode.insertBefore(s, h);

                s.onreadystatechange = s.onload = function () {
                    if (!loaded) {
                        subResolve();
                    }
                    loaded = true;
                };
            });
        }));
    }

    this.injectService = function (services) {
        return Promise.all(services.map(function (script) {
            return new Promise(function (subResolve) {
                var loaded;
                var s = document.createElement("script");
                var h = document.getElementsByTagName("script")[0];
                s.src = defServicePath + script + version;

                h.parentNode.insertBefore(s, h);

                s.onreadystatechange = s.onload = function () {
                    if (!loaded) {
                        subResolve();
                    }
                    loaded = true;
                };
            });
        }));
    }

    this.injectStyle = function (styles) {
        return new Promise(function (resolve) {
            styles.forEach(function (style) {
                var link = document.createElement("link");
                link.href = defStylePath + style + version;
                link.type = "text/css";
                link.rel = "stylesheet";

                $("link").last().after(link);
            });

            resolve();
        })
    }
}

var InjectionManager = Object.freeze(new injectionManager());