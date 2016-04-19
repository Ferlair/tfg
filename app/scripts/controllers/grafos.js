'use strict';

/**
 * @ngdoc function
 * @name tfgApp.controller:GrafosCtrl
 * @description
 * # GrafosCtrl
 * Controller of the tfgApp
 */
angular
  .module('tfgApp')

  .controller ('GrafosCtrl', ['$scope','grafoFactory', function($scope, grafoFactory){

    var mosey = document.getElementById('1');
    var granulle = document.getElementById('2');
    var purkinje = document.getElementById('3');
    var dcn = document.getElementById('4');
    var golgi = document.getElementById('5');
    var io = document.getElementById('6');


    var jsonCopy;
    var arrayNeuronal;

    $scope.obtenerReferencias = function() {
      grafoFactory.iteracionesMosey = grafoFactory.numeroMosey;
      grafoFactory.iteracionesGranulle = grafoFactory.numeroGranulle + grafoFactory.iteracionesMosey;
      grafoFactory.iteracionesPurkinje = grafoFactory.numeroPurkinje + grafoFactory.iteracionesGranulle;
      grafoFactory.iteracionesDCN = grafoFactory.numeroDcn + grafoFactory.iteracionesPurkinje;
      grafoFactory.iteracionesGolgi = grafoFactory.numeroGolgi + grafoFactory.iteracionesDCN;
      grafoFactory.iteracionesIO = grafoFactory.numeroIo + grafoFactory.iteracionesGolgi;

      grafoFactory.iniMosey = 0;
      grafoFactory.iniGranulle = grafoFactory.iteracionesMosey;
      grafoFactory.iniPurkinje = grafoFactory.iteracionesGranulle;
      grafoFactory.iniDCN = grafoFactory.iteracionesPurkinje;
      grafoFactory.iniGolgi = grafoFactory.iteracionesDCN;
      grafoFactory.iniIO = grafoFactory.iteracionesGolgi;

      grafoFactory.minPeso = 0;
      grafoFactory.maxPeso = 10;
    }

    //Función que devuelve la posición de una determinada arista dentro
    //del json del grafo
    $scope.buscarArista = function (origen, destino){
      var nombreABuscar = 'en'+origen+'+'+'n'+destino;
      var pos;
      for (var i=0; i<jsonCopy.edges.length; i++) {
        var id= jsonCopy.edges[i].id;
        if (id == nombreABuscar)
            pos = i;
      }
      return pos;
    }



    $scope.inicio = function() {
      refresh();
      jsonCopy = grafoFactory.recuperarJSON();
      arrayNeuronal = grafoFactory.recuperarArrayNeuronal();
      $scope.obtenerReferencias();
      //console.log(jsonCopy);
      console.log('array: '+arrayNeuronal[0].id);
      $scope.buscarArista(1536,1772);
      grafoFactory.cargar(jsonCopy);
    }

    $scope.inicio();

    //Función que reinicia el elemento 'container'
    //se limpia la pizarra antes de mostrar un nuevo grafo para evitar repetición
    function refresh() {
      var g = document.querySelector('#container2');
      var p = g.parentNode;
      p.removeChild(g);
      var c = document.createElement('div');
      c.setAttribute('id','container2');
      c.setAttribute('ng-controller','GrafosCtrl');
      c.setAttribute('height','500 px');
      p.appendChild(c);
    }

    //Función que muestra las neuronas seleccionadas por pantalla
    $scope.ver = function() {
      var inicioMosey = $scope.sliderMosey.min;
      var finalMosey = $scope.sliderMosey.max;

      var inicioGranulle = $scope.sliderGranulle.min;
      var finalGranulle = $scope.sliderGranulle.max;

      var inicioPurkinje = $scope.sliderPurkinje.min;
      var finalPurkinje = $scope.sliderPurkinje.max;

      var inicioDCN = $scope.sliderDCN.min;
      var finalDCN = $scope.sliderDCN.max;

      var inicioGolgi = $scope.sliderGolgi.min;
      var finalGolgi = $scope.sliderGolgi.max;

      var inicioIO = $scope.sliderIO.min;
      var finalIO = $scope.sliderIO.max;

      //Mostrar/ocultar neuronas de tipo mosey
      if (!mosey.checked) {  //Si la casilla de mosey está desactivada, no mostramos ninguna neurona de este tipo
        console.log ('mosey está deseleccionado');
        for (var i=0; i<grafoFactory.iteracionesMosey; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      //en caso contrario, mostramos sólo aquellas que se encuentren en el intervalo seleccionado por el slider,
      //es decir, entre inicioMosey y finalMosey, ambos inclusive
      else {
         console.log ('mosey está seleccionado');
          for (var j=0; j<grafoFactory.iteracionesMosey; j++) {
            if (j >= inicioMosey && j <= finalMosey) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      //Mostrar/ocultar neuronas de tipo granulle
      if (!granulle.checked) {
        console.log ('granulle está deseleccionado');
        for (var i=grafoFactory.iteracionesMosey; i<grafoFactory.iteracionesGranulle; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        console.log ('granulle está seleccionado');
          for (var j=grafoFactory.iteracionesMosey; j<grafoFactory.iteracionesGranulle; j++) {
            if (j >= inicioGranulle && j <= finalGranulle) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      //Mostrar/ocultar neuronas de tipo purkinje
      if (!purkinje.checked) {
        console.log ('purkinje está deseleccionado');
        for (var i=grafoFactory.iteracionesGranulle; i<grafoFactory.iteracionesPurkinje; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        console.log ('purkinje está seleccionado');
          for (var j=grafoFactory.iteracionesGranulle; j<grafoFactory.iteracionesPurkinje; j++) {
            if (j >= inicioPurkinje && j <= finalPurkinje) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      //Mostrar/ocultar neuronas de tipo dcn
      if (!dcn.checked) {
        console.log ('dcn está deseleccionado');
        for (var i=grafoFactory.iteracionesPurkinje; i<grafoFactory.iteracionesDCN; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        console.log ('dcn está seleccionado');
          for (var j=grafoFactory.iteracionesPurkinje; j<grafoFactory.iteracionesDCN; j++) {
            if (j >= inicioDCN && j <= finalDCN) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      //Mostrar/ocultar neuronas de tipo golgi
      if (!golgi.checked) {
        console.log ('golgi está deseleccionado');
        for (var i=grafoFactory.iteracionesDCN; i<grafoFactory.iteracionesGolgi; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        console.log ('golgi está seleccionado');
          for (var j=grafoFactory.iteracionesDCN; j<grafoFactory.iteracionesGolgi; j++) {
            if (j >= inicioGolgi && j <= finalGolgi) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      //Mostrar/ocultar neuronas de tipo io
      if (!io.checked) {
        console.log ('io está deseleccionado');
        for (var i=grafoFactory.iteracionesGolgi; i<grafoFactory.iteracionesIO; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        console.log ('io está seleccionado');
          for (var j=grafoFactory.iteracionesGolgi; j<grafoFactory.iteracionesIO; j++) {
            if (j >= inicioIO && j <= finalIO) {
              jsonCopy.nodes[j].hidden = false;
            }
            else {
              jsonCopy.nodes[j].hidden = true;
            }
          }
      }

      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Controladores para los diferentes sliders
    $scope.sliderMosey = {
        min: grafoFactory.iniMosey,
        max: grafoFactory.iteracionesMosey,
        options: {
          floor: grafoFactory.iniMosey,
          ceil: grafoFactory.iteracionesMosey,
          noSwitching: true
        }
    };

    $scope.sliderGranulle = {
        min: grafoFactory.iniGranulle,
        max: grafoFactory.iteracionesGranulle,
        options: {
        floor: grafoFactory.iniGranulle,
        ceil: grafoFactory.iteracionesGranulle,
        noSwitching: true
      }
    };

    $scope.sliderPurkinje = {
        min: grafoFactory.iniPurkinje,
        max: grafoFactory.iteracionesPurkinje,
        options: {
        floor: grafoFactory.iniPurkinje,
        ceil: grafoFactory.iteracionesPurkinje,
        noSwitching: true
      }
    };

    $scope.sliderDCN = {
        min: grafoFactory.iniDCN,
        max: grafoFactory.iteracionesDCN,
        options: {
        floor: grafoFactory.iniDCN,
        ceil: grafoFactory.iteracionesDCN,
        noSwitching: true
      }
    };

    $scope.sliderGolgi = {
        min: grafoFactory.iniGolgi,
        max: grafoFactory.iteracionesGolgi,
        options: {
        floor: grafoFactory.iniGolgi,
        ceil: grafoFactory.iteracionesGolgi,
        noSwitching: true
      }
    };

    $scope.sliderIO = {
        min: grafoFactory.iniIO,
        max: grafoFactory.iteracionesIO,
        options: {
        floor: grafoFactory.iniIO,
        ceil: grafoFactory.iteracionesIO,
        noSwitching: true
      }
    };

    $scope.sliderPeso = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.verPeso = function() {
      console.log('estamos en verpeso');
      var inicioMosey = $scope.sliderMosey.min;
      var finalMosey = $scope.sliderMosey.max;

      var inicioPeso = $scope.sliderPeso.min;
      var finalPeso = $scope.sliderPeso.max;

      console.log('inicioMosey: '+inicioMosey);
      console.log ('finalMosey: '+finalMosey);
      console.log('inicioPeso: '+inicioPeso);
      console.log('finalPeso: '+finalPeso);

      console.log('array '+grafoFactory.arrayNeuronal[0]);

      for (var i=0; i<finalMosey;i++) {
        for (var j=0; j<arrayNeuronal[i].peso[j].length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var pos = buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalpeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
    }


  }])

  .factory('grafoFactory', function grafoFactory(){
    var jsonRecibido;

    var numeroMosey;
    var numeroGranulle = 0;
    var numeroPurkinje = 0;
    var numeroDcn = 0;
    var numeroGolgi = 0;
    var numeroIo = 0;
    var numeroTotalNeuronas = 0;

    var iteracionesMosey;
    var iteracionesGranulle;
    var iteracionesPurkinje;
    var iteracionesDCN;
    var iteracionesGolgi;
    var iteracionesIO;

    var iniMosey;
    var iniGranulle;
    var iniPurkinje;
    var iniDCN;
    var iniGolgi;
    var iniIO;

    var minPeso;
    var maxPeso;
    var pesoGlobal = [];

    var arrayNeuronal = new Array();
    return{

      almacenarArrayNeuronal: function(array) {
        arrayNeuronal = array;
        console.log('array almacenado');
      },

      recuperarArrayNeuronal: function() {
        return arrayNeuronal;
      },

      recuperarJSON: function() {
        return jsonRecibido;
      },

      almacenarJSON: function(js){
        jsonRecibido = js;
      },

      //Muestra un grafo por defecto
      crearGrafo: function(){
        sigma.parsers.json('data.json', {
          renderer: {
            type:'webgl',
            container: document.getElementById('container2')
          },
          settings: {
            defaultNodeColor: '#ef9c04'
          }
        });
      },

      //Muestra el grafo seleccionado por el usuario
      cargar: function(grafo) {
        new sigma ({
          graph: grafo,
          renderer: {
            type: 'webgl',
            container: document.getElementById('container2')
          },
          settings: {
            drawLabels: 'false',
            enableHovering: 'false',
            defaultNodeColor: "#ffffff",
            nodeHoverColor: "#0000ff",
            defaultNodeHoverColor: "#0000ff",
            //defaultEdgeColor: "#00ff00",
            //edgeColor: "#00ff00",
            defaultLabelHoverColor: "#0010ff",
            defaultLabelColor: '#0010ff'

          }
        })
      }
    }
  });
