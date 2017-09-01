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
	}])

	.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function($scope, $state, $rootScope, ngDialog, AuthFactory) {
		$scope.loggedIn = false;
		$scope.username = '';

		if (AuthFactory.isAuthenticated()) {
			$scope.loggedIn = true;
			$scope.username = AuthFactory.getUsername();
		}

		$scope.openLogin = function() {
			ngDialog.open({
				template: 'templates/login.html',
				scope: $scope,
				className: 'ngdialog-theme-default',
				controller: "LoginController"
			});
		};

		$scope.logOut = function() {
			AuthFactory.logout();
			$scope.loggedIn = false;
			$scope.username = '';
		};

		$rootScope.$on('login:Successful', function() {
			$scope.loggedIn = AuthFactory.isAuthenticated();
			$scope.username = AuthFactory.getUsername();
		});

		$rootScope.$on('registration:Successful', function() {
			$scope.loggedIn = AuthFactory.isAuthenticated();
			$scope.username = AuthFactory.getUsername();
		});

		$scope.stateis = function(curstate) {
			return $state.is(curstate);
		};

	}])

	.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
		$scope.leaders = corporateFactory.query();
	}])

	.controller('ContactController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
		$scope.feedback = {
			mychannel: "",
			firstName: "",
			lastName: "",
			agree: false,
			email: ""
		};

		var channels = [
			{
				value: "tel",
				label: "Tel."
			},
			{
				value: "Email",
				label: "Email"
			}
		];

		$scope.channels = channels;
		$scope.invalidChannelSelection = false;

		$scope.sendFeedback = function() {
			if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
				$scope.invalidChannelSelection = true;
			} else {
				$scope.invalidChannelSelection = false;
				feedbackFactory.save($scope.feedback);
				$scope.feedback = {
					mychannel: "",
					firstName: "",
					lastName: "",
					agree: false,
					email: ""
				};
				$scope.feedback.mychannel = "";
				$scope.feedbackForm.$setPristine();
			}
		};
	}]);
