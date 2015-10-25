// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('Inspens', [
  'ngRoute',
  'mobile-angular-ui',
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
	$routeProvider.when('/',              {templateUrl: 'room/home.html', reloadOnSearch: false});
	var roomnames = ['add_expense', 'add_income'];
	roomnames.forEach(function (roomname) {
		$routeProvider.when('/'+roomname,   {templateUrl: 'room/'+roomname+'.html', reloadOnSearch: false});
	});
	
});

app.controller('MainController', function($rootScope, $scope, $location){

	// Needed for the loading screen
	$rootScope.$on('$routeChangeStart', function(){
		$rootScope.loading = true;
	});
	$rootScope.$on('$routeChangeSuccess', function(){
		$rootScope.loading = false;
	});
	$scope.namaku = 'makin';
	$scope.go = function ( path ) {
		$location.url( path );
	};
	
	$scope.base_account_page = 0;
	$scope.change_base_account = function(page) {
		$scope.base_account_page = page;
	}
	$scope.change_base_account_prev = function() {
		if ($scope.base_account_page>0)
			$scope.base_account_page -= 1;
	}
	$scope.change_base_account_next = function() {
		if (true)
			$scope.base_account_page += 1;
	}
});


