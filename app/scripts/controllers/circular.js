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

    //Store each neuron type at the HTML DOM
    var mosey = document.getElementById('1');
    var granulle = document.getElementById('2');
    var purkinje = document.getElementById('3');
    var dcn = document.getElementById('4');
    var golgi = document.getElementById('5');
    var io = document.getElementById('6');

    //Store each synapse type at the HTML DOM
    var mfgr = document.getElementById('MFGR');
    var mfgo = document.getElementById('MFGO');
    var grgo = document.getElementById('GRGO');
    var gogr = document.getElementById('GOGR');
    var gogo = document.getElementById('GOGO');

    //Stores the json file that creates the graph
    var jsonCopy;

    //Stores all the information about the neurons in the file and their info
    var arrayNeuronal;

    //This array is used to store information about the neurons to visualize
    //in a range selected in individual selection
    var arrayRange = new Array();

    //aux arrays for each neuron type
    var arrayMosey;
    var arrayGranulle;
    var arrayPurkinje;
    var arrayDCN;
    var arrayGolgi;
    var arrayIO;

    //Stores a counter for each neuron to avoid hiding errors with several filters
    var neuronCounterArray = new Array();

    //Stats info
    var arrayInfo = new Array();

    //Get all the initial references from grafoFactory
    $scope.getReferences = function() {

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

    //Returns the position of an edge inside graph's json
    $scope.searchEdge = function (source, target){
      var searchingName = 'en'+source+'+'+'n'+target;
      var pos;
      for (var i=0; i<jsonCopy.edges.length; i++) {
        var id= jsonCopy.edges[i].id;
        if (id == searchingName)
            pos = i;
      }
      return pos;
    }

    //Initializes the stats array
    $scope.initStatsArray = function() {
      var a = new Array();
      for (var i=0;i<grafoFactory.numeroTotalNeuronas;i++) {
        a.push(0);
      }
      return a;
    }

    //Initializes the connections array, where each array represents a synapse type, being:
    //arrayConexionesA: stores all the synapses between Mossy-Granulle neurons
    //arrayConexionesB: stores all the synapses between Mossy-Golgi neurons
    //arrayConexionesC: stores all the synapses between Granulle-Golgi neurons
    //arrayConexionesD: stores all the synapses between Golgi-Granulle neurons
    //arrayConexionesE: stores all the synapses between Golgi-Golgi neurons
    $scope.initConnectionsArray = function(synapseArray) {
      for (var i=0;i<grafoFactory.numeroTotalNeuronas;i++) {
        synapseArray[i]=0;
      }
      for (var j=0;j<grafoFactory.arrayConexionesA.length;j++) {
        synapseArray[grafoFactory.arrayConexionesA[j].origen]++;
        synapseArray[grafoFactory.arrayConexionesA[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesB.length;j++) {
        synapseArray[grafoFactory.arrayConexionesB[j].origen]++;
        synapseArray[grafoFactory.arrayConexionesB[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesC.length;j++) {
        synapseArray[grafoFactory.arrayConexionesC[j].origen]++;
        synapseArray[grafoFactory.arrayConexionesC[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesD.length;j++) {
        synapseArray[grafoFactory.arrayConexionesD[j].origen]++;
        synapseArray[grafoFactory.arrayConexionesD[j].destino]++;
      }
      for (var j=0;j<grafoFactory.arrayConexionesE.length;j++) {
        synapseArray[grafoFactory.arrayConexionesE[j].origen]++;
        synapseArray[grafoFactory.arrayConexionesE[j].destino]++;
      }
      return synapseArray;
    }

    //Establishes the initial state of the app
    $scope.init = function() {

      refresh();
      jsonCopy = grafoFactory.loadJSON();
      arrayNeuronal = grafoFactory.loadNeuronalArray();
      arrayMosey = grafoFactory.loadArrayMossy();
      arrayGranulle = grafoFactory.loadArrayGranulle();
      arrayPurkinje = grafoFactory.loadArrayPurkinje();
      arrayDCN = grafoFactory.loadArrayDCN();
      arrayGolgi = grafoFactory.loadArrayGolgi();
      arrayIO = grafoFactory.loadArrayIO();
      $scope.getReferences();
      neuronCounterArray = $scope.initConnectionsArray(neuronCounterArray);
      arrayInfo = $scope.initStatsArray();
      grafoFactory.load(jsonCopy);
    }

    $scope.init();

    //Restart 'container' element
    //Clean the canvas before showing a new graph
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

    //Show all the edges and their states (hidden or showed) on console
    $scope.showEdges = function(){
      console.log;
      console.log;
      console.log('-----------------------');
      for (var i=0;i<jsonCopy.edges.length;i++) {
        var id = jsonCopy.edges[i].id;
        var value = jsonCopy.edges[i].hidden;
        console.log('| '+id+' | '+value+' |');
        console.log('-----------------------');
      }
      console.log('-----------------------');
    }

    //Show all the nodes and their states (hidden or showed) on console
    $scope.showNodes = function(){
      console.log;
      console.log;
      console.log('-----------------------');
      for (var i=0;i<jsonCopy.nodes.length;i++) {
        var id = jsonCopy.nodes[i].id;
        var value = jsonCopy.nodes[i].hidden;
        console.log('| '+id+' | '+value+' |');
        console.log('-----------------------');
      }
      console.log('-----------------------');
    }

    //Check whether the id neuron has any visible edge
    //The neuron is removed if it has no any visible edge
    $scope.checkNoEdges = function(id){
      var hide = true;

      for (var i=0; i<arrayNeuronal[id].destino.length; i++) {
        var auxHide;
        var target = arrayNeuronal[id].destino[i];
        var pos = $scope.searchEdge(id, target);
        auxHide = jsonCopy.edges[pos].hidden;
        hide = auxHide;
      }
      if (hide && (arrayNeuronal[id].esDestino.length>0)) {
        for (var i=0; i<arrayNeuronal[id].esDestino.length;i++){
          var target = arrayNeuronal[id].esDestino[i];
          var pos = $scope.searchEdge(target, id);
          hide = jsonCopy.edges[pos].hidden;
        }
      }

      if (!hide) {
        jsonCopy.nodes[id].hidden = false;
      }

      if (hide) {
        jsonCopy.nodes[id].hidden = true;
      }

    }

    //Show/hide Mossy neurons
    $scope.checkMossy = function() {
      var minMossy = $scope.sliderMosey.min;
      var maxMossy = $scope.sliderMosey.max;

      //If mossy is deactivated, all its neurons will be hidden
      if (!mosey.checked) {
        for (var i=0; i<arrayMosey.length; i++) {
          jsonCopy.nodes[arrayMosey[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayMosey[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var target = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var target = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }

        }

        //ID and weigth slider filters are disabled now
        document.getElementById('idmosey').style.pointerEvents = "none";
        document.getElementById('sliderPesoMosey').style.pointerEvents = "none";
      }

      //if Mossy is activated, there are showed just the neurons within the interval of the slider
      //i.e. minMossy and maxMossy, both included
      else {
          for (var j=0; j<arrayMosey.length; j++) {
              if (arrayMosey[j] >= minMossy && arrayMosey[j] <= maxMossy) {
                jsonCopy.nodes[arrayMosey[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayMosey[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayMosey[j]].hidden = true;

                var source = arrayMosey[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }

                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }
          }

          //Enable the ID and weigth slider filters
          document.getElementById('idmosey').style.pointerEvents = "auto";
          document.getElementById('sliderPesoMosey').style.pointerEvents = "auto";
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Show/hide Granulle neurons
    $scope.checkGranulle = function() {
      var inicioGranulle = $scope.sliderGranulle.min;
      var finalGranulle = $scope.sliderGranulle.max;

      //If granulle is deactivated, all its neurons will be hidden
      if (!granulle.checked) {

        for (var i=0; i<arrayGranulle.length; i++) {
          jsonCopy.nodes[arrayGranulle[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayGranulle[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var target = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var target = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idgranulle").style.pointerEvents = "none";
        document.getElementById("sliderPesoGranulle").style.pointerEvents = "none";
      }

      //if Granulle is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioGranulle and finalGranulle, both included
      else {

          for (var j=0; j<arrayGranulle.length; j++) {
              if (arrayGranulle[j] >= inicioGranulle && arrayGranulle[j] <= finalGranulle) {

                jsonCopy.nodes[arrayGranulle[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayGranulle[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayGranulle[j]].hidden = true;


                var source = arrayGranulle[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }

                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }
          }



          //Enable the ID and weigth slider filters
          document.getElementById('idgranulle').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGranulle').style.pointerEvents = "auto";
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Show/hide Purkinje neurons
    $scope.checkPurkinje = function() {
      var inicioPurkinje = $scope.sliderPurkinje.min;
      var finalPurkinje = $scope.sliderPurkinje.max;

      //If purkinje is deactivated, all its neurons will be hidden
      if (!purkinje.checked) {
        for (var i=0; i<arrayPurkinje.length; i++) {
          jsonCopy.nodes[arrayPurkinje[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayPurkinje[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var target = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var target = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idpurkinje").style.pointerEvents = "none";
        document.getElementById("sliderPesoPurkinje").style.pointerEvents = "none";
      }

      //if Purkinje is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioPurkinje and finalPurkinje, both included
      else {
          for (var j=0; j<arrayPurkinje.length; j++) {
              if (arrayPurkinje[j] >= inicioPurkinje && arrayPurkinje[j] <= finalPurkinje) {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayPurkinje[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = true;


                var source = arrayPurkinje[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('idpurkinje').style.pointerEvents = "auto";
          document.getElementById('sliderPesoPurkinje').style.pointerEvents = "auto";
      }
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Show/hide DCN neurons
    $scope.checkDCN = function() {
      var inicioDCN = $scope.sliderDCN.min;
      var finalDCN = $scope.sliderDCN.max;

      //If DCN is deactivated, all its neurons will be hidden
      if (!dcn.checked) {
        for (var i=0; i<arrayDCN.length; i++) {
          jsonCopy.nodes[arrayDCN[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayDCN[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var target = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var target = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("iddcn").style.pointerEvents = "none";
        document.getElementById("sliderPesoDCN").style.pointerEvents = "none";
      }

      //if DCN is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioDCN and finalDCN, both included
      else {
          for (var j=0; j<arrayDCN.length; j++) {

              if (arrayDCN[j] >= inicioDCN && arrayDCN[j] <= finalDCN) {
                jsonCopy.nodes[arrayDCN[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayDCN[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayDCN[j]].hidden = true;


                var source = arrayDCN[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('iddcn').style.pointerEvents = "auto";
          document.getElementById('sliderPesoDCN').style.pointerEvents = "auto";
      }
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Show/hide Golgi neurons
    $scope.checkGolgi = function() {
      var inicioGolgi = $scope.sliderGolgi.min;
      var finalGolgi = $scope.sliderGolgi.max;

      //If Golgi is deactivated, all its neurons will be hidden
      if (!golgi.checked) {
        for (var i=0; i<arrayGolgi.length; i++) {
          jsonCopy.nodes[arrayGolgi[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayGolgi[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var target = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var target = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idgolgi").style.pointerEvents = "none";
        document.getElementById("sliderPesoGolgi").style.pointerEvents = "none";
      }

      //if Golgi is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioGolgi and finalGolgi, both included
      else {
          for (var j=0; j<arrayGolgi.length; j++) {
              if (arrayGolgi[j] >= inicioGolgi && arrayGolgi[j] <= finalGolgi) {
                jsonCopy.nodes[arrayGolgi[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayGolgi[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayGolgi[j]].hidden = true;


                var source = arrayGolgi[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var target = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var target = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('idgolgi').style.pointerEvents = "auto";
          document.getElementById('sliderPesoGolgi').style.pointerEvents = "auto";
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Show/hide IO neurons
    $scope.checkIO = function() {
      var inicioIO = $scope.sliderIO.min;
      var finalIO = $scope.sliderIO.max;

      //If IO is deactivated, all its neurons will be hidden
      if (!io.checked) {
        for (var i=0; i<arrayIO.length; i++) {
          jsonCopy.nodes[arrayIO[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayIO[i];
          for (var j=0; j<arrayNeuronal[source].destino.length;j++) {
            var destino = arrayNeuronal[source].destino[j];
            var pos = $scope.searchEdge(source, destino);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].esDestino.length;j++){
            var destino = arrayNeuronal[source].esDestino[j];
            var pos = $scope.searchEdge(destino, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(destino);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idio").style.pointerEvents = "none";
        document.getElementById("sliderPesoIO").style.pointerEvents = "none";
      }

      //if IO is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioIO and finalIO, both included
      else {
          for (var j=0; j<arrayIO.length; j++) {
              if (arrayIO[j] >= inicioIO && arrayIO[j] <= finalIO) {
                jsonCopy.nodes[arrayIO[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayIO[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var destino = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, destino);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var destino = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(destino, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[destino].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayIO[j]].hidden = true;


                var source = arrayIO[j];
                for (var z=0; z<arrayNeuronal[source].destino.length;z++) {
                  var destino = arrayNeuronal[source].destino[z];
                  var pos = $scope.searchEdge(source, destino);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].esDestino.length;z++){
                  var destino = arrayNeuronal[source].esDestino[z];
                  var pos = $scope.searchEdge(destino, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(destino);
                }
              }
          }

          //Enable the ID and weigth slider filters
          document.getElementById('idio').style.pointerEvents = "auto";
          document.getElementById('sliderPesoIO').style.pointerEvents = "auto";
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Clean the text area at manual selection and the previous selections
    $scope.restore = function() {
      document.getElementById('inputNeuronas').value="";

      //All the neurons will be showed
      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[arrayNeuronal[i].id].hidden = false;
      }

      //The array of selections is empty
      while(arrayRange.length > 0) {
        arrayRange.pop();
      }

      var arrayNeuronInfo = new Array();
      grafoFactory.setArrayPrueba(arrayNeuronInfo);
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Controllers for the sliders
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

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeMoseyWeigth = function() {
      var minWeigth = $scope.sliderPesoMosey.min;
      var maxWeigth = $scope.sliderPesoMosey.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoMossey*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoMossey*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayMosey.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayMosey[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayMosey[i]].peso[j];
          var source = arrayNeuronal[arrayMosey[i]].id;
          var target = arrayNeuronal[arrayMosey[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayMosey.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayMosey[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayMosey[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeGranulleWeigth = function () {
      var minWeigth = $scope.sliderPesoGranulle.min;
      var maxWeigth = $scope.sliderPesoGranulle.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoGranulle*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoGranulle*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayGranulle.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGranulle[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayGranulle[i]].peso[j];
          var source = arrayNeuronal[arrayGranulle[i]].id;
          var target = arrayNeuronal[arrayGranulle[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayGranulle.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGranulle[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayGranulle[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changePurkinjeWeigth = function () {
      var minWeigth = $scope.sliderPesoPurkinje.min;
      var maxWeigth = $scope.sliderPesoPurkinje.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoPurkinje*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoPurkinje*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayPurkinje.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayPurkinje[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayPurkinje[i]].peso[j];
          var source = arrayNeuronal[arrayPurkinje[i]].id;
          var target = arrayNeuronal[arrayPurkinje[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayPurkinje.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayPurkinje[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayPurkinje[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeDCNWeigth = function () {
      var minWeigth = $scope.sliderPesoDCN.min;
      var maxWeigth = $scope.sliderPesoDCN.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoDCN*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoDCN*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayDCN.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayDCN[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayDCN[i]].peso[j];
          var source = arrayNeuronal[arrayDCN[i]].id;
          var target = arrayNeuronal[arrayDCN[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayDCN.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayDCN[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayDCN[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeGolgiWeigth = function () {
      var minWeigth = $scope.sliderPesoGolgi.min;
      var maxWeigth = $scope.sliderPesoGolgi.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoGolgi*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoGolgi*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayGolgi.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGolgi[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayGolgi[i]].peso[j];
          var source = arrayNeuronal[arrayGolgi[i]].id;
          var target = arrayNeuronal[arrayGolgi[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayGolgi.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGolgi[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayGolgi[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeIOWeigth = function () {
      var minWeigth = $scope.sliderPesoIO.min;
      var maxWeigth = $scope.sliderPesoIO.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = grafoFactory.minPesoIO*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = grafoFactory.maxPesoIO*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayIO.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayIO[i]].peso.length;j++) {
          var weigth = arrayNeuronal[arrayIO[i]].peso[j];
          var source = arrayNeuronal[arrayIO[i]].id;
          var target = arrayNeuronal[arrayIO[i]].destino[j];
          var pos = $scope.searchEdge(source, target);
          if (weigth >=minWeigth && weigth<=maxWeigth) {
            jsonCopy.edges[pos].hidden = false;
          }
          else {
            jsonCopy.edges[pos].hidden = true;
          }
        }
      }

      //Check if there are no neurons whithout any edge, remove if that's the case
      for (var i=0; i<arrayIO.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayIO[i]].peso.length;j++) {
          var target = arrayNeuronal[arrayIO[i]].destino[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    /*$scope.mostrarPeso = function() {
      if (spanish) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      if (english) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      $scope.restore();
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
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }
      $scope.restore();
    }*/

    /*$scope.mostrarSeleccionManual = function() {
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
    }*/

    //Function to go back in the app's UI
    $scope.back = function(value){
      if (value == 1) {
        document.getElementById('seleccion_neuronas').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value == 2) {
        document.getElementById('seleccion_grupos').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value == 3) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value == 4) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value ==5) {
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value == 6) {
        document.getElementById('registro').style.display = "none";
        document.getElementById('seleccion_filtros').style.display = "inline";
      }

      if (value == 7) {
        document.getElementById('estadisticas_n').style.display = "none";
        document.getElementById('registro').style.display = "inline";
      }

      if (value == 8) {
        document.getElementById('estadisticas_a').style.display = "none";
        document.getElementById('registro').style.display = "inline";
      }
    }

    //Function to display the desired option selected in the UI
    $scope.display = function(value) {
      document.getElementById('seleccion_filtros').style.display = "none";

      //Show select by neuronal type
      if (value == 1) {
        document.getElementById('seleccion_neuronas').style.display = "inline";
      }

      //Show select by synapse type
      if (value == 2) {
        document.getElementById('seleccion_grupos').style.display = "inline";
      }

      //Show the ID slider filter
      if (value == 3) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }

      //Show the weigth slider filter
      if (value == 4) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.display = "none";
        document.getElementById('sliderPeso').style.visibility = "visible";
        document.getElementById('sliderPeso').style.display = "inline";
        document.getElementById('seleccion_neuronas').style.pointerEvents = "auto";
      }

      //Show the individual selection window
      if (value == 5) {
        document.getElementById('sliderPeso').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('seleccionManual').style.visibility = "visible";
        document.getElementById('seleccionManual').style.display = "inline";
        document.getElementById('inputNeuronas').value="";
      }

      //Show the selecting log window
      if (value == 6) {
        document.getElementById('registro').style.display = "inline";
      }

      //Show the neuron stats
      if (value == 8) {
        document.getElementById('registro').style.display = "none";
        document.getElementById('log_a').style.display = "inline";
      }
    }

    //Returns all the targets for a selected neuron
    $scope.getTargets = function(neurona) {
      var result;
      var iterations = arrayNeuronal[neurona].destino.length;

      for (var i=0; i<iterations;i++) {
        var aux = arrayNeuronal[neurona].destino[i];
        aux = aux.toString();

        if (i==0) {
          result = aux;
        }
        else {
          result = result + ',' + aux;
        }
      }
      return result;
    }

    //Set all the synapses checked/unchecked
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
      $scope.checkCounterA();
      $scope.checkCounterB();
      $scope.checkCounterC();
      $scope.checkCounterD();
      $scope.checkCounterE();
    }

    //When the user inserts a range at the individual selection, this function
    //show all the neurons inside that interval
    $scope.filteringByRange = function() {
      var selectionString = document.getElementById("inputNeuronas").value;
      var sourceFilter = selectionString.split('-');
      var minRange = parseInt(sourceFilter[0]);
      var maxRange = parseInt(sourceFilter[1]);
      var sourcesArray = new Array();
      var dataArray = new Array();

      //Checking valid insert data
      //minRange must be smaller than maxRange
      //minRange must be greater or equal than the lower value of the available data
      //maxRange must be smaller or equal than the upper value of the available data
      var min = parseInt(arrayNeuronal[0].id);
      var max= parseInt(arrayNeuronal[arrayNeuronal.length-1].id);
      if (minRange<=maxRange) {
        if (minRange>=min) {
          if (maxRange<=max) {

            //Get all the origin neurons of the obtained range
            var i=0;
            while (minRange<=maxRange) {
              sourcesArray[i] = minRange;
              i++;
              minRange++;
            }

            //Search for all the targets of the selected neurons
            for (var i=0; i<sourcesArray.length;i++) {
              var sourceNeuron = sourcesArray[i];
              dataArray.push($scope.getTargets(sourceNeuron));
            }

            for (var i=0; i<dataArray.length;i++) {
                var auxN = dataArray[i];
                auxN = auxN.split(',');
                for (var j=0; j<auxN.length;j++) {
                  var auxJ = auxN[j];
                  arrayRange.push(auxJ);
                }

            }

            for (var i=0; i<arrayNeuronal.length;i++) {
              jsonCopy.nodes[i].hidden = true;
            }

            for (var i=0; i<arrayRange.length;i++) {
              var aux = parseInt(arrayRange[i]);
              jsonCopy.nodes[aux].hidden=false;
            }
            refresh();
            grafoFactory.load(jsonCopy);
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

    //Shows all the neurons selected at the individual select window
    $scope.manualFiltering = function(selectionString) {
      var sourceFilter = selectionString.split(',');
      var min = parseInt(arrayNeuronal[0].id);
      var max = parseInt(arrayNeuronal[arrayNeuronal.length-1].id);
      var stop = false;
      var dataArray = new Array();
      var j=0;

      while (j<sourceFilter.length && !stop) {

        if (sourceFilter[j] < min) {
          if (grafoFactory.spanish) {
            alert('ERROR: el valor inferior del rango introducido es menor que el valor mínimo de id disponible');
          }

          else if (grafoFactory.english) {
            alert('ERROR: The lower value of the entered range is smaller than the minimun id value available');
          }
          stop = true;
        }

        else if (sourceFilter[j] > max) {
          if (grafoFactory.spanish) {
            alert('ERROR: el valor superior del rango introducido es mayor que el valor máximo de id disponible');
          }
          else if (grafoFactory.english) {
            alert('ERROR: The upper value of the entered range is greater than the maximun id value available');
          }
          stop = true;
        }
        j++;
      }

      if (!stop) {

      for (var i=0; i<sourceFilter.length;i++) {
        var sourceNeuron = sourceFilter[i];
        dataArray.push($scope.getTargets(sourceNeuron));
      }

      for (var i=0; i<dataArray.length;i++) {
          var auxN = dataArray[i];
          auxN = auxN.split(',');
          for (var j=0; j<auxN.length;j++) {
            var auxJ = auxN[j];
            arrayRange.push(auxJ);
          }

      }

      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[i].hidden = true;
      }

      for (var i=0; i<arrayRange.length;i++) {
        var aux = parseInt(arrayRange[i]);
        jsonCopy.nodes[aux].hidden=false;
      }
      refresh();
      grafoFactory.load(jsonCopy);
    }
    }

    //Adjust the counter of the mf-gr synapses for a well-structured visualization
    $scope.checkCounterA = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasA.length; i++) {
        if (mfgr.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasA[i]]++;
        }
        if (!mfgr.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasA[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the mf-go synapses for a well-structured visualization
    $scope.checkCounterB = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasB.length; i++) {
        if (mfgo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasB[i]]++;
        }
        if (!mfgo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasB[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the gr-go synapses for a well-structured visualization
    $scope.checkCounterC = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasC.length; i++) {
        if (grgo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasC[i]]++;
        }
        if (!grgo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasC[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the go-gr synapses for a well-structured visualization
    $scope.checkCounterD = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasD.length; i++) {
        if (gogr.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasD[i]]++;
        }
        if (!gogr.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasD[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the go-go synapses for a well-structured visualization
    $scope.checkCounterE = function() {
      for (var i=0; i<grafoFactory.arrayNeuronasE.length; i++) {
        if (gogo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasE[i]]++;
        }
        if (!gogo.checked) {
          neuronCounterArray[grafoFactory.arrayNeuronasE[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Chech whether if the neuron can be removed according to the neuronCounterArray
    //If the neuron at neuronCounterArray has a 0 value, it can be removed
    //with a value grater than 0, removal of the neuron is forbidden
    $scope.checkRemoval = function (neuronToRemove) {
      var permit = false;
      var aux = neuronCounterArray[neuronToRemove];

      if (aux == 0)
        permit = true;

      return permit;
    }

    //Generate the visualization of the synapses group
    $scope.showConnections = function() {

      if (!mfgr.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasA.length;i++) {
          var permisoEliminar = $scope.checkRemoval(grafoFactory.arrayNeuronasA[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasA[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesA.length;j++) {
          var id = grafoFactory.arrayConexionesA[j].enlace; //NO SE USA!
          var origen = grafoFactory.arrayConexionesA[j].origen;
          var destino = grafoFactory.arrayConexionesA[j].destino;
          var pos = $scope.searchEdge(origen, destino);
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

          var pos = $scope.searchEdge(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!mfgo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasB.length;i++) {
          var permisoEliminar = $scope.checkRemoval(grafoFactory.arrayNeuronasB[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasB[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesB.length;j++) {
          var id = grafoFactory.arrayConexionesB[j].enlace;
          var origen = grafoFactory.arrayConexionesB[j].origen;
          var destino = grafoFactory.arrayConexionesB[j].destino;

          var pos = $scope.searchEdge(origen, destino);

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

          var pos = $scope.searchEdge(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!grgo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasC.length;i++) {
          var permisoEliminar = $scope.checkRemoval(grafoFactory.arrayNeuronasC[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasC[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesC.length;j++) {
          var id = grafoFactory.arrayConexionesC[j].enlace;
          var origen = grafoFactory.arrayConexionesC[j].origen;
          var destino = grafoFactory.arrayConexionesC[j].destino;

          var pos = $scope.searchEdge(origen, destino);

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

          var pos = $scope.searchEdge(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogr.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasD.length;i++) {
          var permisoEliminar = $scope.checkRemoval(grafoFactory.arrayNeuronasD[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasD[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesD.length;j++) {
          var id = grafoFactory.arrayConexionesD[j].enlace;
          var origen = grafoFactory.arrayConexionesD[j].origen;
          var destino = grafoFactory.arrayConexionesD[j].destino;

          var pos = $scope.searchEdge(origen, destino);

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

          var pos = $scope.searchEdge(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogo.checked) {
        for (var i=0; i<grafoFactory.arrayNeuronasE.length;i++) {
          var permisoEliminar = $scope.checkRemoval(grafoFactory.arrayNeuronasE[i]);
          if (permisoEliminar) {
            jsonCopy.nodes[grafoFactory.arrayNeuronasE[i]].hidden = true;
          }
        }
        for (var j=0; j<grafoFactory.arrayConexionesE.length;j++) {
          var id = grafoFactory.arrayConexionesE[j].enlace;
          var origen = grafoFactory.arrayConexionesE[j].origen;
          var destino = grafoFactory.arrayConexionesE[j].destino;

          var pos = $scope.searchEdge(origen, destino);

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

          var pos = $scope.searchEdge(origen, destino);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      for (var i=0; i<arrayNeuronal.length;i++) {
        $scope.checkNoEdges(arrayNeuronal[i].id);
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      grafoFactory.load(jsonCopy);
    }

    //Creates the visualization from the input at the individual selection
    $scope.visualize = function(){

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

        //Check whether each char is an integer or coma, and if the value introduced is a range or not
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

      //If there were any mistakes at introducing data
      if (!admitido) {
        if (grafoFactory.spanish) {
          alert ('Error: \n- Sólo se admiten números enteros separados por comas sin espacios \n- Alguna de las neuronas seleccionadas pueden estar fuera de rango \n- No se permite hacer una búsqueda en blanco');
        }

        if (grafoFactory.english) {
          alert ('Error: \n- Only integers separated by commas without spaces are valid \n- Some of the selected neurons may be out of range \n- Blank search not allowed');
        }
      }

      //If data input is correct, but not a range
      else if (admitido && !esRango){ //Si el string con las neuronas pedidas por el usuario es sintácticamente correcto, se llama a la función que realiza el filtrado
        $scope.manualFiltering(valor);
      }

      //If data input is correct and a range
      else if (admitido && esRango) {
        $scope.filteringByRange();
      }

    }

    //Removes neurons that only have connections with themselves
    $scope.cleanEdges = function(arrayNeuronal){
      for (var i=0; i<arrayNeuronal.length;i++) {
        //Hiding neurons with just connection with themselves
        if (arrayNeuronal[i].destino.length == 1) {
          jsonCopy.nodes[i].hidden = true;
        }
        //Hiding neurons that do not belong to any of the synapses type defined
        if (arrayNeuronal[i].tipoConexion.length == 0) {
          jsonCopy.nodes[i].hidden = true;
        }
      }
    }

    //Show the info relative to a clicked neuron
    $scope.showEstatisticsNeurons = function(){
      var div =  document.getElementById('infoNeurona');
      div.innerHTML = div.innerHTML + '<b>ID: </b>' + d;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>T: </b>' + tipo;
      div.innerHTML = div.innerHTML + '<br><br>';

      document.getElementById('infoNeurona').style.display="inline";
      document.getElementById('infoNeurona').style.visibility="visible";
    }

    //Show the stats for the neurons active at the moment
    $scope.logNeurons = function(){
      var contadorMossy = 0;
      var contadorGranulle = 0;
      var contadorPurkinje = 0;
      var contadorDCN = 0;
      var contadorGolgi = 0;
      var contadorIO = 0;

      //Remove the previous info to show the new one
      var nodoABorrar = document.getElementById('log_n');
        while (nodoABorrar.firstChild) {
            nodoABorrar.removeChild(nodoABorrar.firstChild);
        }

      //If the neuron is visible at the moment, is saved at the arrayInfo with '1' value, '0' otherwise
      for (var i=0; i<jsonCopy.nodes.length;i++) {
        var auxID = jsonCopy.nodes[i].id.split("n");
        auxID = auxID[1];

        if (jsonCopy.nodes[i].hidden == false) {
          arrayInfo[auxID] = 1;
        }

        else if (jsonCopy.nodes[i].hidden == true) {
          arrayInfo[auxID] = 0;
        }
      }

      //Search in the arrayInfo for all the neurons with value '1', in that case,
      //look for its type and adding one to the counter
      for (var i=0; i<arrayInfo.length;i++) {
        if (arrayInfo[i] == 1) {
          var tipo = arrayNeuronal[[i]].tipo;
          switch (tipo) {

            case '0': {
                        contadorMossy++;
                        break;
            }

            case '1': {
                        contadorGranulle++;
                        break;
            }

            case '2': {
                        contadorPurkinje++;
                        break;
            }

            case '3': {
                        contadorDCN++;
                        break;
            }

            case '4': {
                        contadorGolgi++;
                        break;
            }

            case '5': {
                        contadorIO++;
                        break;
            }
          }
        }
      }

      //Generates the HTML for info visualization
      var div = document.getElementById('log_n');

      //Generate in spanish if active
      if (grafoFactory.spanish) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Neuronas visualizadas</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy:</b> ' + contadorMossy + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle:</b> ' + contadorGranulle + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Purkinje:</b> ' + contadorPurkinje + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>DCN:</b> ' + contadorDCN + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi:</b> ' + contadorGolgi + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>IO:</b> ' + contadorIO + '</center>';
      }

      //Generate in english if active
      if (grafoFactory.english) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Visualized neurons</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy:</b> ' + contadorMossy + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle:</b> ' + contadorGranulle + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Purkinje:</b> ' + contadorPurkinje + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>DCN:</b> ' + contadorDCN + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi:</b> ' + contadorGolgi + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>IO:</b> ' + contadorIO + '</center>';
      }


      document.getElementById('registro').style.display = "none";
      document.getElementById('estadisticas_n').style.display = "inline";
    }

    //Show the info about the edges actives at the moment
    $scope.logEdges = function(){
      var contadorA = 0;
      var contadorB = 0;
      var contadorC = 0;
      var contadorD = 0;
      var contadorE = 0;

      //Remove the previous info to show the new one
      var nodoABorrar = document.getElementById('log_a');
        while (nodoABorrar.firstChild) {
            nodoABorrar.removeChild(nodoABorrar.firstChild);
        }

      //Search all the active edges in each type of synapse
      for (var i=0; i<grafoFactory.arrayConexionesA.length;i++){
        var pos = $scope.searchEdge(grafoFactory.arrayConexionesA[i].origen, grafoFactory.arrayConexionesA[i].destino);
        var oculto = jsonCopy.edges[pos].hidden;

        if (!oculto) {
          contadorA++;
        }
      }

      for (var i=0; i<grafoFactory.arrayConexionesB.length;i++){
        var pos = $scope.searchEdge(grafoFactory.arrayConexionesB[i].origen, grafoFactory.arrayConexionesB[i].destino);
        var oculto = jsonCopy.edges[pos].hidden;

        if (!oculto) {
          contadorB++;
        }
      }

      for (var i=0; i<grafoFactory.arrayConexionesC.length;i++){
        var pos = $scope.searchEdge(grafoFactory.arrayConexionesC[i].origen, grafoFactory.arrayConexionesC[i].destino);
        var oculto = jsonCopy.edges[pos].hidden;

        if (!oculto) {
          contadorC++;
        }
      }

      for (var i=0; i<grafoFactory.arrayConexionesD.length;i++){
        var pos = $scope.searchEdge(grafoFactory.arrayConexionesD[i].origen, grafoFactory.arrayConexionesD[i].destino);
        var oculto = jsonCopy.edges[pos].hidden;

        if (!oculto) {
          contadorD++;
        }
      }

      for (var i=0; i<grafoFactory.arrayConexionesE.length;i++){
        var pos = $scope.searchEdge(grafoFactory.arrayConexionesE[i].origen, grafoFactory.arrayConexionesE[i].destino);
        var oculto = jsonCopy.edges[pos].hidden;

        if (!oculto) {
          contadorE++;
        }
      }

      //Generate the HTML for visualization
      var div = document.getElementById('log_a');

      //Generate in spanish if active
      if (grafoFactory.spanish) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Sinapsis visualizadas</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Granulle (Morado):</b> '  + contadorA + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Golgi (Verde):</b> ' + contadorB + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle - Golgi (Azul):</b> ' + contadorC +  '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Granulle (Rojo):</b> ' + contadorD + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Golgi (Naranja):</b> ' + contadorE + '</center>';
      }

      //Generate in english if active
      if (grafoFactory.english) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Visualized synapses</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Granulle (Purple):</b> '  + contadorA + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Golgi (Green):</b> ' + contadorB + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle - Golgi (Blue):</b> ' + contadorC +  '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Granulle (Red):</b> ' + contadorD + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Golgi (Orange):</b> ' + contadorE + '</center>';
      }


      document.getElementById('registro').style.display = "none";
      document.getElementById('estadisticas_a').style.display = "inline";
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

    function findTarget  (neurona) {
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

    function findType(neurona) {
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

      saveArrayMossy: function (mosey) {
        arrayMosey = mosey;
      },

      loadArrayMossy: function() {
        return arrayMosey;
      },

      saveArrayGranulle: function(granulle) {
        arrayGranulle = granulle;
      },

      loadArrayGranulle: function() {
        return arrayGranulle;
      },

      saveArrayPurkinje: function(purkinje) {
        arrayPurkinje = purkinje;
      },

      loadArrayPurkinje: function() {
        return arrayPurkinje;
      },

      saveArrayDCN: function(dcn) {
        arrayDCN = dcn;
      },

      loadArrayDCN: function() {
        return arrayDCN;
      },

      saveArrayGolgi: function(golgi) {
        arrayGolgi = golgi;
      },

      loadArrayGolgi: function() {
        return arrayGolgi;
      },

      saveArrayIO: function(io) {
        arrayIO = io;
      },

      loadArrayIO: function() {
        return arrayIO;
      },

      saveNeuronalArray: function(array) {
        arrayNeuronal = array;
      },

      loadNeuronalArray: function() {
        return arrayNeuronal;
      },

      loadJSON: function() {
        return jsonRecibido;
      },

      saveJSON: function(js){
        jsonRecibido = js;
      },

      setD: function(e) {
        d = e;
      },

      getD: function() {
        return d;
      },

      /*getArrayPrueba: function() {
        return arrayPrueba;
      },*/

      setArrayPrueba: function(a) {
        arrayPrueba = a;
      },

      //Muestra un grafo por defecto
      createGraph: function(){
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
      load: function(grafo) {
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
            var tipo = findType(d);
            var destinos = findTarget(d);
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
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + 'no dest.';
            }

            else {
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
