'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listTerms', {
			url: '/terms',
			templateUrl: 'modules/terms/views/list-terms.client.view.html'
		});
	}
]);