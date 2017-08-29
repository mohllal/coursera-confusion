'use strict';

angular.module('confusionApp')
	.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory) {
		$scope.register = {};
		$scope.loginData = {};

		$scope.doRegister = function() {
			console.log('Doing registration', $scope.registration);

			AuthFactory.register($scope.registration);
			ngDialog.close();
		};
	}]);
