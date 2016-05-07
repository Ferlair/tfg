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
      grafoFactory.cargar(jsonCopy);
    }

    $scope.nombreNeurona;

    $scope.inicio();
    //grafoFactory.eliminarSlider();

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

      /*console.log('inicioMosey '+inicioMosey);
      console.log('finalMosey '+finalMosey);
      console.log('inicioGranulle '+inicioGranulle);
      console.log('finalGranulle '+finalGranulle);
      console.log('inicioPurkinje '+inicioPurkinje);
      console.log('finalPurkinje '+finalPurkinje);
      console.log('inicioDCN '+inicioDCN);
      console.log('finalDCN '+finalDCN);
      console.log('inicioGolgi '+inicioGolgi);
      console.log('finalGolgi '+finalGolgi);
      console.log('inicioIO '+inicioIO);
      console.log('finalIO '+finalIO);*/

      //Mostrar/ocultar neuronas de tipo mosey
      if (!mosey.checked) {  //Si la casilla de mosey está desactivada, no mostramos ninguna neurona de este tipo
        for (var i=0; i<grafoFactory.iteracionesMosey; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      //en caso contrario, mostramos sólo aquellas que se encuentren en el intervalo seleccionado por el slider,
      //es decir, entre inicioMosey y finalMosey, ambos inclusive
      else {
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
        for (var i=grafoFactory.iteracionesMosey; i<grafoFactory.iteracionesGranulle; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
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
        for (var i=grafoFactory.iteracionesGranulle; i<grafoFactory.iteracionesPurkinje; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
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
        for (var i=grafoFactory.iteracionesPurkinje; i<grafoFactory.iteracionesDCN; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
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
        for (var i=grafoFactory.iteracionesDCN; i<grafoFactory.iteracionesGolgi; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
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
        for (var i=grafoFactory.iteracionesGolgi; i<grafoFactory.iteracionesIO; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
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

    $scope.sliderPesoMosey = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.sliderPesoGranulle = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.sliderPesoPurkinje = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.sliderPesoDCN = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.sliderPesoGolgi = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.sliderPesoIO = {
        min: grafoFactory.minPeso,
        max: grafoFactory.maxPeso,
        options: {
        floor: grafoFactory.minPeso,
        ceil: grafoFactory.maxPeso,
        noSwitching: true
      }
    };

    $scope.modificarPesoMosey = function() {
      var inicioMosey = $scope.sliderMosey.min;
      var finalMosey = $scope.sliderMosey.max;

      var inicioPeso = $scope.sliderPesoMosey.min;
      var finalPeso = $scope.sliderPesoMosey.max;

      for (var i=inicioMosey; i<finalMosey;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.modificarPesoGranulle = function () {
      var inicioGranulle = $scope.sliderGranulle.min;
      var finalGranulle = $scope.sliderGranulle.max;

      var inicioPeso = $scope.sliderPesoGranulle.min;
      var finalPeso = $scope.sliderPesoGranulle.max;

      for (var i=inicioGranulle; i<finalGranulle;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.modificarPesoPurkinje = function () {
      var inicioPurkinje = $scope.sliderPurkinje.min;
      var finalPurkinje = $scope.sliderPurkinje.max;

      var inicioPeso = $scope.sliderPesoPurkinje.min;
      var finalPeso = $scope.sliderPesoPurkinje.max;

      for (var i=inicioPurkinje; i<finalPurkinje;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.modificarPesoDCN = function () {
      var inicioDCN = $scope.sliderDCN.min;
      var finalDCN = $scope.sliderDCN.max;

      var inicioPeso = $scope.sliderPesoDCN.min;
      var finalPeso = $scope.sliderPesoDCN.max;

      for (var i=inicioDCN; i<finalDCN;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.modificarPesoGolgi = function () {
      var inicioGolgi = $scope.sliderGolgi.min;
      var finalGolgi = $scope.sliderGolgi.max;

      var inicioPeso = $scope.sliderPesoGolgi.min;
      var finalPeso = $scope.sliderPesoGolgi.max;

      for (var i=inicioGolgi; i<finalGolgi;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.modificarPesoIO = function () {
      var inicioIO = $scope.sliderIO.min;
      var finalIO = $scope.sliderIO.max;

      var inicioPeso = $scope.sliderPesoIO.min;
      var finalPeso = $scope.sliderPesoIO.max;

      for (var i=inicioIO; i<finalIO;i++) {
        for (var j=0; j<arrayNeuronal[i].peso.length;j++) {
          var peso = arrayNeuronal[i].peso[j];
          var origen = arrayNeuronal[i].id;
          var destino = arrayNeuronal[i].destino[j];
          var pos = $scope.buscarArista(origen, destino);
          if (peso >=inicioPeso && peso<=finalPeso) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.mostrarPeso = function() {
      document.getElementById('slider').style.display = "none";
      document.getElementById('sliderPeso').style.visibility = "visible";
      document.getElementById('sliderPeso').style.display = "inline";
    }

    $scope.mostrarId = function() {
      document.getElementById('sliderPeso').style.display = "none";
      document.getElementById('slider').style.visibility = "visible";
      document.getElementById('slider').style.display = "inline";
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

    var s;
    return{

      eliminarSlider: function() {
        document.getElementById('sliderPeso').style.display = "none";
      },

      almacenarArrayNeuronal: function(array) {
        arrayNeuronal = array;
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
      s =  new sigma ({
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
            defaultLabelHoverColor: 'false',
            defaultLabelColor: 'false',
            defaultLabelSize: '0'

          }
        })

        //enlazamos el evento de click de ratón sobre un nodo, mostrando el nombre del nodo por consola
        s.bind('clickNode', function(e) {
            console.log(e.data.node.label);
        });
      }
    }
  });
