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

    //Stores the json to create the graph
    var jsonCopy;

    //Stores the neuron quantity of each type
    var numeroMosey = 0;
    var numeroGranulle = 0;
    var numeroPurkinje = 0;
    var numeroDcn = 0;
    var numeroGolgi = 0;
    var numeroIo = 0;
    var numeroTotalNeuronas = 0;

    //Stores the neurons of each type
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

    //Info about the total neurons of eacht type to display
    var infoTotal = 0;
    var infoMossy = 0;
    var infoGranulle = 0;
    var infoPurkinje = 0;
    var infoDCN = 0;
    var infoGolgi = 0;
    var infoIO = 0;

    //Language selected, spanish by default
    grafoFactory.spanish=true;
    grafoFactory.english=false;

    //active the slider for choosing visualization, afther the file is correctly loaded
    $scope.activateVisualization = function() {
      document.getElementById('color-esp').style.display = 'inline';
      document.getElementById('bn-esp').style.display = 'none';
      document.getElementById('color-eng').style.display = 'inline';
      document.getElementById('bn-eng').style.display = 'none';
    }

    //Initially, the visualization's slider if deactivate, until a file with neuron data is loaded
    $scope.deactivateVisualization = function() {
      document.getElementById('color-esp').style.display = 'none';
      document.getElementById('bn-esp').style.display = 'inline';
      document.getElementById('color-eng').style.display = 'none';
      document.getElementById('bn-eng').style.display = 'inline';
    }

    //Default deactivation for visualization slider
    $scope.deactivateVisualization();

    //If spanish language is selected, show all the info in spanish
    $scope.esp = function() {
      grafoFactory.spanish = true;
      grafoFactory.english = false;
      document.getElementById('idioma-eng').style.display = "none";
      document.getElementById('idioma-esp').style.display = "inline";
    }

    //If english language is selected, showw all the info in english
    $scope.eng = function() {
      grafoFactory.spanish = false;
      grafoFactory.english = true;
      document.getElementById('idioma-esp').style.display = "none";
      document.getElementById('idioma-eng').style.display = "inline";
    }

    //Conversion of a component to an hexadecimal value
    $scope.componentToHex = function(componente) {
      var cambio = componente.toString(16);
      return cambio.length == 1 ? "0" + cambio : cambio;
    }

    //Conversion from RGB to Hex
    $scope.hexToRGB = function(r,g,b) {
      var color = "#" + $scope.componentToHex(r) + $scope.componentToHex(g) + $scope.componentToHex(b);
      return color;
    }

    //Return the interpolation level to get the accuracy color
    $scope.GetInterpolationLevel = function(peso, pesoMax, pesoMin) {

      //First step: max weigth and weigth to compare, are subtracted the minimun one
      //This way its possible to find the correct proportional % if the min weigth is different from zero
      pesoMax = pesoMax - pesoMin;
      peso = peso - pesoMin;

      //Finally, its divided by 100 to get a value between 0 and 1
      var aux = Math.round((peso * 100) / pesoMax);
      return aux/100;
    }

    //Create the color interpolation
    $scope.interpolate = function(ratio, minR, minG, minB, maxR, maxG, maxB) {

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

    //Get the color for an edge
    $scope.getColor = function(peso, tipoOrigen, tipoDestino, origen, destino, arrayNeuronal) {
      var color;
      var ocultar = true;

      //Synapses with Mossy origin
      if (tipoOrigen=='0') {
        //Synapses Mossy-Granulle
        if (tipoDestino=='1') {
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
          arrayNeuronasA.push(origen);

          repetidoDestino = arrayNeuronasA.indexOf(destino);
          arrayNeuronasA.push(destino);

          var ratio = $scope.GetInterpolationLevel(peso, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolado = $scope.interpolate(ratio, 247, 0, 255, 72, 0, 66);
          color = $scope.hexToRGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
        //Synapses Mossy-Golgi
        if (tipoDestino == '4') {
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
          arrayNeuronasB.push(origen);

          repetidoDestino = arrayNeuronasB.indexOf(destino);
          arrayNeuronasB.push(destino);

          var ratio = $scope.GetInterpolationLevel(peso, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolado = $scope.interpolate(ratio, 64, 255, 0, 7, 72, 0);
          color = $scope.hexToRGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      //Synapses with Granulle origin
      if (tipoOrigen == '1') {
        //Synapses Granulle-Golgi
        if (tipoDestino == '4'){
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
          arrayNeuronasC.push(origen);

          repetidoDestino = arrayNeuronasC.indexOf(destino);
          arrayNeuronasC.push(destino);
          var ratio = $scope.GetInterpolationLevel(peso, grafoFactory.maxPesoGranulle, grafoFactory.minPesoGranulle);
          var interpolado = $scope.interpolate(ratio, 26, 0, 255, 0, 0, 72);
          color = $scope.hexToRGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      //Synapses with Golgi origin
      if (tipoOrigen == '4') {
        //Synapses Golgi-Granulle
        if (tipoDestino == '1') {
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
          arrayNeuronasD.push(origen);

          repetidoDestino = arrayNeuronasD.indexOf(destino);
          arrayNeuronasD.push(destino);
          var ratio = $scope.GetInterpolationLevel(peso, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolado = $scope.interpolate(ratio,255, 0, 0, 72, 0, 0);
          color = $scope.hexToRGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
        //Synapses Golgi-Golgi
        if (tipoDestino == '4') {
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
          arrayNeuronasE.push(origen);

          repetidoDestino = arrayNeuronasE.indexOf(destino);
          arrayNeuronasE.push(destino);
          var ratio = $scope.GetInterpolationLevel(peso, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolado = $scope.interpolate(ratio,255, 154, 0, 81, 55, 0);
          color = $scope.hexToRGB(interpolado[0],interpolado[1],interpolado[2]);
          ocultar = false;
        }
      }

      return [color, ocultar];
    }

    //Show the neuron info after loading the neuron file
    $scope.writeData = function(){

      //Show in spanish if active
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

      //Show in english if active
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
      $scope.activateVisualization();
    }

    //Remove the old info to set the new one at display
    $scope.reloadData = function() {
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

    //Get the color of the edges
    $scope.colorEdges = function(arrayNeuronal) {
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

    //Generate the JSON which let the creation of the graph
    $scope.generateJSON = function(arrayNeuronal) {

        var nombreArista = 0;
        var index=0;

        //Creation of the json object which stores the node and edge info
        var jsonObj = { nodes: [{}], edges: [{}]};

        //Gives the default values to the node variable
        function getNode() {
          return {
            id: "",
            label: "",
            x: "",
            y: "",
            size: ""
          }
        };

        //Gives the default values to the edge variable
        function getEdges() {
          return {
            id: "",
            source: "",
            target: ""
          }
        };

        //Creates the initial visualization json
        for (var i=0; i<arrayNeuronal.length; i++) {
          var nodo = getNode();

          //Mossy Fibers
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
              var arista = getEdges();
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
              var arista = getEdges();
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
              var arista = getEdges();
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
              var arista = getEdges();
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
              var arista = getEdges();
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
              var arista = getEdges();
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

        $scope.writeData();
        grafoFactory.saveArrayMossy(arrayMosey);
        grafoFactory.saveArrayGranulle(arrayGranulle);
        grafoFactory.saveArrayPurkinje(arrayPurkinje);
        grafoFactory.saveArrayDCN(arrayDCN);
        grafoFactory.saveArrayGolgi(arrayGolgi);
        grafoFactory.saveArrayIO(arrayIO);
        grafoFactory.saveJSON(jsonCopy);
        $scope.colorEdges(arrayNeuronal);
        $scope.cleanEdges(arrayNeuronal);
    }

    //Remove neurons which only connecton is with themselves
    $scope.cleanEdges = function(arrayNeuronal){
      for (var i=0; i<arrayNeuronal.length;i++) {
        if (arrayNeuronal[i].destino.length == 1) {
          jsonCopy.nodes[i].hidden = true;
        }
        if (arrayNeuronal[i].tipoConexion.length == 0) {
          jsonCopy.nodes[i].hidden = true;
        }
      }
    }

    //Counts all the neurons of each type and in total
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

    //Load all the info from the neuron file
    $scope.loadNeurons = function($fileContent) {
      var lineas = $fileContent.split("\n");
      var lineasLeidas = new Array();
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

      $scope.reloadData();


      for (var j=0; j<lineas.length; j++) {
        var aux = lineas[j].replace(/\s+/g, " ");

        //Check if there any comma at the string, and its replaced if is the case, for float operations
        aux = aux.replace(/,/g,".");

        //Check if there is a final line break to avoid errors
        if (aux != "") {
          lineasLeidas.push(aux);
        }
      }

      for (var i=0; i<lineasLeidas.length; i++) {
        palabrasPorLineas = lineasLeidas[i].split(" ");
        origen[i] = palabrasPorLineas[0];
        destino[i] = palabrasPorLineas[1];
        x[i] = palabrasPorLineas[2];
        y[i] = palabrasPorLineas[3];
        tipo[i] = palabrasPorLineas[5];
        peso[i] = palabrasPorLineas[6];
      }

      //Get the total neuron number in the file
      grafoFactory.numeroTotalNeuronas = $scope.getNeuronNumber(origen,destino);

      //Initializes array with a default value for all the neurons in the file
      //Initial value is ID equal to the neuron number, target the same neuron and weigth '0'
      arrayNeuronal = $scope.initializeArray(grafoFactory.numeroTotalNeuronas, arrayNeuronal,x, y);



      //Reading one by one each neuron and adding their target neuron and weigth
      for (var j=0; j<destino.length; j++) {
        var elementoRepetido = arrayNeuronal[origen[j]].destino.indexOf(destino[j]);
        if (elementoRepetido==-1) {
          var p = peso[j];
          arrayNeuronal[origen[j]].peso.push(p.toString());
          arrayNeuronal[origen[j]].destino.push(destino[j]); //Adding target
          var tipoAux = $scope.findNeuronType(destino[j],origen, tipo);
          arrayNeuronal[origen[j]].tipoDestino.push(tipoAux); //Adding type target
        }
      }

      //Getting neuron type
      for (var i=0; i<origen.length; i++) {
        var auxTipo = tipo[i];
        var auxPos = origen[i];

        //Initially each neuron has no type assigned, so it is given the first value founded as type, while
        //if there were any other type in the file (which would be an error in the file data)
        //the next are rejected to avoid multiple values for the type of the same neuron ()
        if (arrayNeuronal[auxPos].tipo == '-') {

          arrayNeuronal[auxPos].tipo = auxTipo;
        }
      }

      $scope.getInfo(arrayNeuronal);


      for (var i=0; i<(arrayNeuronal.length); i++) {
        var pesoPorDefecto = 0;
        if (arrayNeuronal[i].tipo == '-')
          arrayNeuronal[i].tipo = pesoPorDefecto.toString();
      }

      //Getting the neurons whose the present neuron is a target
      for (var i=0;i<arrayNeuronal.length;i++) {
        $scope.findTarget(arrayNeuronal, i);
      }
      grafoFactory.maxPesoMossey = $scope.getMaxWeigth(arrayNeuronal, 0);
      grafoFactory.maxPesoGranulle = $scope.getMaxWeigth(arrayNeuronal, 1);
      grafoFactory.maxPesoPurkinje = $scope.getMaxWeigth(arrayNeuronal, 2);
      grafoFactory.maxPesoDCN = $scope.getMaxWeigth(arrayNeuronal, 3);
      grafoFactory.maxPesoGolgi = $scope.getMaxWeigth(arrayNeuronal, 4);
      grafoFactory.maxPesoIO = $scope.getMaxWeigth(arrayNeuronal, 5);
      grafoFactory.minPesoMossey = $scope.getMinWeigth(arrayNeuronal, 0);
      grafoFactory.minPesoGranulle = $scope.getMinWeigth(arrayNeuronal, 1);
      grafoFactory.minPesoPurkinje = $scope.getMinWeigth(arrayNeuronal, 2);
      grafoFactory.minPesoDCN = $scope.getMinWeigth(arrayNeuronal, 3);
      grafoFactory.minPesoGolgi = $scope.getMinWeigth(arrayNeuronal, 4);
      grafoFactory.minPesoIO = $scope.getMinWeigth(arrayNeuronal, 5);
      grafoFactory.saveNeuronalArray(arrayNeuronal);
      $scope.generateJSON(arrayNeuronal);
    }

    //Get the neurons whose the present neuron is a target
    $scope.findTarget = function(arrayNeuronal, id) {
      for (var i=0;i<arrayNeuronal.length;i++){
        for (var j=0; j<arrayNeuronal[i].destino.length;j++) {
          var destino = arrayNeuronal[i].destino[j];
          if ((destino == id) && (id != arrayNeuronal[i].id)) {
            arrayNeuronal[id].esDestino.push(arrayNeuronal[i].id);
          }
        }
      }
    }

    //Get the minimun weigth readed in the file
    $scope.getMinWeigth = function(arrayNeuronal, tipo) {
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

    //Get the maximun weigth readed in the file
    $scope.getMaxWeigth = function(arrayNeuronal, tipo) {
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

    //Find the type of a selected neuron
    $scope.findNeuronType = function(neuronaDestino, origen, tipo) {
      var tipoDevuelto;
      for (var i=0; i<origen.length; i++) {
        if (neuronaDestino == origen[i])
          tipoDevuelto = tipo[i];
      }
      return tipoDevuelto;
    }

    //Search for the maximum neuron value in the file (source or target)
    $scope.getNeuronNumber = function(origen,destino) {
      var maximoOrigen = Math.max.apply(null,origen);
      var maximoDestino = Math.max.apply(null,destino);
      var max = Math.max(maximoOrigen, maximoDestino);
      max++;
      return max;
    }

    //Gives the initial values
    //It is created a cell for each of the neurons
    $scope.initializeArray = function(limite, arrayNeuronal, x, y) {
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
