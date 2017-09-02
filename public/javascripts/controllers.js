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
	}])

	.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function($scope, $state, favoriteFactory) {
		$scope.tab = 1;
		$scope.filtText = '';
		$scope.showDetails = false;
		$scope.showDelete = false;
		$scope.showMenu = false;
		$scope.message = "Loading ...";

		favoriteFactory.query(
			function(response) {
				$scope.dishes = response.dishes;
				$scope.showMenu = true;
			},
			function(response) {
				$scope.message = "Error: " + response.status + " " + response.statusText;
			});

		$scope.select = function(setTab) {
			$scope.tab = setTab;

			if (setTab === 2) {
				$scope.filtText = "appetizer";
			} else if (setTab === 3) {
				$scope.filtText = "mains";
			} else if (setTab === 4) {
				$scope.filtText = "dessert";
			} else {
				$scope.filtText = "";
			}
		};

		$scope.isSelected = function(checkTab) {
			return ($scope.tab === checkTab);
		};

		$scope.toggleDetails = function() {
			$scope.showDetails = !$scope.showDetails;
		};

		$scope.toggleDelete = function() {
			$scope.showDelete = !$scope.showDelete;
		};

		$scope.deleteFavorite = function(dishid) {
			console.log('Delete favorites', dishid);
			favoriteFactory.delete({
				id: dishid
			});
			$scope.showDelete = !$scope.showDelete;
			$state.go($state.current, {}, {
				reload: true
			});
		};
	}])

	.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', function($scope, menuFactory, favoriteFactory) {
		$scope.tab = 1;
		$scope.filtText = '';
		$scope.showDetails = false;
		$scope.showFavorites = false;
		$scope.showMenu = false;
		$scope.message = "Loading ...";

		menuFactory.query(
			function(response) {
				$scope.dishes = response;
				$scope.showMenu = true;

			},
			function(response) {
				$scope.message = "Error: " + response.status + " " + response.statusText;
			});

		$scope.select = function(setTab) {
			$scope.tab = setTab;

			if (setTab === 2) {
				$scope.filtText = "appetizer";
			} else if (setTab === 3) {
				$scope.filtText = "main";
			} else if (setTab === 4) {
				$scope.filtText = "dessert";
			} else {
				$scope.filtText = "";
			}
		};

		$scope.isSelected = function(checkTab) {
			return ($scope.tab === checkTab);
		};

		$scope.toggleDetails = function() {
			$scope.showDetails = !$scope.showDetails;
		};

		$scope.toggleFavorites = function() {
			$scope.showFavorites = !$scope.showFavorites;
		};

		$scope.addToFavorites = function(dishid) {
			console.log('Add to favorites', dishid);
			favoriteFactory.save({
				_id: dishid
			});
			$scope.showFavorites = !$scope.showFavorites;
		};
	}]);
