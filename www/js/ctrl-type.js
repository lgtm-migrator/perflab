(function() {

"use strict";

var app = angular.module('perflabApp');

app.controller('configTypeController',
	['$scope', '$routeParams', 'SettingsResource',
	function ($scope, $routeParams, SettingsResource) {

		$scope.editor =  {
			bind: {
				name: 'BIND',
				protocol: 'DNS',
				type: {
					auth: true,
					recursive: true
				},
				options: 'named.conf options {} statements',
				global: 'named.conf global configuration blocks'
			},
			nsd: {
				name: 'NSD',
				protocol: 'DNS',
				type: {
					auth: true,
				},
				options: 'nsd.conf server: statements',
				global: 'nsd.conf global configuration blocks'
			},
			knot: {
				name: 'Knot2',
				protocol: 'DNS',
				type: {
					auth: true,
				},
				global: 'knot.conf global configuration blocks'
			},
			echo: {
				name: 'Echo',
				protocol: 'DNS',
				type: { }
			},
			kea4: {
				name: 'Kea IPv4',
				protocol: 'DHCP'
			},
			kea6: {
				name: 'Kea IPv6',
				protocol: 'DHCP'
			},
			dhcpd: {
				name: 'ISC DHCPd',
				protocol: 'DHCP'
			}
		}[$routeParams.type];

		var querysets = SettingsResource.get({setting: 'querysets'});

		$scope.editor.updateQuerysets = function() {
			$scope.editor.currentQueryset = querysets[$scope.config.mode];
		}

		if ($scope.editor.protocol === 'DNS') {
			$scope.editor.multimode = Object.keys($scope.editor.type).length > 1;
			$scope.editor.tester = 'dnsperf';
		} else if ($scope.editor.protocol === 'DHCP') {
			$scope.editor.tester = 'perfdhcp';
		}
	}
]);

})();
