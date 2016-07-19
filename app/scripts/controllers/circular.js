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

    var mfgr = document.getElementById('MFGR');
    var mfgo = document.getElementById('MFGO');
    var grgo = document.getElementById('GRGO');
    var gogr = document.getElementById('GOGR');
    var gogo = document.getElementById('GOGO');


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

    var arrayContadorNeuronas = new Array();


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

    $scope.inicializarArrayConexiones = function(arrayConexion) {
      for (var i=0;i<grafoFactory.numeroTotalNeuronas;i++) {
        arrayConexion[i]=0;
      }
      for (var j=0;j<grafoFactory.arrayConexionesA.length;j++) {
        arrayConexion[grafoFactory.arrayConexionesA[j].origen]++;
        arrayConexion[grafoFactory.arrayConexionesA[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesB.length;j++) {
        arrayConexion[grafoFactory.arrayConexionesB[j].origen]++;
        arrayConexion[grafoFactory.arrayConexionesB[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesC.length;j++) {
        arrayConexion[grafoFactory.arrayConexionesC[j].origen]++;
        arrayConexion[grafoFactory.arrayConexionesC[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesD.length;j++) {
        arrayConexion[grafoFactory.arrayConexionesD[j].origen]++;
        arrayConexion[grafoFactory.arrayConexionesD[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesE.length;j++) {
        arrayConexion[grafoFactory.arrayConexionesE[j].origen]++;
        arrayConexion[grafoFactory.arrayConexionesE[j].destino]++;
      }
      return arrayConexion;
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
      arrayContadorNeuronas = $scope.inicializarArrayConexiones(arrayContadorNeuronas);
      grafoFactory.cargar(jsonCopy);
    }

    $scope.inicio();

    //Función que reinicia el elemento 'container'
    //se limpia la pizarra antes de mostrar un nuevo grafo para evitar repetición
    function refresh() {
      //console.log('hemos llamado a refresh');
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
        jsonCopy.nodes[arrayNeuronal[i].id].hidden = false;
      }
      while(arrayAux.length > 0) {
        arrayAux.pop();
      }
      var arrayPrueba = new Array();
      grafoFactory.setArrayPrueba(arrayPrueba);
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

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
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.sliderPesoGranulle = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.sliderPesoPurkinje = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.sliderPesoDCN = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.sliderPesoGolgi = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.sliderPesoIO = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.modificarPesoMosey = function() {
      var inicioPeso = $scope.sliderPesoMosey.min;
      var finalPeso = $scope.sliderPesoMosey.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoMossey*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoMossey*finalPeso;


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
      var inicioPeso = $scope.sliderPesoGranulle.min;
      var finalPeso = $scope.sliderPesoGranulle.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoGranulle*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoGranulle*finalPeso;

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
      var inicioPeso = $scope.sliderPesoPurkinje.min;
      var finalPeso = $scope.sliderPesoPurkinje.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoPurkinje*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoPurkinje*finalPeso;

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
      var inicioPeso = $scope.sliderPesoDCN.min;
      var finalPeso = $scope.sliderPesoDCN.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoDCN*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoDCN*finalPeso;

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
      var inicioPeso = $scope.sliderPesoGolgi.min;
      var finalPeso = $scope.sliderPesoGolgi.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoGolgi*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoGolgi*finalPeso;

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
      var inicioPeso = $scope.sliderPesoIO.min;
      var finalPeso = $scope.sliderPesoIO.max;

      inicioPeso = inicioPeso/100;
      inicioPeso = grafoFactory.minPesoIO*inicioPeso;
      finalPeso = finalPeso/100;
      finalPeso = grafoFactory.maxPesoIO*finalPeso;

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
      if (spanish) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      if (english) {
        console.log(english);
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      $scope.restaurar();
    }

    $scope.mostrarId = function() {
      if (spanish) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }

      //CORREGIR IDIOMA
      if (english) {
        console.log(english);
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      $scope.restaurar();
    }

    $scope.mostrarSeleccionManual = function() {
      if (spanish) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.visibility = "visible";
        document.getElementById('seleccionManual').style.display = "inline";
        document.getElementById('inputNeuronas').value="";
      }
      if (english) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.visibility = "visible";
        document.getElementById('seleccionManual').style.display = "inline";
        document.getElementById('inputNeuronas').value="";
      }
    }

    $scope.volver = function(valor){
      if (valor == 1) {
        document.getElementById('seleccion_neuronas').style.display = "none";
      }

      if (valor == 2) {
        document.getElementById('seleccion_grupos').style.display = "none";
      }

      if (valor == 3) {
        document.getElementById('slider').style.display = "none";
      }

      if (valor == 4) {
        document.getElementById('sliderPeso').style.display = "none";
      }

      if (valor ==5) {
        document.getElementById('seleccionManual').style.display = "none";
      }

      document.getElementById('seleccion_filtros').style.display = "inline";
    }

    $scope.display = function(valor) {
      document.getElementById('seleccion_filtros').style.display = "none";
      if (valor == 1) {
        document.getElementById('seleccion_neuronas').style.display = "inline";
      }

      if (valor == 2) {
        document.getElementById('seleccion_grupos').style.display = "inline";
      }

      if (valor == 3) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }

      if (valor == 4) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }

      if (valor == 5) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.visibility = "visible";
        document.getElementById('seleccionManual').style.display = "inline";
        document.getElementById('inputNeuronas').value="";
      }
    }

    $scope.getDestinos = function(neurona) {
      var resultado;
      var iteraciones = arrayNeuronal[neurona].destino.length;

      for (var i=0; i<iteraciones;i++) {
        var aux = arrayNeuronal[neurona].destino[i];
        aux = aux.toString();

        if (i==0) {
          resultado = aux;
        }
        else {
          resultado = resultado + ',' + aux;
        }
      }
      return resultado;
    }

    $scope.setAll = function() {
      var box = document.getElementById('setAll');
      var group1 = document.getElementById('MFGR');
      var group2 = document.getElementById('MFGO');
      var group3 = document.getElementById('GRGO');
      var group4 = document.getElementById('GOGR');
      var group5 = document.getElementById('GOGO');

      if (box.checked) {
        group1.checked = true;
        group2.checked = true;
        group3.checked = true;
        group4.checked = true;
        group5.checked = true;
      }
      else {
        group1.checked = false;
        group2.checked = false;
        group3.checked = false;
        group4.checked = false;
        group5.checked = false;
      }
      $scope.ajustarContadorNeuronasA();
      $scope.ajustarContadorNeuronasB();
      $scope.ajustarContadorNeuronasC();
      $scope.ajustarContadorNeuronasD();
      $scope.ajustarContadorNeuronasE();
    }

    $scope.filtradoPorRango = function() {
      var stringSeleccion = document.getElementById("inputNeuronas").value;
      var filtradoOrigen = stringSeleccion.split('-');
      var minRango = parseInt(filtradoOrigen[0]);
      var maxRango = parseInt(filtradoOrigen[1]);
      var arrayOrigenes = new Array();
      var arrayDatos = new Array();

      //Comprobaciones corrección de datos de entrada
      //minRango debe ser menor que maxRango
      //minRango debe ser mayor o igual que el valor inferior de las neuronas disponibles
      //maxRango debe ser menor o igual que el valor superior de las neuronas disponibles
      var min = parseInt(arrayNeuronal[0].id);
      var max= parseInt(arrayNeuronal[arrayNeuronal.length-1].id);
      if (minRango<=maxRango) {
        if (minRango>=min) {
          if (maxRango<=max) {
            //Obtenemos todas las neuronas de origen del rango obtenido
            var i=0;
            while (minRango<=maxRango) {
              arrayOrigenes[i] = minRango;
              i++;
              minRango++;
            }

            //Buscamos todos los destinos de las neuronas seleccionadas
            for (var i=0; i<arrayOrigenes.length;i++) {
              var neuronaOrigen = arrayOrigenes[i];
              arrayDatos.push($scope.getDestinos(neuronaOrigen));
            }

            for (var i=0; i<arrayDatos.length;i++) {
                var auxN = arrayDatos[i];
                auxN = auxN.split(',');
                for (var j=0; j<auxN.length;j++) {
                  var auxJ = auxN[j];
                  arrayAux.push(auxJ);
                }

            }

            for (var i=0; i<arrayNeuronal.length;i++) {
              jsonCopy.nodes[i].hidden = true;
            }

            for (var i=0; i<arrayAux.length;i++) {
              var aux = parseInt(arrayAux[i]);
              jsonCopy.nodes[aux].hidden=false;
            }
            refresh();
            grafoFactory.cargar(jsonCopy);
          }
          else {
            if (grafoFactory.spanish) {
              alert('ERROR: el valor superior del rango introducido es mayor que el valor máximo de id disponible');
            }
            if (grafoFactory.english) {
              alert('ERROR: The upper value of the entered range is greater than the maximun id value available');
            }
          }

        }
        else {
          if (grafoFactory.spanish)
          alert('ERROR: el valor inferior del rango introducido es menor que el valor mínimo de id disponible');
          if (grafoFactory.english)
          alert ('ERROR: The lower value of the entered range is smaller than the minimun id value available');
        }
      }
      else {
        if (grafoFactory.spanish)
        alert('ERROR: el valor inferior del rango introducido es mayor que el valor superior');
        if (grafoFactory.english)
        alert('ERROR: the lower value of the entered range is greater thar the upper value');
      }
    }

    $scope.filtradoManual = function(stringSeleccion) {
      var filtradoOrigen = stringSeleccion.split(',');
      var min = parseInt(arrayNeuronal[0].id);
      var max = parseInt(arrayNeuronal[arrayNeuronal.length-1].id);
      var detener = false;
      var arrayDatos = new Array();
      var j=0;

      while (j<filtradoOrigen.length && !detener) {

        if (filtradoOrigen[j] < min) {
          if (grafoFactory.spanish) {
            alert('ERROR: el valor inferior del rango introducido es menor que el valor mínimo de id disponible');
          }

          else if (grafoFactory.english) {
            alert('ERROR: The lower value of the entered range is smaller than the minimun id value available');
          }
          detener = true;
        }

        else if (filtradoOrigen[j] > max) {
          if (grafoFactory.spanish) {
            alert('ERROR: el valor superior del rango introducido es mayor que el valor máximo de id disponible');
          }
          else if (grafoFactory.english) {
            alert('ERROR: The upper value of the entered range is greater than the maximun id value available');
          }
          detener = true;
        }
        j++;
      }

      console.log('detener: '+detener);

      if (!detener) {

      for (var i=0; i<filtradoOrigen.length;i++) {
        var neuronaOrigen = filtradoOrigen[i];
        arrayDatos.push($scope.getDestinos(neuronaOrigen));
      }

      for (var i=0; i<arrayDatos.length;i++) {
          var auxN = arrayDatos[i];
          auxN = auxN.split(',');
          for (var j=0; j<auxN.length;j++) {
            var auxJ = auxN[j];
            arrayAux.push(auxJ);
          }

      }

      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[i].hidden = true;
      }

      for (var i=0; i<arrayAux.length;i++) {
        var aux = parseInt(arrayAux[i]);
        jsonCopy.nodes[aux].hidden=false;
      }
      refresh();
      grafoFactory.cargar(jsonCopy);
    }
    }

    $scope.ajustarContadorNeuronasA = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasA.length; i++) {
        if (mfgr.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasA[i]]++;
        }
        if (!mfgr.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasA[i]]--;
        }
      }
      $scope.visualizarConexiones();
    }

    $scope.ajustarContadorNeuronasB = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasB.length; i++) {
        if (mfgo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasB[i]]++;
        }
        if (!mfgo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasB[i]]--;
        }
      }
      $scope.visualizarConexiones();
    }

    $scope.ajustarContadorNeuronasC = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasC.length; i++) {
        if (grgo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasC[i]]++;
        }
        if (!grgo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasC[i]]--;
        }
      }
      $scope.visualizarConexiones();
    }

    $scope.ajustarContadorNeuronasD = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasD.length; i++) {
        if (gogr.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasD[i]]++;
        }
        if (!gogr.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasD[i]]--;
        }
      }
      $scope.visualizarConexiones();
    }

    $scope.ajustarContadorNeuronasE = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasE.length; i++) {
        if (gogo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasE[i]]++;
        }
        if (!gogo.checked) {
          arrayContadorNeuronas[grafoFactory.arrayNeuronasE[i]]--;
        }
      }
      $scope.visualizarConexiones();
    }

    $scope.comprobarEliminacion = function (neuronaAEliminar) {
      var permiso = false;
      var aux = arrayContadorNeuronas[neuronaAEliminar];

      if (aux == 0)
        permiso = true;

      return permiso;
    }

    $scope.visualizarConexiones = function() {

      if (!mfgr.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasA.length;i++) {
          var permisoEliminar = $scope.comprobarEliminacion(grafoFactory.arrayNeuronasA[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasA[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesA.length;j++) {
          var id = grafoFactory.arrayConexionesA[j].enlace;
          var origen = grafoFactory.arrayConexionesA[j].origen;
          var destino = grafoFactory.arrayConexionesA[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<grafoFactory.arrayNeuronasA.length;i++) {
          jsonCopy.nodes[grafoFactory.arrayNeuronasA[i]].hidden = false;
        }
        for (var j=0;j<grafoFactory.arrayConexionesA.length; j++) {
          var id = grafoFactory.arrayConexionesA[j].enlace;
          var origen = grafoFactory.arrayConexionesA[j].origen;
          var destino = grafoFactory.arrayConexionesA[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!mfgo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasB.length;i++) {
          var permisoEliminar = $scope.comprobarEliminacion(grafoFactory.arrayNeuronasB[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasB[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesB.length;j++) {
          var id = grafoFactory.arrayConexionesB[j].enlace;
          var origen = grafoFactory.arrayConexionesB[j].origen;
          var destino = grafoFactory.arrayConexionesB[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<grafoFactory.arrayNeuronasB.length;i++) {
          jsonCopy.nodes[grafoFactory.arrayNeuronasB[i]].hidden = false;
        }
        for (var j=0;j<grafoFactory.arrayConexionesB.length; j++) {
          var id = grafoFactory.arrayConexionesB[j].enlace;
          var origen = grafoFactory.arrayConexionesB[j].origen;
          var destino = grafoFactory.arrayConexionesB[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!grgo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasC.length;i++) {
          var permisoEliminar = $scope.comprobarEliminacion(grafoFactory.arrayNeuronasC[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasC[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesC.length;j++) {
          var id = grafoFactory.arrayConexionesC[j].enlace;
          var origen = grafoFactory.arrayConexionesC[j].origen;
          var destino = grafoFactory.arrayConexionesC[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<grafoFactory.arrayNeuronasC.length;i++) {
          jsonCopy.nodes[grafoFactory.arrayNeuronasC[i]].hidden = false;
        }
        for (var j=0;j<grafoFactory.arrayConexionesC.length; j++) {
          var id = grafoFactory.arrayConexionesC[j].enlace;
          var origen = grafoFactory.arrayConexionesC[j].origen;
          var destino = grafoFactory.arrayConexionesC[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogr.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasD.length;i++) {
          var permisoEliminar = $scope.comprobarEliminacion(grafoFactory.arrayNeuronasD[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasD[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesD.length;j++) {
          var id = grafoFactory.arrayConexionesD[j].enlace;
          var origen = grafoFactory.arrayConexionesD[j].origen;
          var destino = grafoFactory.arrayConexionesD[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<grafoFactory.arrayNeuronasD.length;i++) {
          jsonCopy.nodes[grafoFactory.arrayNeuronasD[i]].hidden = false;
        }
        for (var j=0;j<grafoFactory.arrayConexionesD.length; j++) {
          var id = grafoFactory.arrayConexionesD[j].enlace;
          var origen = grafoFactory.arrayConexionesD[j].origen;
          var destino = grafoFactory.arrayConexionesD[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasE.length;i++) {
          var permisoEliminar = $scope.comprobarEliminacion(grafoFactory.arrayNeuronasE[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasE[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesE.length;j++) {
          var id = grafoFactory.arrayConexionesE[j].enlace;
          var origen = grafoFactory.arrayConexionesE[j].origen;
          var destino = grafoFactory.arrayConexionesE[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<grafoFactory.arrayNeuronasE.length;i++) {
          jsonCopy.nodes[grafoFactory.arrayNeuronasE[i]].hidden = false;
        }
        for (var j=0;j<grafoFactory.arrayConexionesE.length; j++) {
          var id = grafoFactory.arrayConexionesE[j].enlace;
          var origen = grafoFactory.arrayConexionesE[j].origen;
          var destino = grafoFactory.arrayConexionesE[j].destino;

          var pos = $scope.buscarArista(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }
      $scope.chequearMosey();
      $scope.chequearGranulle();
      $scope.chequearPurkinje();
      $scope.chequearDCN();
      $scope.chequearGolgi();
      $scope.chequearIO();
      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.visualizar = function(){

      var valor = document.getElementById("inputNeuronas").value;

      var admitido = true;
      var esRango = false;

      if (valor=="") {
        admitido = false;
      }

      else if (valor.charAt(valor.length-1) == ',') {
        admitido = false;
      }

      else {
        //Comprobación carácter por carácter de que sea un entero o una coma, e invalidarlo mediante
        //admitido = false, en caso contrario, lo que evitará que se ejecute ninguna acción
        for (var i=0; i<valor.length;i++) {
          var aux = valor.charAt(i);
          var t = !isNaN(String(aux) * 1);
            if (!t) {
              if (aux == '-') {
                esRango = true;
              }
              else if (aux != ',') {
               admitido = false;
              }
            }
        }
      }

      if (!admitido) {
        if (grafoFactory.spanish) {
          alert ('Error: \n- Sólo se admiten números enteros separados por comas sin espacios \n- Alguna de las neuronas seleccionadas pueden estar fuera de rango \n- No se permite hacer una búsqueda en blanco');
        }

        if (grafoFactory.english) {
          alert ('Error: \n- Only integers separated by commas without spaces are valid \n- Some of the selected neurons may be out of range \n- Blank search not allowed');
        }
      }
      else if (admitido && !esRango){ //Si el string con las neuronas pedidas por el usuario es sintácticamente correcto, se llama a la función que realiza el filtrado
        $scope.filtradoManual(valor);
      }

      else if (admitido && esRango) {
        $scope.filtradoPorRango();
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

    var maxPesoMossey;
    var maxPesoGranulle;
    var maxPesoPurkinje;
    var maxPesoDCN;
    var maxPesoGolgi;
    var maxPesoIO;

    var minPesoMossey;
    var minPesoGranulle;
    var minPesoPurkinje;
    var minPesoDCN;
    var minPesoGolgi;
    var minPesoIO;

    var arrayNeuronasA;
    var arrayNeuronasB;
    var arrayNeuronasC;
    var arrayNeuronasD;
    var arrayNeuronasE;

    var arrayConexionesA;
    var arrayConexionesB;
    var arrayConexionesC;
    var arrayConexionesD;
    var arrayConexionesE;

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

    function encontrarDestinos  (neurona) {
      var lineas = neurona.split(" ");
      var numero = lineas[1];
      var str = "";
      for (var i=1; i<arrayNeuronal[numero].destino.length;i++) {
        if (str != "")
        str = str + ' ' + arrayNeuronal[numero].destino[i];
        else
        str = str + arrayNeuronal[numero].destino[i];
      }

      if (str == "")
       str = "-";
      return str;
    }

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

      setArrayPrueba: function(a) {
        arrayPrueba = a;
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
            drawLabels: "true",
            enableHovering: "true",
            enableEdgeHovering: "true",
            defaultNodeColor: "#ffffff",
            edgeColor: "#000000",
            nodeHoverColor: "#0000ff",
            defaultNodeHoverColor: "#0000ff",
            defaultLabelHoverColor: "false",
            defaultLabelColor: "#000",
            defaultLabelSize: "2"
          }
        })

        //enlazamos el evento de click de ratón sobre un nodo, mostrando el nombre del nodo por consola
        s.bind('clickNode', function(e) {
            d = e.data.node.label;
            var prev = d.split(" ");
            var sig = prev[1];
            arrayPrueba.push(sig);
            var tipo = encontrarTipo(d);
            var destinos = encontrarDestinos(d);
            var auxDestinos = destinos.split(" ");
            if (auxDestinos.length > 3) {
              var destinos0 = auxDestinos[0];
              var destinos1 = auxDestinos[1];
              var destinos2 = auxDestinos[2];
            }

            var nodoABorrar = document.getElementById('infoNeurona');
              while (nodoABorrar.firstChild) {
                  nodoABorrar.removeChild(nodoABorrar.firstChild);
              }

            var div =  document.getElementById('infoNeurona');
            div.innerHTML = div.innerHTML + '<b>ID: </b>' + d;
            div.innerHTML = div.innerHTML + '<br><br>';
            div.innerHTML = div.innerHTML + '<b>T: </b>' + tipo;
            div.innerHTML = div.innerHTML + '<br><br>';
            if (destinos.length > 3) {
              //console.log('opcion 1');
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + destinos0 + ', ' + destinos1 + ', ' + destinos2 + ' ';
              var element =  document.createElement("input");
              element.type = "button";
              element.value = "...";
              element.name = "...";
              element.onclick = function() {
                alert ('Total dest.: '+destinos);
              }
              div.appendChild(element);
            }
            else if (destinos == "-"){
              //console.log('opcion 2');
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + 'no dest.';
            }

            else {
              //console.log('opcion 3');
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + destinos;
            }



            document.getElementById('infoNeurona').style.display="inline";
            document.getElementById('infoNeurona').style.visibility="visible";

            //------------------------------------------------------------------------------------------------
            //Para la parte de selección individual de neuronas
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

            var elementoABorrar = document.getElementById('barra');
              while (elementoABorrar.firstChild) {
                  elementoABorrar.removeChild(elementoABorrar.firstChild);
              }

            var div =  document.getElementById('barra');
            div.innerHTML = div.innerHTML + '<input id="inputNeuronas" type="text" value="'+frase+'"><br><br>';
        });


      }
    }
  });
