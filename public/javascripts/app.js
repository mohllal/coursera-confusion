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
			});

		$urlRouterProvider.otherwise('/');
	});
