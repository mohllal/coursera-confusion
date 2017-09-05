'use strict';

angular.module('confusionApp', ['ui.router', 'ngResource', 'ngDialog'])
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			// route for the home page
			.state('app', {
				url: '/',
				views: {
					'header': {
						templateUrl: 'templates/header.html',
						controller: 'HeaderController'
					},
					'content': {
						templateUrl: 'templates/home.html',
						controller: 'HomeController'
					},
					'footer': {
						templateUrl: 'templates/footer.html'
					}
				}
			})

			// route for the aboutus page
			.state('app.aboutus', {
				url: 'aboutus',
				views: {
					'content@': {
						templateUrl: 'templates/aboutus.html',
						controller: 'AboutController'
					}
				}
			})

			// route for the contactus page
			.state('app.contactus', {
				url: 'contactus',
				views: {
					'content@': {
						templateUrl: 'templates/contactus.html',
						controller: 'ContactController'
					}
				}
			})

			// route for the menu page
			.state('app.menu', {
				url: 'menu',
				views: {
					'content@': {
						templateUrl: 'templates/menu.html',
						controller: 'MenuController'
					}
				}
			})

			// route for the dishdetail page
			.state('app.favorites', {
				url: 'favorites',
				views: {
					'content@': {
						templateUrl: 'templates/favorites.html',
						controller: 'FavoriteController'
					}
				}
			})

			// route for the dishdetail page
			.state('app.dishdetails', {
				url: 'menu/:id',
				views: {
					'content@': {
						templateUrl: 'templates/dishdetail.html',
						controller: 'DishDetailController'
					}
				}
			});

		$urlRouterProvider.otherwise('/');
	});
