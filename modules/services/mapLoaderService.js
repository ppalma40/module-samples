angular.module('MlsListingSearch')
	.factory('mapLoaderService', ['$document', '$q', '$timeout','$log', function($document, $q, $timeout, $log) {
		var document = $document[0];
		var promises = {};
		var mapVersion = ENV.MapsVersion; 

		function loader(createElement) {
			return function(url) {
				if (typeof promises[url] === 'undefined') {
					var deferred = $q.defer();
					var element = createElement(url);

					element.onload = element.onreadystatechange = function(e) {
						if (element.readyState && element.readyState !== 'complete' && element.readyState !== 'loaded') {
							return;
						}

						$timeout(function() {
							deferred.resolve(e);
						});
					};
					element.onerror = function(e) {
						$timeout(function() {
							deferred.reject(e);
						});
					};

					promises[url] = deferred.promise;
				}

				return promises[url];
			};
		}

		var loadJavascript = loader(function(src) {
			var script = document.createElement('script');
			script.id = "clawmap";
			script.src = src;

			document.body.appendChild(script);
			return script;
		});

		function MapModuleLoader() {
			this.state = 'idle';
			this.scriptUrl = '/Maps/Scripts/CLAWMap.js?v=' + mapVersion;
		}

		MapModuleLoader.prototype.load = function() {
			this.state = 'pending';
			let self = this;
			this.promise = loadJavascript(this.scriptUrl).then(function(result) {
				self.state = 'loaded';
			}, function(result) {
				self.state = 'error';
			})

			return this.promise;
		}

		return new MapModuleLoader();
	}]);