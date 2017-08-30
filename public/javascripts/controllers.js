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
	}])

	.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory) {
		$scope.loginData = $localStorage.getObject('userinfo', '{}');

		$scope.doLogin = function() {
			if ($scope.rememberMe)
				$localStorage.storeObject('userinfo', $scope.loginData);

			AuthFactory.login($scope.loginData);
			ngDialog.close();
		};

		$scope.openRegister = function() {
			ngDialog.open({
				template: 'templates/register.html',
				scope: $scope,
				className: 'ngdialog-theme-default',
				controller: "RegisterController"
			});
		};
	}]);
