'use strict';

describe('Controller: Visualizacion2Ctrl', function () {

  // load the controller's module
  beforeEach(module('tfgApp'));

  var Visualizacion2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Visualizacion2Ctrl = $controller('Visualizacion2Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Visualizacion2Ctrl.awesomeThings.length).toBe(3);
  });
});
