// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").controller("sidebarController", function($scope, $routeParams, $location, errorServices, toastServices, localStorageService, config) {
	$scope.highlight = function(item) {
		if (item == $location.path()) {
			return true;
		}
		return false;
	}
})