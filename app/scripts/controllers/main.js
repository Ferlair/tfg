'use strict';

/**
 * @ngdoc function
 * @name tfgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tfgApp
 */
angular
  .module('tfgApp')

  .controller('MainCtrl',['$scope','grafoFactory', function($scope, grafoFactory){

    //Variable destinada a almacenar el json con información de nodos y aristas
    var jsonCopy;

    //Almacenamiento del número de neuronas de cada tipo
    var numeroMosey = 0;
    var numeroGranulle = 0;
    var numeroPurkinje = 0;
    var numeroDcn = 0;
    var numeroGolgi = 0;
    var numeroIo = 0;
    var numeroTotalNeuronas = 0;

    //Arrays para almacenar las neuronas de cada tipo
    var arrayMosey = [];
    var arrayGranulle = [];
    var arrayPurkinje = [];
    var arrayDCN = [];
    var arrayGolgi = [];
    var arrayIO = [];

    var arrayNeuronasA = [];
    var arrayNeuronasB = [];
    var arrayNeuronasC = [];
    var arrayNeuronasD = [];
    var arrayNeuronasE = [];

    var arrayConexionesA = [];
    var arrayConexionesB = [];
    var arrayConexionesC = [];
    var arrayConexionesD = [];
    var arrayConexionesE = [];

    var infoTotal = 0;
    var infoMossy = 0;
    var infoGranulle = 0;
    var infoPurkinje = 0;
    var infoDCN = 0;
    var infoGolgi = 0;
    var infoIO = 0;

    grafoFactory.spanish=true;
    grafoFactory.english=false;

    $scope.activarVisualizaciones = function() {
      document.getElementById('color-esp').style.display = 'inline';
      document.getElementById('bn-esp').style.display = 'none';
      document.getElementById('color-eng').style.display = 'inline';
      document.getElementById('bn-eng').style.display = 'none';
    }

    $scope.desactivarVisualizaciones = function() {
      document.getElementById('color-esp').style.display = 'none';
      document.getElementById('bn-esp').style.display = 'inline';
      document.getElementById('color-eng').style.display = 'none';
      document.getElementById('bn-eng').style.display = 'inline';
    }

    $scope.desactivarVisualizaciones();

    $scope.esp = function() {
      grafoFactory.spanish = true;
      grafoFactory.english = false;
      document.getElementById('idioma-eng').style.display = "none";
      document.getElementById('idioma-esp').style.display = "inline";
    }

    $scope.eng = function() {
      grafoFactory.spanish = false;
      grafoFactory.english = true;
      document.getElementById('idioma-esp').style.display = "none";
      document.getElementById('idioma-eng').style.display = "inline";
    }

    $scope.componenteAHex = function(componente) {
      var cambio = componente.toString(16);
      return cambio.length == 1 ? "0" + cambio : cambio;
    }

    $scope.hexARGB = function(r,g,b) {
      var color = "#" + $scope.componenteAHex(r) + $scope.componenteAHex(g) + $scope.componenteAHex(b);
      return color;
    }

    $scope.obtenerNivelInterpolacion = function(peso, pesoMax, pesoMin) {

      //Primer paso: al peso máximo y al peso a comparar les restamos el peso mínimo
      //De esta forma podemos hallar el porcentaje proporcional correcto si el peso mínimo es distinto de cero
      pesoMax = pesoMax - pesoMin;
      peso = peso - pesoMin;

      var aux = Math.round((peso * 100) / pesoMax);
      return aux/100;
    }

    $scope.interpolar = function(ratio, minR, minG, minB, maxR, maxG, maxB) {

      var r;
      var g;
      var b;

      var rangoR = (Math.abs(maxR-minR)) * ratio;
      var rangoG = (Math.abs(maxG-minG)) * ratio;
      var rangoB = (Math.abs(maxB-minB)) * ratio;

      r = maxR + Math.round(rangoR);
      g = maxG + Math.round(rangoG);
      b = maxB + Math.round(rangoB);

      return [r,g,b];
    }


    $scope.getColor = function(peso, tipoOrigen, tipoDestino, origen, destino, arrayNeuronal) {
      var color;
      var ocultar = true;

      //Conexiones con origen Mossey
      if (tipoOrigen=='0') {
        if (tipoDestino=='1') {
          //console.log('añadimos en origen '+origen+' y destino '+destino+' la letra A');
          var repetidoOrigen = arrayNeuronal[origen].tipoConexion.indexOf('A');
          var repetidoDestino = arrayNeuronal[destino].tipoConexion.indexOf('A');

          if (repetidoOrigen == -1)
          arrayNeuronal[origen].tipoConexion.push('A');

          if (repetidoDestino == -1)
          arrayNeuronal[destino].tipoConexion.push('A');

          var source = "n"+origen;
          var target = "n"+destino;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= origen;
          obj.destino = destino;
          obj.enlace = id;

          arrayConexionesA.push(obj);
          repetidoOrigen = arrayNeuronasA.indexOf(origen);

          //if (repetidoOrigen == -1)
          arrayNeuronasA.push(origen);

          repetidoDestino = arrayNeuronasA.indexOf(destino);
          //if (repetidoDestino == -1)
          arrayNeuronasA.push(destino);

          var ratio = $scope.obtenerNivelInterpolacion(peso, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolado = $scope.interpolar(ratio, 247, 0, 255, 72, 0, 66);
          color = $scope.hexARGB(interpolado[0],interpolado[1],interpolado[2]);
          //console.log('origen'+origen+' y deestino '+destino+' COLOR ADQUIRIDO: '+color);
          ocultar = false;
        }
        if (tipoDestino == '4') {
          //console.log('añadimos en origen '+origen+' y destino '+destino+' la letra B');
          var repetidoOrigen = arrayNeuronal[origen].tipoConexion.indexOf('B');
          var repetidoDestino = arrayNeuronal[destino].tipoConexion.indexOf('B');

          if (repetidoOrigen == -1)
          arrayNeuronal[origen].tipoConexion.push('B');

          if (repetidoDestino == -1)
          arrayNeuronal[destino].tipoConexion.push('B');

          var source = "n"+origen;
          var target = "n"+destino;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= origen;
          obj.destino = destino;
          obj.enlace = id;

          arrayConexionesB.push(obj);
          repetidoOrigen = arrayNeuronasB.indexOf(origen);

          //if (repetidoOrigen == -1)
          arrayNeuronasB.push(origen);

          repetidoDestino = arrayNeuronasB.indexOf(destino);
          //if (repetidoDestino == -1)
          arrayNeuronasB.push(destino);

          var ratio = $scope.obtenerNivelInterpolacion(peso, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolado = $scope.interpolar(ratio, 64, 255, 0, 7, 72, 0);
          color = $scope.hexARGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      //Conexiones con origen Granulle
      if (tipoOrigen == '1') {
        if (tipoDestino == '4'){
          //console.log('añadimos en origen '+origen+' y destino '+destino+' la letra C');
          var repetidoOrigen = arrayNeuronal[origen].tipoConexion.indexOf('C');
          var repetidoDestino = arrayNeuronal[destino].tipoConexion.indexOf('C');

          if (repetidoOrigen == -1)
          arrayNeuronal[origen].tipoConexion.push('C');

          if (repetidoDestino == -1)
          arrayNeuronal[destino].tipoConexion.push('C');

          var source = "n"+origen;
          var target = "n"+destino;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= origen;
          obj.destino = destino;
          obj.enlace = id;

          arrayConexionesC.push(obj);
          repetidoOrigen = arrayNeuronasC.indexOf(origen);

          //if (repetidoOrigen == -1)
          arrayNeuronasC.push(origen);

          repetidoDestino = arrayNeuronasC.indexOf(destino);
          //if (repetidoDestino == -1)
          arrayNeuronasC.push(destino);
          var ratio = $scope.obtenerNivelInterpolacion(peso, grafoFactory.maxPesoGranulle, grafoFactory.minPesoGranulle);
          var interpolado = $scope.interpolar(ratio, 26, 0, 255, 0, 0, 72);
          color = $scope.hexARGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      //Conexiones con origen Golgi
      if (tipoOrigen == '4') {
        if (tipoDestino == '1') {
          //console.log('añadimos en origen '+origen+' y destino '+destino+' la letra D');
          var repetidoOrigen = arrayNeuronal[origen].tipoConexion.indexOf('D');
          var repetidoDestino = arrayNeuronal[destino].tipoConexion.indexOf('D');

          if (repetidoOrigen == -1)
          arrayNeuronal[origen].tipoConexion.push('D');

          if (repetidoDestino == -1)
          arrayNeuronal[destino].tipoConexion.push('D');

          var source = "n"+origen;
          var target = "n"+destino;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= origen;
          obj.destino = destino;
          obj.enlace = id;

          arrayConexionesD.push(obj);
          repetidoOrigen = arrayNeuronasD.indexOf(origen);

          //if (repetidoOrigen == -1)
          arrayNeuronasD.push(origen);

          repetidoDestino = arrayNeuronasD.indexOf(destino);
          //if (repetidoDestino == -1)
          arrayNeuronasD.push(destino);
          var ratio = $scope.obtenerNivelInterpolacion(peso, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolado = $scope.interpolar(ratio,255, 0, 0, 72, 0, 0);
          color = $scope.hexARGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
        if (tipoDestino == '4') {
          //console.log('añadimos en origen '+origen+' y destino '+destino+' la letra E');
          var repetidoOrigen = arrayNeuronal[origen].tipoConexion.indexOf('E');
          var repetidoDestino = arrayNeuronal[destino].tipoConexion.indexOf('E');

          if (repetidoOrigen == -1)
          arrayNeuronal[origen].tipoConexion.push('E');

          if (repetidoDestino == -1)
          arrayNeuronal[destino].tipoConexion.push('E');

          var source = "n"+origen;
          var target = "n"+destino;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= origen;
          obj.destino = destino;
          obj.enlace = id;

          arrayConexionesE.push(obj);
          repetidoOrigen = arrayNeuronasE.indexOf(origen);

          //if (repetidoOrigen == -1)
          arrayNeuronasE.push(origen);

          repetidoDestino = arrayNeuronasE.indexOf(destino);
          //if (repetidoDestino == -1)
          arrayNeuronasE.push(destino);
          var ratio = $scope.obtenerNivelInterpolacion(peso, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolado = $scope.interpolar(ratio,255, 154, 0, 81, 55, 0);
          color = $scope.hexARGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      return [color, ocultar];
    }

    $scope.escribirDatos = function(){



      var div =  document.getElementById('especificaciones-esp');

      div.innerHTML = div.innerHTML + 'Información sobre los datos neuronales cargados:';
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número total de neuronas: </b>'+ infoTotal;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo Mossy: </b>' + infoMossy;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo Granulle: </b>' + infoGranulle;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo Purkinje: </b>' + infoPurkinje;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo DCN: </b>' + infoDCN;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo Golgi: </b>' + infoGolgi;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Neuronas tipo IO: </b>' + infoIO;


      var div =  document.getElementById('especificaciones-eng');

      div.innerHTML = div.innerHTML + 'Loaded data info:';
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Total number of neurons: </b>'+ infoTotal;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Mossy neurons: </b>' + infoMossy;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Granulle neurons: </b>' + infoGranulle;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Purkinje neurons: </b>' + infoPurkinje;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>DCN neurons: </b>' + infoDCN;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Golgi neurons: </b>' + infoGolgi;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>IO neurons: </b>' + infoIO;


      $scope.checked = true;
      $scope.activarVisualizaciones();
    }

    $scope.reiniciarInfo = function() {
      var nodoABorrar = document.getElementById('especificaciones-esp');
        while (nodoABorrar.firstChild) {
            nodoABorrar.removeChild(nodoABorrar.firstChild);
        }

        var nodoABorrar = document.getElementById('especificaciones-eng');
          while (nodoABorrar.firstChild) {
              nodoABorrar.removeChild(nodoABorrar.firstChild);
        }

        infoTotal = 0;
        infoMossy = 0;
        infoGranulle = 0;
        infoPurkinje = 0;
        infoDCN = 0;
        infoGolgi = 0;
        infoIO = 0;
    }

    //Función que se encarga de asignar un color a cada una de las aristas del json
    $scope.colorearAristas = function(arrayNeuronal) {
      var color;
      var origen;
      var destino;

      for (var i=1; i<jsonCopy.edges.length; i++) {
        origen = jsonCopy.edges[i].source.substr(1);
        destino = jsonCopy.edges[i].target.substr(1);

        if (origen != destino){
        var posicion=-1;
        var esta = false;

        while (!esta) {
          posicion++;
          esta = arrayNeuronal[origen].destino[posicion] == destino;
        }

        var peso = arrayNeuronal[origen].peso[posicion];
        var tipoOrigen = arrayNeuronal[origen].tipo;
        var tipoDestino = arrayNeuronal[origen].tipoDestino[posicion];
        color = $scope.getColor(peso, tipoOrigen, tipoDestino, origen, destino, arrayNeuronal);
        jsonCopy.edges[i].color = color[0];
        jsonCopy.edges[i].hidden = color[1];
        grafoFactory.arrayNeuronasA = arrayNeuronasA;
        grafoFactory.arrayNeuronasB = arrayNeuronasB;
        grafoFactory.arrayNeuronasC = arrayNeuronasC;
        grafoFactory.arrayNeuronasD = arrayNeuronasD;
        grafoFactory.arrayNeuronasE = arrayNeuronasE;
        grafoFactory.arrayConexionesA = arrayConexionesA;
        grafoFactory.arrayConexionesB = arrayConexionesB;
        grafoFactory.arrayConexionesC = arrayConexionesC;
        grafoFactory.arrayConexionesD = arrayConexionesD;
        grafoFactory.arrayConexionesE = arrayConexionesE;
      }
      }
    }

    $scope.generarJSON = function(arrayNeuronal) {

        var nombreArista = 0;
        var index=0;

        //Creación del objeto json que alberga la información de nodos y aristas a dibujar
        var jsonObj = { nodes: [{}], edges: [{}]};

        //Proporciona valores por defecto a la variable nodo usada en el bucle
        function getNodo() {
          return {
            id: "",
            label: "",
            x: "",
            y: "",
            size: ""
          }
        };

        //Proporciona valores por defecto a la variable arista usada en el bucle
        function getAristas() {
          return {
            id: "",
            source: "",
            target: ""
          }
        };

        //Creación del lienzo inicial
        for (var i=0; i<arrayNeuronal.length; i++) {
          var nodo = getNodo();

          //Mosey Fibers
          if (arrayNeuronal[i].tipo == '0') {
            arrayMosey.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 1;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.000001;
            nodo.hidden = false;
            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }
            numeroMosey++;
            grafoFactory.numeroMosey = numeroMosey;
          }

          //Granulle Cells
          else if (arrayNeuronal[i].tipo == '1'){
            arrayGranulle.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 4;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.001;
            nodo.hidden = false;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroGranulle++;
            grafoFactory.numeroGranulle = numeroGranulle;
          }

          //Purkinje Cells
          else if(arrayNeuronal[i].tipo == '2') {
            arrayPurkinje.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 6;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0003;
            nodo.hidden = false;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroPurkinje++;
            grafoFactory.numeroPurkinje = numeroPurkinje;
          }

          //DCN Cells
          else if(arrayNeuronal[i].tipo == '3'){
            arrayDCN.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 8;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0004;
            nodo.hidden = false;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroDcn++;
            grafoFactory.numeroDcn = numeroDcn;
          }

          //Golgi Cells
          else if(arrayNeuronal[i].tipo == '4'){
            arrayGolgi.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 10;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0005;
            nodo.hidden = false;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroGolgi++;
            grafoFactory.numeroGolgi = numeroGolgi;
          }

          //IO Cells
          else if(arrayNeuronal[i].tipo == '5'){
            arrayIO.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 12;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.006;
            nodo.hidden = false;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroIo++;
            grafoFactory.numeroIo = numeroIo;
          }



          numeroTotalNeuronas++;
          grafoFactory.numeroTotalNeuronas = numeroTotalNeuronas;

        }

        jsonCopy = jsonObj;

        for (var i=0; i<jsonCopy.edges.length;i++) {
          jsonCopy.edges[i].hidden = false;
        }

        $scope.escribirDatos();
        grafoFactory.almacenarArrayMosey(arrayMosey);
        grafoFactory.almacenarArrayGranulle(arrayGranulle);
        grafoFactory.almacenarArrayPurkinje(arrayPurkinje);
        grafoFactory.almacenarArrayDCN(arrayDCN);
        grafoFactory.almacenarArrayGolgi(arrayGolgi);
        grafoFactory.almacenarArrayIO(arrayIO);
        grafoFactory.almacenarJSON(jsonCopy);
        $scope.colorearAristas(arrayNeuronal);
        $scope.limpiarAristas(arrayNeuronal);
        //$scope.revisarLienzo(arrayNeuronal);
        //$scope.activarVisualizaciones();
        console.log(jsonCopy);
        //console.log(arrayNeuronal);
    }

    /*$scope.revisarLienzo = function(arrayNeuronal){
      console.log('REVISAR LIENZO');
      for (var i=0; i<arrayNeuronal.length;i++) {
        var oculto = true;
        for (var j=0; j<arrayNeuronal[i].destino.length;j++) {
          var enlace = 'en'+arrayNeuronal[i].id+'+n'+arrayNeuronal[i].destino[j];
          console.log(enlace);

          for (var z=0;z<jsonCopy.edges.length;z++) {
            if (enlace == jsonCopy.edges[i].id) {
              console.log('coincide '+enlace);
            }
          }
        }
      }
      console.log('------------------------------------------');
    }*/

    //Elimina neuronas que sólo tiene enlace consigo mismas
    $scope.limpiarAristas = function(arrayNeuronal){
      console.log(arrayNeuronal);
      for (var i=0; i<arrayNeuronal.length;i++) {
        if (arrayNeuronal[i].destino.length == 1) {
          console.log('la neurona '+i+' tiene un solo destino');
          jsonCopy.nodes[i].hidden = true;
        }
        if (arrayNeuronal[i].tipoConexion.length == 0) {
          jsonCopy.nodes[i].hidden = true;
        }
      }
    }

    $scope.getInfo = function(arrayNeuronal){
      for (var i=0;i<arrayNeuronal.length; i++) {
        switch(arrayNeuronal[i].tipo) {
          case "0": {
                      infoMossy++;
                      infoTotal++;
                      break;
                    }
          case ("1"): {
                        infoGranulle++;
                        infoTotal++;
                        break;
                      }
          case ("2"): {
                        infoPurkinje++;
                        infoTotal++;
                        break;
                      }
          case ("3"): {
                        infoDCN++;
                        infoTotal++;
                        break;
                      }
          case ("4"): {
                        infoGolgi++;
                        infoTotal++;
                        break;
                      }
          case ("5"): {
                        infoIO++;
                        infoTotal++;
                        break;
                      }
        }
      }
    }

    /*$scope.checkExtension = function() {
      var x = document.getElementById("myFile");
      var txt = "";
      var extension;
      if ('files' in x) {
        for (var i = 0; i < x.files.length; i++) {
            var file = x.files[i];
            if ('name' in file) {
                txt = file.name;
            }
        }
      }

      txt = txt.split(".");
      extension = txt[1];

      console.log('La extensión es: '+extension);
      return extension;
    }*/

    //Entrada: fichero de texto con datos neuronales
    //Salida:
    $scope.cargarNeuronas = function($fileContent) {
      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];
      var x = [];
      var y = [];
      var tipo = [];
      var peso = [];
      var arrayNeuronal = new Array();
      var tipoDestino = [];
      var tipoConexion = [];

      $scope.reiniciarInfo();
      //$scope.checkExtension();

      for (var j=0; j<lineas.length; j++) {
        var aux = lineas[j].replace(/\s+/g, " ");
        lineas[j] = aux;
      }

      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = palabrasPorLineas[0];
        destino[i] = palabrasPorLineas[1];
        x[i] = palabrasPorLineas[2];
        y[i] = palabrasPorLineas[3];
        tipo[i] = palabrasPorLineas[5];
        peso[i] = palabrasPorLineas[6];
      }

      //Obtenemos el número total de neuronas que contiene el archivo
      grafoFactory.numeroTotalNeuronas = $scope.obtenerNumeroNeuronas(origen,destino);

      //Inicializamos el array con un valor para cada una de las neuronas que hay en el fichero
      //El valor inicial es de id igual al número de neurona, destino la propia neurona y peso 0
      arrayNeuronal = $scope.inicializarArray(grafoFactory.numeroTotalNeuronas, arrayNeuronal,x, y);



      //A continuación se lee una a una cada neurona y se agrega su neurona de destino y un peso
      for (var j=0; j<destino.length; j++) {
        var elementoRepetido = arrayNeuronal[origen[j]].destino.indexOf(destino[j]);
        if (elementoRepetido==-1) {
          var p = peso[j];
          arrayNeuronal[origen[j]].peso.push(p.toString());
          arrayNeuronal[origen[j]].destino.push(destino[j]); //Se agrega el destino
          var tipoAux = $scope.encontrarTipoNeurona(destino[j],origen, tipo);
          arrayNeuronal[origen[j]].tipoDestino.push(tipoAux); //Se agrega el tipo de neurona de destino
        }
      }

      //Asignación del tipo de neurona
      for (var i=0; i<origen.length; i++) {
        var auxTipo = tipo[i];
        var auxPos = origen[i];

        //Inicialmente cada neurona no tiene un tipo asignado, se inicializa
        //con el primer valor que encuentra como tipo, mientras que rechaza los siguientes
        //para evitar múltiples valores para el tipo para la misma neurona
        if (arrayNeuronal[auxPos].tipo == '-') {

          arrayNeuronal[auxPos].tipo = auxTipo;
        }
      }

      $scope.getInfo(arrayNeuronal);

      //Las neuronas que no tenían un tipo asignado en el fichero reciben el valor 0 por defecto
      for (var i=0; i<(arrayNeuronal.length); i++) {
        var pesoPorDefecto = 0;
        if (arrayNeuronal[i].tipo == '-')
          arrayNeuronal[i].tipo = pesoPorDefecto.toString();
      }

      //PRUEBA PARA ESDESTINO
      for (var i=0;i<arrayNeuronal.length;i++) {
        $scope.buscarEsDestino(arrayNeuronal, i);
      }
      grafoFactory.maxPesoMossey = $scope.getMaxPeso(arrayNeuronal, 0);
      grafoFactory.maxPesoGranulle = $scope.getMaxPeso(arrayNeuronal, 1);
      grafoFactory.maxPesoPurkinje = $scope.getMaxPeso(arrayNeuronal, 2);
      grafoFactory.maxPesoDCN = $scope.getMaxPeso(arrayNeuronal, 3);
      grafoFactory.maxPesoGolgi = $scope.getMaxPeso(arrayNeuronal, 4);
      grafoFactory.maxPesoIO = $scope.getMaxPeso(arrayNeuronal, 5);
      grafoFactory.minPesoMossey = $scope.getMinPeso(arrayNeuronal, 0);
      grafoFactory.minPesoGranulle = $scope.getMinPeso(arrayNeuronal, 1);
      grafoFactory.minPesoPurkinje = $scope.getMinPeso(arrayNeuronal, 2);
      grafoFactory.minPesoDCN = $scope.getMinPeso(arrayNeuronal, 3);
      grafoFactory.minPesoGolgi = $scope.getMinPeso(arrayNeuronal, 4);
      grafoFactory.minPesoIO = $scope.getMinPeso(arrayNeuronal, 5);
      grafoFactory.almacenarArrayNeuronal(arrayNeuronal);
      $scope.generarJSON(arrayNeuronal);
    }

    //Busca las neuronas de las cuales la neurona id es destino
    $scope.buscarEsDestino = function(arrayNeuronal, id) {
      for (var i=0;i<arrayNeuronal.length;i++){
        for (var j=0; j<arrayNeuronal[i].destino.length;j++) {
          var destino = arrayNeuronal[i].destino[j];
          if ((destino == id) && (id != arrayNeuronal[i].id)) {
            //console.log('añadimos id '+id+' y valor en arrayneuronal '+ arrayNeuronal[i].id);
            arrayNeuronal[id].esDestino.push(arrayNeuronal[i].id);
          }
        }
      }
    }

    $scope.getMinPeso = function(arrayNeuronal, tipo) {
      var min = 0;

      for (var i=0; i<arrayNeuronal.length; i++) {
        if (arrayNeuronal[i].tipo == tipo) {
          for (var j=0; j<arrayNeuronal[i].peso.length; j++) {
            var minTipo = Math.min.apply(null,arrayNeuronal[i].peso);
            min = Math.min(min, minTipo);
          }
        }
      }

      return min;
    }

    $scope.getMaxPeso = function(arrayNeuronal, tipo) {
      var max = 0;

      for (var i=0; i<arrayNeuronal.length; i++) {

        if (arrayNeuronal[i].tipo == tipo) {

          for (var j=0; j<arrayNeuronal[i].peso.length; j++) {
            var maxTipo = Math.max.apply(null,arrayNeuronal[i].peso);
            max = Math.max(max,maxTipo);
          }

        }

      }
      return max;
    }

    $scope.encontrarTipoNeurona = function(neuronaDestino, origen, tipo) {
      var tipoDevuelto;
      for (var i=0; i<origen.length; i++) {
        if (neuronaDestino == origen[i])
          tipoDevuelto = tipo[i];
      }
      return tipoDevuelto;
    }

    //Se obtiene el número de neurona más alto, teniendo en cuenta tanto las neuronas de origen como de destino
    //de esta manera, se inicializará el array con los valores de id del 0 al número más alto obtenido en esta función
    $scope.obtenerNumeroNeuronas = function(origen,destino) {
      var maximoOrigen = Math.max.apply(null,origen);
      var maximoDestino = Math.max.apply(null,destino);
      var max = Math.max(maximoOrigen, maximoDestino);
      max++;
      return max;
    }

    //Debemos crear una celda del array para cada una de las neuronas, con valores iniciales por defecto
    $scope.inicializarArray = function(limite, arrayNeuronal, x, y) {
      var tipoPorDefecto = '-';
      for (var i=0; i<limite; i++) {
        var neurona = new Array();
        var pesoInicial = 0;
        neurona.destino = [];
        neurona.peso = [];
        neurona.tipoDestino = [];
        neurona.tipoConexion = [];
        neurona.esDestino = [];
        neurona.id = i.toString();
        neurona.destino.push(i.toString());
        neurona.peso.push(pesoInicial.toString());
        neurona.tipoDestino.push(tipoPorDefecto.toString());
        neurona.tipo = '-';
        neurona.x = x[i];
        if (neurona.x == null)
          neurona.x = 0;
        arrayNeuronal.push(neurona);
      }
      return arrayNeuronal;
    }

  }])
