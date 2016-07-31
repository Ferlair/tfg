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
    var mossyNumber = 0;
    var granulleNumber = 0;
    var purkinjeNumber = 0;
    var DCNNumber = 0;
    var golgiNumber = 0;
    var IONumber = 0;
    var totalNeuronNumber = 0;

    //Stores the neurons of each type
    var arrayMosey = [];
    var arrayGranulle = [];
    var arrayPurkinje = [];
    var arrayDCN = [];
    var arrayGolgi = [];
    var arrayIO = [];

    var ANeuronArray = [];
    var BNeuronArray = [];
    var CNeuronArray = [];
    var DNeuronArray = [];
    var ENeuronArray = [];

    var ASynapseArray = [];
    var BSynapseArray = [];
    var CSynapseArray = [];
    var DSynapseArray = [];
    var ESynapseArray = [];

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
    $scope.componentToHex = function(component) {
      var change = component.toString(16);
      return change.length == 1 ? "0" + change : change;
    }

    //Conversion from RGB to Hex
    $scope.hexToRGB = function(r,g,b) {
      var color = "#" + $scope.componentToHex(r) + $scope.componentToHex(g) + $scope.componentToHex(b);
      return color;
    }

    //Return the interpolation level to get the accuracy color
    $scope.GetInterpolationLevel = function(weigth, weigthMax, weigthMin) {

      //First step: max weigth and weigth to compare, are subtracted the minimun one
      //This way its possible to find the correct proportional % if the min weigth is different from zero
      weigthMax = weigthMax - weigthMin;
      weigth = weigth - weigthMin;

      //Finally, its divided by 100 to get a value between 0 and 1
      var aux = Math.round((weigth * 100) / weigthMax);
      return aux/100;
    }

    //Create the color interpolation
    $scope.interpolate = function(ratio, minR, minG, minB, maxR, maxG, maxB) {

      var r;
      var g;
      var b;

      var rangeR = (Math.abs(maxR-minR)) * ratio;
      var rangeG = (Math.abs(maxG-minG)) * ratio;
      var rangeB = (Math.abs(maxB-minB)) * ratio;

      r = maxR + Math.round(rangeR);
      g = maxG + Math.round(rangeG);
      b = maxB + Math.round(rangeB);

      return [r,g,b];
    }

    //Get the color for an edge
    $scope.getColor = function(weigth, sourceType, targetType, s, t, arrayNeuronal) {
      var color;
      var hide = true;

      //Synapses with Mossy origin
      if (sourceType =='0') {
        //Synapses Mossy-Granulle
        if (targetType=='1') {
          var sourceRepeated = arrayNeuronal[s].tipoConexion.indexOf('A');
          var targetRepeated = arrayNeuronal[t].tipoConexion.indexOf('A');

          if (sourceRepeated == -1)
          arrayNeuronal[s].tipoConexion.push('A');

          if (targetRepeated == -1)
          arrayNeuronal[t].tipoConexion.push('A');

          var source = "n"+s;
          var target = "n"+t;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= s;
          obj.destino = t;
          obj.enlace = id;

          ASynapseArray.push(obj);
          sourceRepeated = ANeuronArray.indexOf(s);
          ANeuronArray.push(s);

          targetRepeated = ANeuronArray.indexOf(t);
          ANeuronArray.push(t);

          var ratio = $scope.GetInterpolationLevel(weigth, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolated = $scope.interpolate(ratio, 247, 0, 255, 72, 0, 66);
          color = $scope.hexToRGB(interpolated[0],interpolated[1],interpolated[2]);
          hide = false;
        }
        //Synapses Mossy-Golgi
        if (targetType == '4') {
          var sourceRepeated = arrayNeuronal[s].tipoConexion.indexOf('B');
          var targetRepeated = arrayNeuronal[t].tipoConexion.indexOf('B');

          if (sourceRepeated == -1)
          arrayNeuronal[s].tipoConexion.push('B');

          if (targetRepeated == -1)
          arrayNeuronal[t].tipoConexion.push('B');

          var source = "n"+s;
          var target = "n"+t;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= s;
          obj.destino = t;
          obj.enlace = id;

          BSynapseArray.push(obj);
          sourceRepeated = BNeuronArray.indexOf(s);
          BNeuronArray.push(s);

          targetRepeated = BNeuronArray.indexOf(t);
          BNeuronArray.push(t);

          var ratio = $scope.GetInterpolationLevel(weigth, grafoFactory.maxPesoMossey, grafoFactory.minPesoMossey);
          var interpolated = $scope.interpolate(ratio, 64, 255, 0, 7, 72, 0);
          color = $scope.hexToRGB(interpolated[0],interpolated[1],interpolated[2]);
          hide = false;
        }
      }

      //Synapses with Granulle origin
      if (sourceType == '1') {
        //Synapses Granulle-Golgi
        if (targetType == '4'){
          var sourceRepeated = arrayNeuronal[s].tipoConexion.indexOf('C');
          var targetRepeated = arrayNeuronal[t].tipoConexion.indexOf('C');

          if (sourceRepeated == -1)
          arrayNeuronal[s].tipoConexion.push('C');

          if (targetRepeated == -1)
          arrayNeuronal[t].tipoConexion.push('C');

          var source = "n"+s;
          var target = "n"+t;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= s;
          obj.destino = t;
          obj.enlace = id;

          CSynapseArray.push(obj);
          sourceRepeated = CNeuronArray.indexOf(s);
          CNeuronArray.push(s);

          targetRepeated = CNeuronArray.indexOf(t);
          CNeuronArray.push(t);
          var ratio = $scope.GetInterpolationLevel(weigth, grafoFactory.maxPesoGranulle, grafoFactory.minPesoGranulle);
          var interpolated = $scope.interpolate(ratio, 26, 0, 255, 0, 0, 72);
          color = $scope.hexToRGB(interpolated[0],interpolated[1],interpolated[2]);
          hide = false;
        }
      }

      //Synapses with Golgi origin
      if (sourceType == '4') {
        //Synapses Golgi-Granulle
        if (targetType == '1') {
          var sourceRepeated = arrayNeuronal[s].tipoConexion.indexOf('D');
          var targetRepeated = arrayNeuronal[t].tipoConexion.indexOf('D');

          if (sourceRepeated == -1)
          arrayNeuronal[s].tipoConexion.push('D');

          if (targetRepeated == -1)
          arrayNeuronal[t].tipoConexion.push('D');

          var source = "n"+s;
          var target = "n"+t;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= s;
          obj.destino = t;
          obj.enlace = id;

          DSynapseArray.push(obj);
          sourceRepeated = DNeuronArray.indexOf(s);
          DNeuronArray.push(s);

          targetRepeated = DNeuronArray.indexOf(t);
          DNeuronArray.push(t);
          var ratio = $scope.GetInterpolationLevel(weigth, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolated = $scope.interpolate(ratio,255, 0, 0, 72, 0, 0);
          color = $scope.hexToRGB(interpolated[0],interpolated[1],interpolated[2]);
          hide = false;
        }
        //Synapses Golgi-Golgi
        if (targetType == '4') {
          var sourceRepeated = arrayNeuronal[s].tipoConexion.indexOf('E');
          var targetRepeated = arrayNeuronal[t].tipoConexion.indexOf('E');

          if (sourceRepeated == -1)
          arrayNeuronal[s].tipoConexion.push('E');

          if (targetRepeated == -1)
          arrayNeuronal[t].tipoConexion.push('E');

          var source = "n"+s;
          var target = "n"+t;
          var id = "e"+source+"+"+target;

          var obj = new Array();
          obj.origen= s;
          obj.destino = t;
          obj.enlace = id;

          ESynapseArray.push(obj);
          sourceRepeated = ENeuronArray.indexOf(s);
          ENeuronArray.push(s);

          targetRepeated = ENeuronArray.indexOf(t);
          ENeuronArray.push(t);
          var ratio = $scope.GetInterpolationLevel(weigth, grafoFactory.maxPesoGolgi, grafoFactory.minPesoGolgi);
          var interpolated = $scope.interpolate(ratio,255, 154, 0, 81, 55, 0);
          color = $scope.hexToRGB(interpolated[0],interpolated[1],interpolated[2]);
          hide = false;
        }
      }

      return [color, hide];
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
      var nodeToRemove = document.getElementById('especificaciones-esp');
        while (nodeToRemove.firstChild) {
            nodeToRemove.removeChild(nodeToRemove.firstChild);
        }

        var nodeToRemove = document.getElementById('especificaciones-eng');
          while (nodeToRemove.firstChild) {
              nodeToRemove.removeChild(nodeToRemove.firstChild);
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
      var source;
      var target;

      for (var i=1; i<jsonCopy.edges.length; i++) {
        source = jsonCopy.edges[i].source.substr(1);
        target = jsonCopy.edges[i].target.substr(1);

        if (source != target){
        var position =-1;
        var included = false;

        while (!included) {
          position++;
          included = arrayNeuronal[source].destino[position] == target;
        }

        var weigth = arrayNeuronal[source].peso[position];
        var sourceType = arrayNeuronal[source].tipo;
        var targetType = arrayNeuronal[source].tipoDestino[position];
        color = $scope.getColor(weigth, sourceType, targetType, source, target, arrayNeuronal);
        jsonCopy.edges[i].color = color[0];
        jsonCopy.edges[i].hidden = color[1];
        grafoFactory.arrayNeuronasA = ANeuronArray;
        grafoFactory.CNeuronArray = BNeuronArray;
        grafoFactory.arrayNeuronasC = CNeuronArray;
        grafoFactory.arrayNeuronasD = DNeuronArray;
        grafoFactory.arrayNeuronasE = ENeuronArray;
        grafoFactory.arrayConexionesA = ASynapseArray;
        grafoFactory.arrayConexionesB = BSynapseArray;
        grafoFactory.arrayConexionesC = CSynapseArray;
        grafoFactory.arrayConexionesD = DSynapseArray;
        grafoFactory.arrayConexionesE = ESynapseArray;
      }
      }
    }

    //Generate the JSON which let the creation of the graph
    $scope.generateJSON = function(arrayNeuronal) {

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
          var node = getNode();

          //Mossy Fibers
          if (arrayNeuronal[i].tipo == '0') {
            arrayMosey.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 1;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.000001;
            node.hidden = false;
            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }
            mossyNumber++;
            grafoFactory.mossyNumber = mossyNumber;
          }

          //Granulle Cells
          else if (arrayNeuronal[i].tipo == '1'){
            arrayGranulle.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 4;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.001;
            node.hidden = false;

            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }

            granulleNumber++;
            grafoFactory.granulleNumber = granulleNumber;
          }

          //Purkinje Cells
          else if(arrayNeuronal[i].tipo == '2') {
            arrayPurkinje.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 6;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.0003;
            node.hidden = false;

            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }

            purkinjeNumber++;
            grafoFactory.purkinjeNumber = purkinjeNumber;
          }

          //DCN Cells
          else if(arrayNeuronal[i].tipo == '3'){
            arrayDCN.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 8;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.0004;
            node.hidden = false;

            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }

            DCNNumber++;
            grafoFactory.DCNNumber = DCNNumber;
          }

          //Golgi Cells
          else if(arrayNeuronal[i].tipo == '4'){
            arrayGolgi.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 10;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.0005;
            node.hidden = false;

            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }

            golgiNumber++;
            grafoFactory.golgiNumber = golgiNumber;
          }

          //IO Cells
          else if(arrayNeuronal[i].tipo == '5'){
            arrayIO.push(arrayNeuronal[i].id);
            node.id = "n"+arrayNeuronal[i].id;
            node.label = "neurona "+arrayNeuronal[i].id;
            var radius = 12;
            var angle = (arrayNeuronal[i].x)*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            node.x=x;
            node.y=y;
            node.size = 0.006;
            node.hidden = false;

            jsonObj.nodes[i] = node;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var edge = getEdges();
              edge.source="n"+arrayNeuronal[i].id;
              edge.target="n"+arrayNeuronal[i].destino[j];
              edge.id="e"+ edge.source+'+'+edge.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = edge;
              }
              else {
                jsonObj.edges.push(edge);
              }
            }

            IONumber++;
            grafoFactory.IONumber = IONumber;
          }



          totalNeuronNumber++;
          grafoFactory.numeroTotalNeuronas = totalNeuronNumber;

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
      var lines = $fileContent.split("\n");
      var splittedLines = new Array();
      var wordsByLine;
      var source = [];
      var target = [];
      var x = [];
      var y = [];
      var type = [];
      var weigth = [];
      var arrayNeuronal = new Array();
      //var tipoDestino = [];
      //var tipoConexion = [];

      $scope.reloadData();


      for (var j=0; j<lines.length; j++) {
        var aux = lines[j].replace(/\s+/g, " ");

        //Check if there any comma at the string, and its replaced if is the case, for float operations
        aux = aux.replace(/,/g,".");

        //Check if there is a final line break to avoid errors
        if (aux != "") {
          splittedLines.push(aux);
        }
      }

      for (var i=0; i<splittedLines.length; i++) {
        wordsByLine = splittedLines[i].split(" ");
        source[i] = wordsByLine[0];
        target[i] = wordsByLine[1];
        x[i] = wordsByLine[2];
        y[i] = wordsByLine[3];
        type[i] = wordsByLine[5];
        weigth[i] = wordsByLine[6];
      }

      //Get the total neuron number in the file
      grafoFactory.numeroTotalNeuronas = $scope.getNeuronNumber(source,target);

      //Initializes array with a default value for all the neurons in the file
      //Initial value is ID equal to the neuron number, target the same neuron and weigth '0'
      arrayNeuronal = $scope.initializeArray(grafoFactory.numeroTotalNeuronas, arrayNeuronal,x, y);



      //Reading one by one each neuron and adding their target neuron and weigth
      for (var j=0; j<target.length; j++) {
        var repeatedElem = arrayNeuronal[source[j]].destino.indexOf(target[j]);
        if (repeatedElem==-1) {
          var p = weigth[j];
          arrayNeuronal[source[j]].peso.push(p.toString());
          arrayNeuronal[source[j]].destino.push(target[j]); //Adding target
          var auxType = $scope.findNeuronType(target[j],source, type);
          arrayNeuronal[source[j]].tipoDestino.push(auxType); //Adding type target
        }
      }

      //Getting neuron type
      for (var i=0; i<source.length; i++) {
        var auxType = type[i];
        var auxPos = source[i];

        //Initially each neuron has no type assigned, so it is given the first value founded as type, while
        //if there were any other type in the file (which would be an error in the file data)
        //the next are rejected to avoid multiple values for the type of the same neuron ()
        if (arrayNeuronal[auxPos].tipo == '-') {

          arrayNeuronal[auxPos].tipo = auxType;
        }
      }

      $scope.getInfo(arrayNeuronal);


      for (var i=0; i<(arrayNeuronal.length); i++) {
        var defaultWeigth = 0;
        if (arrayNeuronal[i].tipo == '-')
          arrayNeuronal[i].tipo = defaultWeigth.toString();
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
          var target = arrayNeuronal[i].destino[j];
          if ((target == id) && (id != arrayNeuronal[i].id)) {
            arrayNeuronal[id].esDestino.push(arrayNeuronal[i].id);
          }
        }
      }
    }

    //Get the minimun weigth readed in the file
    $scope.getMinWeigth = function(arrayNeuronal, type) {
      var min = 0;

      for (var i=0; i<arrayNeuronal.length; i++) {
        if (arrayNeuronal[i].tipo == type) {
          for (var j=0; j<arrayNeuronal[i].peso.length; j++) {
            var minType = Math.min.apply(null,arrayNeuronal[i].peso);
            min = Math.min(min, minType);
          }
        }
      }

      return min;
    }

    //Get the maximun weigth readed in the file
    $scope.getMaxWeigth = function(arrayNeuronal, type) {
      var max = 0;

      for (var i=0; i<arrayNeuronal.length; i++) {

        if (arrayNeuronal[i].tipo == type) {

          for (var j=0; j<arrayNeuronal[i].peso.length; j++) {
            var maxType = Math.max.apply(null,arrayNeuronal[i].peso);
            max = Math.max(max,maxType);
          }

        }

      }
      return max;
    }

    //Find the type of a selected neuron
    $scope.findNeuronType = function(targetNeuron, source, type) {
      var returnedType;
      for (var i=0; i<source.length; i++) {
        if (targetNeuron == source[i])
          returnedType = type[i];
      }
      return returnedType;
    }

    //Search for the maximum neuron value in the file (source or target)
    $scope.getNeuronNumber = function(source,target) {
      var maxSource = Math.max.apply(null,source);
      var maxTarget = Math.max.apply(null,target);
      var max = Math.max(maxSource, maxTarget);
      max++;
      return max;
    }

    //Gives the initial values
    //It is created a cell for each of the neurons
    $scope.initializeArray = function(limit, arrayNeuronal, x, y) {
      var defaultType = '-';
      for (var i=0; i<limit; i++) {
        var neuron = new Array();
        var initialWeigth = 0;
        neuron.destino = [];
        neuron.peso = [];
        neuron.tipoDestino = [];
        neuron.tipoConexion = [];
        neuron.esDestino = [];
        neuron.id = i.toString();
        neuron.destino.push(i.toString());
        neuron.peso.push(initialWeigth.toString());
        neuron.tipoDestino.push(defaultType.toString());
        neuron.tipo = '-';
        neuron.x = x[i];
        if (neuron.x == null)
          neuron.x = 0;
        arrayNeuronal.push(neuron);
      }
      return arrayNeuronal;
    }

  }])
