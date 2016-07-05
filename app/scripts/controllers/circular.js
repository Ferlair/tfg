'use strict';

/**
 * @ngdoc function
 * @name tfgApp.controller:circularCtrl
 * @description
 * # circularCtrl
 * Controller of the tfgApp
 */
angular
  .module('tfgApp')

  .controller ('circularCtrl', ['$scope','grafoFactory', function($scope, grafoFactory){

    var mosey = document.getElementById('1');
    var granulle = document.getElementById('2');
    var purkinje = document.getElementById('3');
    var dcn = document.getElementById('4');
    var golgi = document.getElementById('5');
    var io = document.getElementById('6');


    var jsonCopy;
    var arrayNeuronal;
    var arrayAux = new Array();

    //arrays auxiliares para cada uno de los tipos de neuronas
    var arrayMosey;
    var arrayGranulle;
    var arrayPurkinje;
    var arrayDCN;
    var arrayGolgi;
    var arrayIO;


    $scope.dn = grafoFactory.d;




    $scope.obtenerReferencias = function() {

      grafoFactory.iteracionesMosey = grafoFactory.numeroMosey;
      grafoFactory.iteracionesGranulle = grafoFactory.numeroGranulle + grafoFactory.iteracionesMosey;
      grafoFactory.iteracionesPurkinje = grafoFactory.numeroPurkinje + grafoFactory.iteracionesGranulle;
      grafoFactory.iteracionesDCN = grafoFactory.numeroDcn + grafoFactory.iteracionesPurkinje;
      grafoFactory.iteracionesGolgi = grafoFactory.numeroGolgi + grafoFactory.iteracionesDCN;
      grafoFactory.iteracionesIO = grafoFactory.numeroIo + grafoFactory.iteracionesGolgi;

      grafoFactory.iniMosey = Math.min.apply(null,arrayMosey);
      grafoFactory.iniGranulle = Math.min.apply(null,arrayGranulle);
      grafoFactory.iniPurkinje = Math.min.apply(null,arrayPurkinje);
      grafoFactory.iniDCN = Math.min.apply(null,arrayDCN);
      grafoFactory.iniGolgi = Math.min.apply(null,arrayGolgi);
      grafoFactory.iniIO = Math.min.apply(null,arrayIO);

      grafoFactory.finMosey = Math.max.apply(null,arrayMosey);
      grafoFactory.finGranulle = Math.max.apply(null,arrayGranulle);
      grafoFactory.finPurkinje = Math.max.apply(null,arrayPurkinje);
      grafoFactory.finDCN = Math.max.apply(null,arrayDCN);
      grafoFactory.finGolgi = Math.max.apply(null,arrayGolgi);
      grafoFactory.finIO = Math.max.apply(null,arrayIO);


      grafoFactory.minPeso = 0;
      grafoFactory.maxPeso = 10;
    }

    $scope.sombrearMosey = function() {
      for (var i=0;i<arrayMosey.length;i++) {
        jsonCopy.nodes[arrayMosey[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquearMosey = function() {
      for (var i=0;i<arrayMosey.length;i++) {
        jsonCopy.nodes[arrayMosey[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.sombrearGranulle = function() {
      for (var i=0;i<arrayGranulle.length;i++) {
        jsonCopy.nodes[arrayGranulle[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquearGranulle = function() {
      for (var i=0;i<arrayGranulle.length;i++) {
        jsonCopy.nodes[arrayGranulle[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.sombrearPurkinje = function() {
      for (var i=0;i<arrayPurkinje.length;i++) {
        jsonCopy.nodes[arrayPurkinje[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquarPurkinje = function() {
      for (var i=0;i<arrayPurkinje.length;i++) {
        jsonCopy.nodes[arrayPurkinje[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.sombrearDCN = function() {
      for (var i=0;i<arrayDCN.length;i++) {
        jsonCopy.nodes[arrayDCN[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquearDCN = function() {
      for (var i=0;i<arrayPurkinje.length;i++) {
        jsonCopy.nodes[arrayPurkinje[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.sombrearGolgi = function() {
      for (var i=0;i<arrayGolgi.length;i++) {
        jsonCopy.nodes[arrayGolgi[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquearGolgi = function() {
      for (var i=0;i<arrayGolgi.length;i++) {
        jsonCopy.nodes[arrayGolgi[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.sombrearIO = function() {
      for (var i=0;i<arrayIO.length;i++) {
        jsonCopy.nodes[arrayIO[i]].color = "#ff0000";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.blanquearIO = function() {
      for (var i=0;i<arrayIO.length;i++) {
        jsonCopy.nodes[arrayIO[i]].color = "#ffffff";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
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
      arrayMosey = grafoFactory.recuperarArrayMosey();
      arrayGranulle = grafoFactory.recuperarArrayGranulle();
      arrayPurkinje = grafoFactory.recuperarArrayPurkinje();
      arrayDCN = grafoFactory.recuperarArrayDCN();
      arrayGolgi = grafoFactory.recuperarArrayGolgi();
      arrayIO = grafoFactory.recuperarArrayIO();
      $scope.obtenerReferencias();
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
      c.setAttribute('ng-controller','circularCtrl');
      c.setAttribute('height','500 px');
      p.appendChild(c);
    }

    //Mostrar/ocultar neuronas de tipo mosey
    $scope.chequearMosey = function() {
      var inicioMosey = $scope.sliderMosey.min;
      var finalMosey = $scope.sliderMosey.max;


      if (!mosey.checked) {  //Si la casilla de mosey está desactivada, no mostramos ninguna neurona de este tipo
        for (var i=0; i<arrayMosey.length; i++) {
          jsonCopy.nodes[arrayMosey[i]].hidden = true;
        }

        //Deshabilitamos los slider de filtrado por id y peso para mosey
        document.getElementById('idmosey').style.pointerEvents = "none";
        document.getElementById('sliderPesoMosey').style.pointerEvents = "none";
      }
      //en caso contrario, mostramos sólo aquellas que se encuentren en el intervalo seleccionado por el slider,
      //es decir, entre inicioMosey y finalMosey, ambos inclusive
      else {
          for (var j=0; j<arrayMosey.length; j++) {
              if (arrayMosey[j] >= inicioMosey && arrayMosey[j] <= finalMosey) {
                jsonCopy.nodes[arrayMosey[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayMosey[j]].hidden = true;
              }
          }

          //Habilitamos los slider de filtrado por id y peso para mosey
          document.getElementById('idmosey').style.pointerEvents = "auto";
          document.getElementById('sliderPesoMosey').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Mostrar/ocultar neuronas de tipo granulle
    $scope.chequearGranulle = function() {
      var inicioGranulle = $scope.sliderGranulle.min;
      var finalGranulle = $scope.sliderGranulle.max;


      if (!granulle.checked) {
        for (var i=0; i<arrayGranulle.length; i++) {
          jsonCopy.nodes[arrayGranulle[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para granulle
        document.getElementById("idgranulle").style.pointerEvents = "none";
        document.getElementById("sliderPesoGranulle").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayGranulle.length; j++) {
              if (arrayGranulle[j] >= inicioGranulle && arrayGranulle[j] <= finalGranulle) {
                jsonCopy.nodes[arrayGranulle[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayGranulle[j]].hidden = true;
              }


          }

          //Habilitamos los slider de filtrado por id y peso para granulle
          document.getElementById('idgranulle').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGranulle').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Mostrar/ocultar neuronas de tipo purkinje
    $scope.chequearPurkinje = function() {
      var inicioPurkinje = $scope.sliderPurkinje.min;
      var finalPurkinje = $scope.sliderPurkinje.max;


      if (!purkinje.checked) {
        for (var i=0; i<arrayPurkinje.length; i++) {
          jsonCopy.nodes[arrayPurkinje[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para purkinje
        document.getElementById("idpurkinje").style.pointerEvents = "none";
        document.getElementById("sliderPesoPurkinje").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayPurkinje.length; j++) {
              if (arrayPurkinje[j] >= inicioPurkinje && arrayPurkinje[j] <= finalPurkinje) {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = true;
              }


          }

          //Habilitamos los slider de filtrado por id y peso para purkinje
          document.getElementById('idpurkinje').style.pointerEvents = "auto";
          document.getElementById('sliderPesoPurkinje').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Mostrar/ocultar neuronas de tipo dcn
    $scope.chequearDCN = function() {
      var inicioDCN = $scope.sliderDCN.min;
      var finalDCN = $scope.sliderDCN.max;


      if (!dcn.checked) {
        for (var i=0; i<arrayDCN.length; i++) {
          jsonCopy.nodes[arrayDCN[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para dcn
        document.getElementById("iddcn").style.pointerEvents = "none";
        document.getElementById("sliderPesoDCN").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayDCN.length; j++) {

              if (arrayDCN[j] >= inicioDCN && arrayDCN[j] <= finalDCN) {
                jsonCopy.nodes[arrayDCN[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayDCN[j]].hidden = true;
              }


          }

          //Habilitamos los slider de filtrado por id y peso para dcn
          document.getElementById('iddcn').style.pointerEvents = "auto";
          document.getElementById('sliderPesoDCN').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Mostrar/ocultar neuronas de tipo golgi
    $scope.chequearGolgi = function() {
      var inicioGolgi = $scope.sliderGolgi.min;
      var finalGolgi = $scope.sliderGolgi.max;


      if (!golgi.checked) {
        for (var i=0; i<arrayGolgi.length; i++) {
          jsonCopy.nodes[arrayGolgi[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para golgi
        document.getElementById("idgolgi").style.pointerEvents = "none";
        document.getElementById("sliderPesoGolgi").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayGolgi.length; j++) {
              if (arrayGolgi[j] >= inicioGolgi && arrayGolgi[j] <= finalGolgi) {
                jsonCopy.nodes[arrayGolgi[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayGolgi[j]].hidden = true;
              }


          }

          //Habilitamos los slider de filtrado por id y peso para golgi
          document.getElementById('idgolgi').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGolgi').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Mostrar/ocultar neuronas de tipo io
    $scope.chequearIO = function() {
      var inicioIO = $scope.sliderIO.min;
      var finalIO = $scope.sliderIO.max;


      if (!io.checked) {
        for (var i=0; i<arrayIO.length; i++) {
          jsonCopy.nodes[arrayIO[i]].hidden = true;
        }

        //Deshabilitamos los slider de filtrado por id y peso para IO
        document.getElementById("idio").style.pointerEvents = "none";
        document.getElementById("sliderPesoIO").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayIO.length; j++) {
              if (arrayIO[j] >= inicioIO && arrayIO[j] <= finalIO) {
                jsonCopy.nodes[arrayIO[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayIO[j]].hidden = true;
              }
          }

          //Habilitamos los slider de filtrado por id y peso para IO
          document.getElementById('idio').style.pointerEvents = "auto";
          document.getElementById('sliderPesoIO').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.restaurar = function() {
      document.getElementById('inputNeuronas').value="";
      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[i].hidden = false;
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    //Función que muestra las neuronas seleccionadas por pantalla
    /*$scope.ver = function() {
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
        for (var i=0; i<arrayMosey.length; i++) {
          jsonCopy.nodes[arrayMosey[i]].hidden = true;
        }

        //Deshabilitamos los slider de filtrado por id y peso para mosey
        document.getElementById('idmosey').style.pointerEvents = "none";
        document.getElementById('sliderPesoMosey').style.pointerEvents = "none";
      }
      //en caso contrario, mostramos sólo aquellas que se encuentren en el intervalo seleccionado por el slider,
      //es decir, entre inicioMosey y finalMosey, ambos inclusive
      else {
          for (var j=0; j<arrayMosey.length; j++) {
            if (jsonCopy.nodes[arrayMosey[j]].hidden == false) {
              if (arrayMosey[j] >= inicioMosey && arrayMosey[j] <= finalMosey) {
                jsonCopy.nodes[arrayMosey[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayMosey[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para mosey
          document.getElementById('idmosey').style.pointerEvents = "auto";
          document.getElementById('sliderPesoMosey').style.pointerEvents = "auto";
      }

      //Mostrar/ocultar neuronas de tipo granulle
      if (!granulle.checked) {
        for (var i=0; i<arrayGranulle.length; i++) {
          jsonCopy.nodes[arrayGranulle[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para granulle
        document.getElementById("idgranulle").style.pointerEvents = "none";
        document.getElementById("sliderPesoGranulle").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayGranulle.length; j++) {
            if (jsonCopy.nodes[arrayGranulle[j]].hidden == false) {
              if (arrayGranulle[j] >= inicioGranulle && arrayGranulle[j] <= finalGranulle) {
                jsonCopy.nodes[arrayGranulle[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayGranulle[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para granulle
          document.getElementById('idgranulle').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGranulle').style.pointerEvents = "auto";
      }

      //Mostrar/ocultar neuronas de tipo purkinje
      if (!purkinje.checked) {
        for (var i=0; i<arrayPurkinje.length; i++) {
          jsonCopy.nodes[arrayPurkinje[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para purkinje
        document.getElementById("idpurkinje").style.pointerEvents = "none";
        document.getElementById("sliderPesoPurkinje").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayPurkinje.length; j++) {
            if (jsonCopy.nodes[arrayPurkinje[j]].hidden == false) {
              if (arrayPurkinje[j] >= inicioPurkinje && arrayPurkinje[j] <= finalPurkinje) {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para purkinje
          document.getElementById('idpurkinje').style.pointerEvents = "auto";
          document.getElementById('sliderPesoPurkinje').style.pointerEvents = "auto";
      }

      //Mostrar/ocultar neuronas de tipo dcn
      if (!dcn.checked) {
        for (var i=0; i<arrayDCN.length; i++) {
          jsonCopy.nodes[arrayDCN[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para dcn
        document.getElementById("iddcn").style.pointerEvents = "none";
        document.getElementById("sliderPesoDCN").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayDCN.length; j++) {
            if (jsonCopy.nodes[arrayDCN[j]].hidden == false) {
              if (arrayDCN[j] >= inicioDCN && arrayDCN[j] <= finalDCN) {
                jsonCopy.nodes[arrayDCN[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayDCN[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para dcn
          document.getElementById('iddcn').style.pointerEvents = "auto";
          document.getElementById('sliderPesoDCN').style.pointerEvents = "auto";
      }

      //Mostrar/ocultar neuronas de tipo golgi
      if (!golgi.checked) {
        for (var i=0; i<arrayGolgi.length; i++) {
          jsonCopy.nodes[arrayGolgi[i]].hidden = true;
        }
        //Deshabilitamos los slider de filtrado por id y peso para golgi
        document.getElementById("idgolgi").style.pointerEvents = "none";
        document.getElementById("sliderPesoGolgi").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayGolgi.length; j++) {
            if (jsonCopy.nodes[arrayGolgi[j]].hidden == false) {
              if (arrayGolgi[j] >= inicioGolgi && arrayGolgi[j] <= finalGolgi) {
                jsonCopy.nodes[arrayGolgi[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayGolgi[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para golgi
          document.getElementById('idgolgi').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGolgi').style.pointerEvents = "auto";
      }

      //Mostrar/ocultar neuronas de tipo io
      if (!io.checked) {
        for (var i=0; i<arrayIO.length; i++) {
          jsonCopy.nodes[arrayIO[i]].hidden = true;
        }

        //Deshabilitamos los slider de filtrado por id y peso para IO
        document.getElementById("idio").style.pointerEvents = "none";
        document.getElementById("sliderPesoIO").style.pointerEvents = "none";
      }
      else {
          for (var j=0; j<arrayIO.length; j++) {
            if (jsonCopy.nodes[arrayIO[j]].hidden == false) {
              if (arrayIO[j] >= inicioIO && arrayIO[j] <= finalIO) {
                jsonCopy.nodes[arrayIO[j]].hidden = false;
              }
              else {
                jsonCopy.nodes[arrayIO[j]].hidden = true;
              }
            }

          }

          //Habilitamos los slider de filtrado por id y peso para IO
          document.getElementById('idio').style.pointerEvents = "auto";
          document.getElementById('sliderPesoIO').style.pointerEvents = "auto";
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }*/

    //Controladores para los diferentes sliders
    $scope.sliderMosey = {
        min: grafoFactory.iniMosey,
        max: grafoFactory.finMosey,
        options: {
          floor: grafoFactory.iniMosey,
          ceil: grafoFactory.finMosey,
          noSwitching: true
        }
    };

    $scope.sliderGranulle = {
        min: grafoFactory.iniGranulle,
        max: grafoFactory.finGranulle,
        options: {
        floor: grafoFactory.iniGranulle,
        ceil: grafoFactory.finGranulle,
        noSwitching: true
      }
    };

    $scope.sliderPurkinje = {
        min: grafoFactory.iniPurkinje,
        max: grafoFactory.finPurkinje,
        options: {
        floor: grafoFactory.iniPurkinje,
        ceil: grafoFactory.finPurkinje,
        noSwitching: true
      }
    };

    $scope.sliderDCN = {
        min: grafoFactory.iniDCN,
        max: grafoFactory.finDCN,
        options: {
        floor: grafoFactory.iniDCN,
        ceil: grafoFactory.finDCN,
        noSwitching: true
      }
    };

    $scope.sliderGolgi = {
        min: grafoFactory.iniGolgi,
        max: grafoFactory.finGolgi,
        options: {
        floor: grafoFactory.iniGolgi,
        ceil: grafoFactory.finGolgi,
        noSwitching: true
      }
    };

    $scope.sliderIO = {
        min: grafoFactory.iniIO,
        max: grafoFactory.finIO,
        options: {
        floor: grafoFactory.iniIO,
        ceil: grafoFactory.finIO,
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

      for (var i=0; i<arrayMosey.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayMosey[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayMosey[i]].peso[j];
          var origen = arrayNeuronal[arrayMosey[i]].id;
          var destino = arrayNeuronal[arrayMosey[i]].destino[j];
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

      for (var i=0; i<arrayGranulle.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGranulle[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayGranulle[i]].peso[j];
          var origen = arrayNeuronal[arrayGranulle[i]].id;
          var destino = arrayNeuronal[arrayGranulle[i]].destino[j];
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

      for (var i=0; i<arrayPurkinje.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayPurkinje[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayPurkinje[i]].peso[j];
          var origen = arrayNeuronal[arrayPurkinje[i]].id;
          var destino = arrayNeuronal[arrayPurkinje[i]].destino[j];
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

      for (var i=0; i<arrayDCN.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayDCN[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayDCN[i]].peso[j];
          var origen = arrayNeuronal[arrayDCN[i]].id;
          var destino = arrayNeuronal[arrayDCN[i]].destino[j];
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

      for (var i=0; i<arrayGolgi.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGolgi[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayGolgi[i]].peso[j];
          var origen = arrayNeuronal[arrayGolgi[i]].id;
          var destino = arrayNeuronal[arrayGolgi[i]].destino[j];
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

      for (var i=0; i<arrayIO.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayIO[i]].peso.length;j++) {
          var peso = arrayNeuronal[arrayIO[i]].peso[j];
          var origen = arrayNeuronal[arrayIO[i]].id;
          var destino = arrayNeuronal[arrayIO[i]].destino[j];
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
      document.getElementById('seleccionManual').style.display = "none";
      document.getElementById('sliderPeso').style.visibility = "visible";
      document.getElementById('sliderPeso').style.display = "inline";
      document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      $scope.restaurar();
    }

    $scope.mostrarId = function() {
      document.getElementById('sliderPeso').style.display = "none";
      document.getElementById('seleccionManual').style.display = "none";
      document.getElementById('slider').style.visibility = "visible";
      document.getElementById('slider').style.display = "inline";
      document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      $scope.restaurar();
    }

    $scope.mostrarSeleccionManual = function() {
      document.getElementById('sliderPeso').style.display = "none";
      document.getElementById('slider').style.display = "none";
      document.getElementById('seleccionManual').style.visibility = "visible";
      document.getElementById('seleccionManual').style.display = "inline";
      document.getElementById('seleccion_neuronas').style.pointerEvents = "none";
      document.getElmentById('inputNeuronas').value="";
    }

    $scope.getDestinos = function(neurona) {
      var resultado;
      var iteraciones = arrayNeuronal[neurona].destino.length;

      for (var i=0; i<iteraciones;i++) {
        var aux = arrayNeuronal[neurona].destino[i];
        aux = aux.toString();
        console.log('aux en posicion '+i+': '+aux);

        if (i==0) {
          resultado = aux;
        }
        else {
          resultado = resultado + ',' + aux;
        }
      }

      console.log('resultado'+resultado);
      return resultado;
    }

    $scope.filtradoManual = function(stringSeleccion) {
      console.log(arrayNeuronal);
      var filtradoOrigen = stringSeleccion.split(',');

      var arrayDatos = new Array();

      for (var i=0; i<filtradoOrigen.length;i++) {
        var neuronaOrigen = filtradoOrigen[i];
        arrayDatos.push($scope.getDestinos(neuronaOrigen));
      }

      console.log(arrayDatos);
      console.log('desglose: ');



      for (var i=0; i<arrayDatos.length;i++) {
          var auxN = arrayDatos[i];
          auxN = auxN.split(',');
          for (var j=0; j<auxN.length;j++) {
            var auxJ = auxN[j];
            arrayAux.push(auxJ);
          }

      }
      console.log('array final: ');
      console.log(arrayAux);

      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[i].hidden = true;
      }

      for (var i=0; i<arrayAux.length;i++) {
        var aux = parseInt(arrayAux[i]);
        console.log('aux dentro brucle:'+aux);
        jsonCopy.nodes[aux].hidden=false;
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.visualizar = function(){

      var valor = document.getElementById("inputNeuronas").value;
      console.log('probamos:' + valor);

      var admitido = true;

      if (valor=="") {
        admitido = false;
        console.log('es nulo');
      }

      else {
        console.log('no es nulo');
        //Comprobación carácter por carácter de que sea un entero o una coma, e invalidarlo mediante
        //admitido = false, en caso contrario, lo que evitará que se ejecute ninguna acción
        for (var i=0; i<valor.length;i++) {
          var aux = valor.charAt(i);
          var t = !isNaN(String(aux) * 1);
            console.log(aux+' '+t);
            if (!t) {
              if (aux != ',')
               admitido = false;
            }
        }
      }

      if (!admitido) {
        console.log('spanish aqui'+grafoFactory.spanish);
        console.log('english aqui'+grafoFactory.english);
        if (grafoFactory.spanish) {
          alert ('Error: \n- Sólo se admiten números enteros separados por comas sin espacios \n- Alguna de las neuronas seleccionadas pueden estar fuera de rango \n- No se permite hacer una búsqueda en blanco');
        }

        if (grafoFactory.english) {
          alert ('Error: \n- Only integers separated by commas without spaces are valid \n- Some of the selected neurons may be out of range \n- Blank search not allowed');
        }
      }
      else { //Si el string con las neuronas pedidas por el usuario es sintácticamente correcto, se llama a la función que realiza el filtrado
        $scope.filtradoManual(valor);
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

    var finMosey;
    var finGranulle;
    var finPurkinje;
    var finDCN;
    var finGolgi;
    var finIO;

    var minPeso;
    var maxPeso;

    var spanish;
    var english;

    var arrayNeuronal = new Array();

    var s;

    var arrayMosey = new Array();
    var arrayGranulle = new Array();
    var arrayPurkinje = new Array();
    var arrayDCN = new Array();
    var arrayGolgi = new Array();
    var arrayIO = new Array();

    var d = "h";

    var arrayPrueba = new Array();

    function encontrarTipo(neurona) {
      var lineas = neurona.split(" ");
      var numero = lineas[1];
      var tipo = arrayNeuronal[numero].tipo;
      var nombreTipo;

      switch(tipo) {
        case '0': {
          nombreTipo = 'Mosey';
          break;
        }
        case '1': {
          nombreTipo = 'Granulle';
          break;
        }
        case '2': {
          nombreTipo = 'Purkinje';
          break;
        }
        case '3': {
          nombreTipo = 'DCN';
          break;
        }
        case '4': {
          nombreTipo = 'Golgi';
          break;
        }
        case '5': {
          nombreTipo = 'IO';
          break;
        }
      }

      return nombreTipo;
    }

    return {

      almacenarArrayMosey: function (mosey) {
        arrayMosey = mosey;
      },

      recuperarArrayMosey: function() {
        return arrayMosey;
      },

      almacenarArrayGranulle: function(granulle) {
        arrayGranulle = granulle;
      },

      recuperarArrayGranulle: function() {
        return arrayGranulle;
      },

      almacenarArrayPurkinje: function(purkinje) {
        arrayPurkinje = purkinje;
      },

      recuperarArrayPurkinje: function() {
        return arrayPurkinje;
      },

      almacenarArrayDCN: function(dcn) {
        arrayDCN = dcn;
      },

      recuperarArrayDCN: function() {
        return arrayDCN;
      },

      almacenarArrayGolgi: function(golgi) {
        arrayGolgi = golgi;
      },

      recuperarArrayGolgi: function() {
        return arrayGolgi;
      },

      almacenarArrayIO: function(io) {
        arrayIO = io;
      },

      recuperarArrayIO: function() {
        return arrayIO;
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

      setD: function(e) {
        d = e;
      },

      getD: function() {
        return d;
      },

      getArrayPrueba: function() {
        return arrayPrueba;
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
            d = e.data.node.label;
            var prev = d.split(" ");
            var sig = prev[1];
            arrayPrueba.push(sig);
            var tipo = encontrarTipo(d);

            var nodoABorrar = document.getElementById('infoNeurona');
              while (nodoABorrar.firstChild) {
                  nodoABorrar.removeChild(nodoABorrar.firstChild);
              }

            var div =  document.getElementById('infoNeurona');
            div.innerHTML = div.innerHTML + '<b>Nombre: </b>' + d;
            div.innerHTML = div.innerHTML + '<br><br>';
            div.innerHTML = div.innerHTML + '<b>Tipo: </b>' + tipo;

            document.getElementById('infoNeurona').style.display="inline";
            document.getElementById('infoNeurona').style.visibility="visible";

            //------------------------------------------------------------------------------------------------

            var frase;

            for (var i=0;i<arrayPrueba.length;i++) {

              if (i==0) { //Primer elemento
                frase = arrayPrueba[i];
                frase = frase + ',';
              }
              else if (i==arrayPrueba.length-1) { //Si es la última neurona no debe llevar coma al final
                frase = frase + arrayPrueba[i];
              }

              else { //elemento intermedio, debe llevar coma al final
                frase = frase + arrayPrueba[i];
                frase = frase + ','
              }

            }

            console.log('frase'+frase);

            var elementoABorrar = document.getElementById('barra');
              while (elementoABorrar.firstChild) {
                  elementoABorrar.removeChild(elementoABorrar.firstChild);
              }

            var div =  document.getElementById('barra');
            div.innerHTML = div.innerHTML + '<input id="inputNeuronas" type="text" value="'+frase+'"><br><br>';

            console.log(arrayPrueba);
        });
      }
    }
  });
