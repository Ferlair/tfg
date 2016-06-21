
'use strict';

/**
 * @ngdoc overview
 * @name tfgApp
 * @description
 * # tfgApp
 *
 * Main module of the application.
 */
angular
  .module('tfgApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'rzModule'
  ])

  .directive('onReadFile', function ($parse) {
  	return {
  		restrict: 'A',
  		scope: false,
  		link: function(scope, element, attrs) {
              var fn = $parse(attrs.onReadFile);

  			element.on('change', function(onChangeEvent) {
  				var reader = new FileReader();

  				reader.onload = function(onLoadEvent) {
  					scope.$apply(function() {
  						fn(scope, {$fileContent:onLoadEvent.target.result});
  					});
  				};

  				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
  			});
  		}
  	};
  })

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/circular', {
        templateUrl: 'views/circular.html',
        controller: 'circularCtrl'
      })
      .when('/horizontal', {
        templateUrl: 'views/horizontal.html',
        controller: 'horizontalCtrl',
        controllerAs: 'horizontal'
      })
  });
