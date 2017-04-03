(function() {

"use strict";

var module = angular.module('isc.resources', ['ngResource']);

module.factory('TestResource', ['$resource',
	function($resource) {
		return $resource('/api/test/:id', {}, {
			query: {
				url: '/api/run/test/:run_id/',
				isArray: true
			}
		});
	}
]);

module.factory('MemoryResource', ['$resource',
	function($resource) {
		return $resource('/api/run/memory/:run_id/', {}, {});
	}
]);

module.factory('RunResource', ['$resource',
	function($resource) {
		return $resource('/api/run/:id', {}, {
			query: {
				url: '/api/config/run/:config_id/',
				isArray: true
			}
		});
	}
]);

module.factory('ConfigResource', ['$resource',
	function($resource) {
		return $resource('/api/config/:id', {}, {});
	}
]);

module.factory('SettingsResource', ['$resource',
	function($resource) {
		return $resource('/api/settings/:setting', {}, {});
	}
]);

})();
