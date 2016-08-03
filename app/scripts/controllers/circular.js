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

  .controller ('circularCtrl', ['$scope','graphFactory', function($scope, graphFactory){

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

    //Get all the initial references from graphFactory
    $scope.getReferences = function() {
      graphFactory.iteracionesMosey = graphFactory.numeroMosey;
      graphFactory.iteracionesGranulle = graphFactory.numeroGranulle + graphFactory.iteracionesMosey;
      graphFactory.iteracionesPurkinje = graphFactory.numeroPurkinje + graphFactory.iteracionesGranulle;
      graphFactory.iteracionesDCN = graphFactory.numeroDcn + graphFactory.iteracionesPurkinje;
      graphFactory.iteracionesGolgi = graphFactory.numeroGolgi + graphFactory.iteracionesDCN;
      graphFactory.iteracionesIO = graphFactory.numeroIo + graphFactory.iteracionesGolgi;

      graphFactory.iniMosey = Math.min.apply(null,arrayMosey);
      graphFactory.iniGranulle = Math.min.apply(null,arrayGranulle);
      graphFactory.iniPurkinje = Math.min.apply(null,arrayPurkinje);
      graphFactory.iniDCN = Math.min.apply(null,arrayDCN);
      graphFactory.iniGolgi = Math.min.apply(null,arrayGolgi);
      graphFactory.iniIO = Math.min.apply(null,arrayIO);

      graphFactory.finMosey = Math.max.apply(null,arrayMosey);
      graphFactory.finGranulle = Math.max.apply(null,arrayGranulle);
      graphFactory.finPurkinje = Math.max.apply(null,arrayPurkinje);
      graphFactory.finDCN = Math.max.apply(null,arrayDCN);
      graphFactory.finGolgi = Math.max.apply(null,arrayGolgi);
      graphFactory.finIO = Math.max.apply(null,arrayIO);


      graphFactory.minWeigth = 0;
      graphFactory.maxWeigth = 10;
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
      for (var i=0;i<graphFactory.numeroTotalNeuronas;i++) {
        a.push(0);
      }
      return a;
    }

    //Initializes the connections array, where each array represents a synapse type, being:
    //ASynapsesArray: stores all the synapses between Mossy-Granulle neurons
    //BSynapsesArray: stores all the synapses between Mossy-Golgi neurons
    //CSynapsesArray: stores all the synapses between Granulle-Golgi neurons
    //DSynapsesArray: stores all the synapses between Golgi-Granulle neurons
    //ESynapsesArray: stores all the synapses between Golgi-Golgi neurons
    $scope.initConnectionsArray = function(synapseArray) {
      for (var i=0;i<graphFactory.numeroTotalNeuronas;i++) {
        synapseArray[i]=0;
      }
      for (var j=0;j<graphFactory.ASynapsesArray.length;j++) {
        synapseArray[graphFactory.ASynapsesArray[j].source]++;
        synapseArray[graphFactory.ASynapsesArray[j].target]++;
      }
      for (var j=0;j<graphFactory.BSynapsesArray.length;j++) {
        synapseArray[graphFactory.BSynapsesArray[j].source]++;
        synapseArray[graphFactory.BSynapsesArray[j].target]++;
      }
      for (var j=0;j<graphFactory.CSynapsesArray.length;j++) {
        synapseArray[graphFactory.CSynapsesArray[j].source]++;
        synapseArray[graphFactory.CSynapsesArray[j].target]++;
      }
      for (var j=0;j<graphFactory.DSynapsesArray.length;j++) {
        synapseArray[graphFactory.DSynapsesArray[j].source]++;
        synapseArray[graphFactory.DSynapsesArray[j].target]++;
      }
      for (var j=0;j<graphFactory.ESynapsesArray.length;j++) {
        synapseArray[graphFactory.ESynapsesArray[j].source]++;
        synapseArray[graphFactory.ESynapsesArray[j].target]++;
      }
      return synapseArray;
    }

    //Establishes the initial state of the app
    $scope.init = function() {

      refresh();
      jsonCopy = graphFactory.loadJSON();
      arrayNeuronal = graphFactory.loadNeuronalArray();
      arrayMosey = graphFactory.loadArrayMossy();
      arrayGranulle = graphFactory.loadArrayGranulle();
      arrayPurkinje = graphFactory.loadArrayPurkinje();
      arrayDCN = graphFactory.loadArrayDCN();
      arrayGolgi = graphFactory.loadArrayGolgi();
      arrayIO = graphFactory.loadArrayIO();
      $scope.getReferences();
      neuronCounterArray = $scope.initConnectionsArray(neuronCounterArray);
      arrayInfo = $scope.initStatsArray();
      graphFactory.load(jsonCopy);
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

      for (var i=0; i<arrayNeuronal[id].target.length; i++) {
        var auxHide;
        var target = arrayNeuronal[id].target[i];
        var pos = $scope.searchEdge(id, target);
        auxHide = jsonCopy.edges[pos].hidden;
        hide = auxHide;
      }
      if (hide && (arrayNeuronal[id].isTargetOf.length>0)) {
        for (var i=0; i<arrayNeuronal[id].isTargetOf.length;i++){
          var target = arrayNeuronal[id].isTargetOf[i];
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
      //console.log('array contador');
      //console.log(neuronCounterArray);

      //If mossy is deactivated, all its neurons will be hidden
      if (!mosey.checked) {
        for (var i=0; i<arrayMosey.length; i++) {
          jsonCopy.nodes[arrayMosey[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayMosey[i];
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }

        }

        //ID and weigth slider filters are disabled now
        document.getElementById('idmosey').style.pointerEvents = "none";
        document.getElementById('mossyWeigthSlider').style.pointerEvents = "none";
      }

      //if Mossy is activated, there are showed just the neurons within the interval of the slider
      //i.e. minMossy and maxMossy, both included
      else {

          for (var j=0; j<arrayMosey.length; j++) {
              if (arrayMosey[j] >= minMossy && arrayMosey[j] <= maxMossy) {

                //Check whether the neuron belongs to a valid synapse
                var isIn = graphFactory.ANeuronArray.indexOf(arrayMosey[j]);

                if (isIn == -1) {
                  isIn = graphFactory.BNeuronArray.indexOf(arrayMosey[j]);
                }

                if (isIn != -1) {
                jsonCopy.nodes[arrayMosey[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayMosey[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){

                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              }
              else {
                jsonCopy.nodes[arrayMosey[j]].hidden = true;
                var source = arrayMosey[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }

                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }
          }

          //Enable the ID and weigth slider filters
          document.getElementById('idmosey').style.pointerEvents = "auto";
          document.getElementById('mossyWeigthSlider').style.pointerEvents = "auto";
      }

      //console.log('array contador');
      //console.log(neuronCounterArray);
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //Show/hide Granulle neurons
    $scope.checkGranulle = function() {
      var inicioGranulle = $scope.sliderGranulle.min;
      var finalGranulle = $scope.sliderGranulle.max;
      //console.log('array contador');
      //console.log(neuronCounterArray);

      //If granulle is deactivated, all its neurons will be hidden
      if (!granulle.checked) {

        //console.log('arrayGranulle');
        //console.log(arrayGranulle);
        //console.log('aneuronarray');
        //console.log(graphFactory.ANeuronArray);
        //console.log('bneuronarray');
        //console.log(graphFactory.BNeuronArray);
        for (var i=0; i<arrayGranulle.length; i++) {
          jsonCopy.nodes[arrayGranulle[i]].hidden = true;

          //The edge(s) for a removed neuron must be removed too
          var source = arrayGranulle[i];
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idgranulle").style.pointerEvents = "none";
        document.getElementById("granulleWeigthSlider").style.pointerEvents = "none";
      }

      //if Granulle is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioGranulle and finalGranulle, both included
      else {

          for (var j=0; j<arrayGranulle.length; j++) {
              if (arrayGranulle[j] >= inicioGranulle && arrayGranulle[j] <= finalGranulle) {

              //Check whether the neuron belongs to a valid synapse
              var isIn = graphFactory.ANeuronArray.indexOf(arrayGranulle[j]);

              if (isIn == -1) {
                isIn = graphFactory.CNeuronArray.indexOf(arrayGranulle[j]);

                if (isIn == -1) {
                  isIn = graphFactory.DNeuronArray.indexOf(arrayGranulle[j]);
                }
              }

              if (isIn != -1) {
                jsonCopy.nodes[arrayGranulle[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayGranulle[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                  //console.log('hemos puesto a false la arista '+ jsonCopy.edges[pos].id);
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              }
              else {
                jsonCopy.nodes[arrayGranulle[j]].hidden = true;


                var source = arrayGranulle[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }

                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }
          }



          //Enable the ID and weigth slider filters
          document.getElementById('idgranulle').style.pointerEvents = "auto";
          document.getElementById('granulleWeigthSlider').style.pointerEvents = "auto";
      }

      /*for (var i=0;i<arrayNeuronal.length;i++){
        $scope.checkNoEdges(arrayNeuronal[i].id);
      }*/
      //console.log('array contador');
      //console.log(neuronCounterArray);
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
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
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idpurkinje").style.pointerEvents = "none";
        document.getElementById("purkinjeWeigthSlider").style.pointerEvents = "none";
      }

      //if Purkinje is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioPurkinje and finalPurkinje, both included
      else {
          for (var j=0; j<arrayPurkinje.length; j++) {
              if (arrayPurkinje[j] >= inicioPurkinje && arrayPurkinje[j] <= finalPurkinje) {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayPurkinje[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayPurkinje[j]].hidden = true;


                var source = arrayPurkinje[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('idpurkinje').style.pointerEvents = "auto";
          document.getElementById('purkinjeWeigthSlider').style.pointerEvents = "auto";
      }
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
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
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("iddcn").style.pointerEvents = "none";
        document.getElementById("DCNWeigthSlider").style.pointerEvents = "none";
      }

      //if DCN is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioDCN and finalDCN, both included
      else {
          for (var j=0; j<arrayDCN.length; j++) {

              if (arrayDCN[j] >= inicioDCN && arrayDCN[j] <= finalDCN) {
                jsonCopy.nodes[arrayDCN[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayDCN[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayDCN[j]].hidden = true;


                var source = arrayDCN[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('iddcn').style.pointerEvents = "auto";
          document.getElementById('DCNWeigthSlider').style.pointerEvents = "auto";
      }
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
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
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idgolgi").style.pointerEvents = "none";
        document.getElementById("golgiWeigthSlider").style.pointerEvents = "none";
      }

      //if Golgi is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioGolgi and finalGolgi, both included
      else {
          for (var j=0; j<arrayGolgi.length; j++) {
              if (arrayGolgi[j] >= inicioGolgi && arrayGolgi[j] <= finalGolgi) {

                //Check whether the neuron belongs to a valid synapse
                var isIn = graphFactory.BNeuronArray.indexOf(arrayGolgi[j]);

                if (isIn == -1) {
                  isIn = graphFactory.CNeuronArray.indexOf(arrayGolgi[j]);

                  if (isIn == -1) {
                    isIn = graphFactory.DNeuronArray.indexOf(arrayGolgi[j]);

                    if (isIn == -1) {
                      isIn = graphFactory.ENeuronArray.indexOf(arrayGolgi[j]);
                    }
                  }
                }

                if (isIn != -1) {
                jsonCopy.nodes[arrayGolgi[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayGolgi[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              }
              else {
                jsonCopy.nodes[arrayGolgi[j]].hidden = true;


                var source = arrayGolgi[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }


          }

          //Enable the ID and weigth slider filters
          document.getElementById('idgolgi').style.pointerEvents = "auto";
          document.getElementById('golgiWeigthSlider').style.pointerEvents = "auto";
      }

      for (var i=0;i<arrayNeuronal.length;i++){
        $scope.checkNoEdges(arrayNeuronal[i].id);
      }
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
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
          for (var j=0; j<arrayNeuronal[source].target.length;j++) {
            var target = arrayNeuronal[source].target[j];
            var pos = $scope.searchEdge(source, target);
            jsonCopy.edges[pos].hidden = true;
          }

          //The edge(s) that the removed neuron is the target must be removed too
          for (var j=0; j<arrayNeuronal[source].isTargetOf.length;j++){
            var target = arrayNeuronal[source].isTargetOf[j];
            var pos = $scope.searchEdge(target, source);
            jsonCopy.edges[pos].hidden = true;
            $scope.checkNoEdges(target);
          }
        }

        //ID and weigth slider filters are disabled now
        document.getElementById("idio").style.pointerEvents = "none";
        document.getElementById("IOWeigthSlider").style.pointerEvents = "none";
      }

      //if IO is activated, there are showed just the neurons within the interval of the slider
      //i.e. inicioIO and finalIO, both included
      else {
          for (var j=0; j<arrayIO.length; j++) {
              if (arrayIO[j] >= inicioIO && arrayIO[j] <= finalIO) {
                jsonCopy.nodes[arrayIO[j]].hidden = false;

                //If a neuron is added, its edge is added too
                var source = arrayIO[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = false;
                }

                //For a neuron added, the edge that the neuron is target is added too
                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = false;
                  jsonCopy.nodes[target].hidden = false;
                }
              }
              else {
                jsonCopy.nodes[arrayIO[j]].hidden = true;


                var source = arrayIO[j];
                for (var z=0; z<arrayNeuronal[source].target.length;z++) {
                  var target = arrayNeuronal[source].target[z];
                  var pos = $scope.searchEdge(source, target);
                  jsonCopy.edges[pos].hidden = true;
                }


                for (var z=0; z<arrayNeuronal[source].isTargetOf.length;z++){
                  var target = arrayNeuronal[source].isTargetOf[z];
                  var pos = $scope.searchEdge(target, source);
                  jsonCopy.edges[pos].hidden = true;
                  $scope.checkNoEdges(target);
                }
              }
          }

          //Enable the ID and weigth slider filters
          document.getElementById('idio').style.pointerEvents = "auto";
          document.getElementById('IOWeigthSlider').style.pointerEvents = "auto";
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //Clean the text area at manual selection and the previous selections
    $scope.restore = function() {
      document.getElementById('inputNeuron').value="";

      //All the neurons will be showed
      for (var i=0; i<arrayNeuronal.length;i++) {
        jsonCopy.nodes[arrayNeuronal[i].id].hidden = false;
      }

      //The array of selections is empty
      while(arrayRange.length > 0) {
        arrayRange.pop();
      }

      var arrayNeuronInfo = new Array();
      graphFactory.setSelectedNeuronsArray(arrayNeuronInfo);
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //Controllers for the sliders
    $scope.sliderMosey = {
        min: graphFactory.iniMosey,
        max: graphFactory.finMosey,
        options: {
          floor: graphFactory.iniMosey,
          ceil: graphFactory.finMosey,
          noSwitching: true
        }
    };

    $scope.sliderGranulle = {
        min: graphFactory.iniGranulle,
        max: graphFactory.finGranulle,
        options: {
        floor: graphFactory.iniGranulle,
        ceil: graphFactory.finGranulle,
        noSwitching: true
      }
    };

    $scope.sliderPurkinje = {
        min: graphFactory.iniPurkinje,
        max: graphFactory.finPurkinje,
        options: {
        floor: graphFactory.iniPurkinje,
        ceil: graphFactory.finPurkinje,
        noSwitching: true
      }
    };

    $scope.sliderDCN = {
        min: graphFactory.iniDCN,
        max: graphFactory.finDCN,
        options: {
        floor: graphFactory.iniDCN,
        ceil: graphFactory.finDCN,
        noSwitching: true
      }
    };

    $scope.sliderGolgi = {
        min: graphFactory.iniGolgi,
        max: graphFactory.finGolgi,
        options: {
        floor: graphFactory.iniGolgi,
        ceil: graphFactory.finGolgi,
        noSwitching: true
      }
    };

    $scope.sliderIO = {
        min: graphFactory.iniIO,
        max: graphFactory.finIO,
        options: {
        floor: graphFactory.iniIO,
        ceil: graphFactory.finIO,
        noSwitching: true
      }
    };

    $scope.mossyWeigthSlider = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.granulleWeigthSlider = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.purkinjeWeigthSlider = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.DCNWeigthSlider = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.golgiWeigthSlider = {
        min: 0,
        max: 100,
        options: {
        floor: 0,
        ceil: 100,
        noSwitching: true
      }
    };

    $scope.IOWeigthSlider = {
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
      var minWeigth = $scope.mossyWeigthSlider.min;
      var maxWeigth = $scope.mossyWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthMossey*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthMossey*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayMosey.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayMosey[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayMosey[i]].weigth[j];
          var source = arrayNeuronal[arrayMosey[i]].id;
          var target = arrayNeuronal[arrayMosey[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayMosey[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayMosey[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeGranulleWeigth = function () {
      var minWeigth = $scope.granulleWeigthSlider.min;
      var maxWeigth = $scope.granulleWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthGranulle*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthGranulle*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayGranulle.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGranulle[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayGranulle[i]].weigth[j];
          var source = arrayNeuronal[arrayGranulle[i]].id;
          var target = arrayNeuronal[arrayGranulle[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayGranulle[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayGranulle[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changePurkinjeWeigth = function () {
      var minWeigth = $scope.purkinjeWeigthSlider.min;
      var maxWeigth = $scope.purkinjeWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthPurkinje*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthPurkinje*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayPurkinje.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayPurkinje[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayPurkinje[i]].weigth[j];
          var source = arrayNeuronal[arrayPurkinje[i]].id;
          var target = arrayNeuronal[arrayPurkinje[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayPurkinje[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayPurkinje[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeDCNWeigth = function () {
      var minWeigth = $scope.DCNWeigthSlider.min;
      var maxWeigth = $scope.DCNWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthDCN*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthDCN*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayDCN.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayDCN[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayDCN[i]].weigth[j];
          var source = arrayNeuronal[arrayDCN[i]].id;
          var target = arrayNeuronal[arrayDCN[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayDCN[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayDCN[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeGolgiWeigth = function () {
      var minWeigth = $scope.golgiWeigthSlider.min;
      var maxWeigth = $scope.golgiWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthGolgi*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthGolgi*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayGolgi.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayGolgi[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayGolgi[i]].weigth[j];
          var source = arrayNeuronal[arrayGolgi[i]].id;
          var target = arrayNeuronal[arrayGolgi[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayGolgi[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayGolgi[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //The visualization changes with the weigth variation of the weigth slider
    $scope.changeIOWeigth = function () {
      var minWeigth = $scope.IOWeigthSlider.min;
      var maxWeigth = $scope.IOWeigthSlider.max;

      //Min and max weigth are calculated here
      minWeigth = minWeigth/100;
      minWeigth = graphFactory.minWeigthIO*minWeigth;
      maxWeigth = maxWeigth/100;
      maxWeigth = graphFactory.maxWeigthIO*maxWeigth;

      //Each weigth of the Mossy type are compared with the weigth interval setted by the slider
      for (var i=0; i<arrayIO.length;i++) {
        for (var j=0; j<arrayNeuronal[arrayIO[i]].weigth.length;j++) {
          var weigth = arrayNeuronal[arrayIO[i]].weigth[j];
          var source = arrayNeuronal[arrayIO[i]].id;
          var target = arrayNeuronal[arrayIO[i]].target[j];
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
        for (var j=0; j<arrayNeuronal[arrayIO[i]].weigth.length;j++) {
          var target = arrayNeuronal[arrayIO[i]].target[j];
          $scope.checkNoEdges(target);
        }
      }

      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    /*$scope.mostrarPeso = function() {
      if (spanish) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('weigthSlider').style.visibility = "visible";
        document.getElementById('weigthSlider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }
      if (english) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('weigthSlider').style.visibility = "visible";
        document.getElementById('weigthSlider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }
      $scope.restore();
    }

    $scope.mostrarId = function() {
      if (spanish) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }

      //CORREGIR IDIOMA
      if (english) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }
      $scope.restore();
    }*/

    /*$scope.mostrarSeleccionManual = function() {
      if (spanish) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.visibility = "visible";
        document.getElementById('manualSelection').style.display = "inline";
        document.getElementById('inputNeuron').value="";
      }
      if (english) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.visibility = "visible";
        document.getElementById('manualSelection').style.display = "inline";
        document.getElementById('inputNeuron').value="";
      }
    }*/

    //Function to go back in the app's UI
    $scope.back = function(value){
      if (value == 1) {
        document.getElementById('neuron_selection').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value == 2) {
        document.getElementById('synapse_selection').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value == 3) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value == 4) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value ==5) {
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value == 6) {
        document.getElementById('log').style.display = "none";
        document.getElementById('filter_selection').style.display = "inline";
      }

      if (value == 7) {
        document.getElementById('stats_n').style.display = "none";
        document.getElementById('log').style.display = "inline";
      }

      if (value == 8) {
        document.getElementById('stats_a').style.display = "none";
        document.getElementById('log').style.display = "inline";
      }
    }

    //Function to display the desired option selected in the UI
    $scope.display = function(value) {
      document.getElementById('filter_selection').style.display = "none";

      //Show select by neuronal type
      if (value == 1) {
        document.getElementById('neuron_selection').style.display = "inline";
      }

      //Show select by synapse type
      if (value == 2) {
        document.getElementById('synapse_selection').style.display = "inline";
      }

      //Show the ID slider filter
      if (value == 3) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('slider').style.visibility = "visible";
        document.getElementById('slider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }

      //Show the weigth slider filter
      if (value == 4) {
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.display = "none";
        document.getElementById('weigthSlider').style.visibility = "visible";
        document.getElementById('weigthSlider').style.display = "inline";
        document.getElementById('neuron_selection').style.pointerEvents = "auto";
      }

      //Show the individual selection window
      if (value == 5) {
        document.getElementById('weigthSlider').style.display = "none";
        document.getElementById('slider').style.display = "none";
        document.getElementById('manualSelection').style.visibility = "visible";
        document.getElementById('manualSelection').style.display = "inline";
        document.getElementById('inputNeuron').value="";
      }

      //Show the selecting log window
      if (value == 6) {
        document.getElementById('log').style.display = "inline";
      }

      //Show the neuron stats
      if (value == 8) {
        document.getElementById('log').style.display = "none";
        document.getElementById('log_a').style.display = "inline";
      }
    }

    //Returns all the targets for a selected neuron
    $scope.getTargets = function(neurona) {
      var result;
      var iterations = arrayNeuronal[neurona].target.length;

      for (var i=0; i<iterations;i++) {
        var aux = arrayNeuronal[neurona].target[i];
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
      var selectionString = document.getElementById("inputNeuron").value;
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
            graphFactory.load(jsonCopy);
          }
          else {
            if (graphFactory.spanish) {
              alert('ERROR: el valor superior del rango introducido es mayor que el valor máximo de id disponible');
            }
            if (graphFactory.english) {
              alert('ERROR: The upper value of the entered range is greater than the maximun id value available');
            }
          }

        }
        else {
          if (graphFactory.spanish)
          alert('ERROR: el valor inferior del rango introducido es menor que el valor mínimo de id disponible');
          if (graphFactory.english)
          alert ('ERROR: The lower value of the entered range is smaller than the minimun id value available');
        }
      }
      else {
        if (graphFactory.spanish)
        alert('ERROR: el valor inferior del rango introducido es mayor que el valor superior');
        if (graphFactory.english)
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
          if (graphFactory.spanish) {
            alert('ERROR: el valor inferior del rango introducido es menor que el valor mínimo de id disponible');
          }

          else if (graphFactory.english) {
            alert('ERROR: The lower value of the entered range is smaller than the minimun id value available');
          }
          stop = true;
        }

        else if (sourceFilter[j] > max) {
          if (graphFactory.spanish) {
            alert('ERROR: el valor superior del rango introducido es mayor que el valor máximo de id disponible');
          }
          else if (graphFactory.english) {
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
      graphFactory.load(jsonCopy);
    }
    }

    //Adjust the counter of the mf-gr synapses for a well-structured visualization
    $scope.checkCounterA = function() {

      for (var i=0; i<graphFactory.ANeuronArray.length; i++) {
        if (mfgr.checked) {
          neuronCounterArray[graphFactory.ANeuronArray[i]]++;
        }
        if (!mfgr.checked) {
          neuronCounterArray[graphFactory.ANeuronArray[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the mf-go synapses for a well-structured visualization
    $scope.checkCounterB = function() {
      for (var i=0; i<graphFactory.BNeuronArray.length; i++) {
        if (mfgo.checked) {
          neuronCounterArray[graphFactory.BNeuronArray[i]]++;
        }
        if (!mfgo.checked) {
          neuronCounterArray[graphFactory.BNeuronArray[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the gr-go synapses for a well-structured visualization
    $scope.checkCounterC = function() {
      for (var i=0; i<graphFactory.CNeuronArray.length; i++) {
        if (grgo.checked) {
          neuronCounterArray[graphFactory.CNeuronArray[i]]++;
        }
        if (!grgo.checked) {
          neuronCounterArray[graphFactory.CNeuronArray[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the go-gr synapses for a well-structured visualization
    $scope.checkCounterD = function() {
      for (var i=0; i<graphFactory.DNeuronArray.length; i++) {
        if (gogr.checked) {
          neuronCounterArray[graphFactory.DNeuronArray[i]]++;
        }
        if (!gogr.checked) {
          neuronCounterArray[graphFactory.DNeuronArray[i]]--;
        }
      }
      $scope.showConnections();
    }

    //Adjust the counter of the go-go synapses for a well-structured visualization
    $scope.checkCounterE = function() {
      for (var i=0; i<graphFactory.ENeuronArray.length; i++) {
        if (gogo.checked) {
          neuronCounterArray[graphFactory.ENeuronArray[i]]++;
        }
        if (!gogo.checked) {
          neuronCounterArray[graphFactory.ENeuronArray[i]]--;
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
      //console.log('array contador');
      //console.log(neuronCounterArray);
      if (!mfgr.checked) {
        for (var i=0; i<graphFactory.ANeuronArray.length;i++) {
          var permittedRemoval = $scope.checkRemoval(graphFactory.ANeuronArray[i]);
          if (permittedRemoval) {
            jsonCopy.nodes[graphFactory.ANeuronArray[i]].hidden = true;
            //console.log('eliminamos el nodo '+ jsonCopy.nodes[graphFactory.ANeuronArray[i]].id + jsonCopy.nodes[graphFactory.ANeuronArray[i]].hidden);
          }
        }
        for (var j=0; j<graphFactory.ASynapsesArray.length;j++) {
          //var id = graphFactory.ASynapsesArray[j].link; //NO SE USA!
          var source = graphFactory.ASynapsesArray[j].source;
          var target = graphFactory.ASynapsesArray[j].target;
          var pos = $scope.searchEdge(source, target);
          jsonCopy.edges[pos].hidden = true;
          $scope.checkNoEdges(target);
        }

      }
      else {
        for (var i=0;i<graphFactory.ANeuronArray.length;i++) {
          jsonCopy.nodes[graphFactory.ANeuronArray[i]].hidden = false;
          //console.log('añadimos el nodo '+ jsonCopy.nodes[graphFactory.ANeuronArray[i]].id + jsonCopy.nodes[graphFactory.ANeuronArray[i]].hidden);
        }
        for (var j=0;j<graphFactory.ASynapsesArray.length; j++) {
          var source = graphFactory.ASynapsesArray[j].source;
          var target = graphFactory.ASynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!mfgo.checked) {
        for (var i=0; i<graphFactory.BNeuronArray.length;i++) {
          var permittedRemoval = $scope.checkRemoval(graphFactory.BNeuronArray[i]);
          if (permittedRemoval) {
            jsonCopy.nodes[graphFactory.BNeuronArray[i]].hidden = true;
            //console.log('eliminamos el nodo '+ jsonCopy.nodes[graphFactory.BNeuronArray[i]].id + jsonCopy.nodes[graphFactory.BNeuronArray[i]].hidden);
          }
        }
        for (var j=0; j<graphFactory.BSynapsesArray.length;j++) {
          var source = graphFactory.BSynapsesArray[j].source;
          var target = graphFactory.BSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<graphFactory.BNeuronArray.length;i++) {
          jsonCopy.nodes[graphFactory.BNeuronArray[i]].hidden = false;
          //console.log('añadimos el nodo '+ jsonCopy.nodes[graphFactory.BNeuronArray[i]].id + jsonCopy.nodes[graphFactory.BNeuronArray[i]].hidden);
        }
        for (var j=0;j<graphFactory.BSynapsesArray.length; j++) {
          var source = graphFactory.BSynapsesArray[j].source;
          var target = graphFactory.BSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!grgo.checked) {
        for (var i=0; i<graphFactory.CNeuronArray.length;i++) {
          var permittedRemoval = $scope.checkRemoval(graphFactory.CNeuronArray[i]);
          if (permittedRemoval) {
            jsonCopy.nodes[graphFactory.CNeuronArray[i]].hidden = true;
            //console.log('eliminamos el nodo '+ jsonCopy.nodes[graphFactory.CNeuronArray[i]].id + jsonCopy.nodes[graphFactory.CNeuronArray[i]].hidden);
          }
        }
        for (var j=0; j<graphFactory.CSynapsesArray.length;j++) {
          var source = graphFactory.CSynapsesArray[j].source;
          var target = graphFactory.CSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<graphFactory.CNeuronArray.length;i++) {
          jsonCopy.nodes[graphFactory.CNeuronArray[i]].hidden = false;
          //console.log('añadimos el nodo '+ jsonCopy.nodes[graphFactory.CNeuronArray[i]].id + jsonCopy.nodes[graphFactory.CNeuronArray[i]].hidden);
        }
        for (var j=0;j<graphFactory.CSynapsesArray.length; j++) {
          var source = graphFactory.CSynapsesArray[j].source;
          var target = graphFactory.CSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogr.checked) {
        for (var i=0; i<graphFactory.DNeuronArray.length;i++) {
          var permittedRemoval = $scope.checkRemoval(graphFactory.DNeuronArray[i]);
          if (permittedRemoval) {
            jsonCopy.nodes[graphFactory.DNeuronArray[i]].hidden = true;
            //console.log('eliminamos el nodo '+ jsonCopy.nodes[graphFactory.DNeuronArray[i]].id + jsonCopy.nodes[graphFactory.DNeuronArray[i]].hidden);
          }
        }
        for (var j=0; j<graphFactory.DSynapsesArray.length;j++) {
          var source = graphFactory.DSynapsesArray[j].source;
          var target = graphFactory.DSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);
          //console.log('buscamos en la arista '+source + ' ' + target);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<graphFactory.DNeuronArray.length;i++) {
          jsonCopy.nodes[graphFactory.DNeuronArray[i]].hidden = false;
          //console.log('añadimos el nodo '+ jsonCopy.nodes[graphFactory.DNeuronArray[i]].id + jsonCopy.nodes[graphFactory.DNeuronArray[i]].hidden);
        }
        for (var j=0;j<graphFactory.DSynapsesArray.length; j++) {
          var source = graphFactory.DSynapsesArray[j].source;
          var target = graphFactory.DSynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      if (!gogo.checked) {
        for (var i=0; i<graphFactory.ENeuronArray.length;i++) {
          var permittedRemoval = $scope.checkRemoval(graphFactory.ENeuronArray[i]);
          if (permittedRemoval) {
            jsonCopy.nodes[graphFactory.ENeuronArray[i]].hidden = true;
            //console.log('eliminamos el nodo '+ jsonCopy.nodes[graphFactory.ENeuronArray[i]].id + jsonCopy.nodes[graphFactory.ENeuronArray[i]].hidden);
          }
        }
        for (var j=0; j<graphFactory.ESynapsesArray.length;j++) {
          var source = graphFactory.ESynapsesArray[j].source;
          var target = graphFactory.ESynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = true;
        }
      }
      else {
        for (var i=0;i<graphFactory.ENeuronArray.length;i++) {
          jsonCopy.nodes[graphFactory.ENeuronArray[i]].hidden = false;
          //console.log('añadimos el nodo '+ jsonCopy.nodes[graphFactory.ENeuronArray[i]].id + jsonCopy.nodes[graphFactory.ENeuronArray[i]].hidden);
        }
        for (var j=0;j<graphFactory.ESynapsesArray.length; j++) {
          var source = graphFactory.ESynapsesArray[j].source;
          var target = graphFactory.ESynapsesArray[j].target;

          var pos = $scope.searchEdge(source, target);

          jsonCopy.edges[pos].hidden = false;
        }
      }

      for (var i=0; i<arrayNeuronal.length;i++) {
        $scope.checkNoEdges(arrayNeuronal[i].id);
      }
      //console.log('array contador');
      //console.log(neuronCounterArray);
      $scope.cleanEdges(arrayNeuronal);
      refresh();
      graphFactory.load(jsonCopy);
    }

    //Creates the visualization from the input at the individual selection
    $scope.visualize = function(){

      var value = document.getElementById("inputNeuron").value;

      var admitted = true;
      var isRange = false;

      if (value=="") {
        admitted = false;
      }

      else if (value.charAt(value.length-1) == ',') {
        admitted = false;
      }

      else {

        //Check whether each char is an integer or coma, and if the value introduced is a range or not
        for (var i=0; i<value.length;i++) {
          var aux = value.charAt(i);
          var t = !isNaN(String(aux) * 1);
            if (!t) {
              if (aux == '-') {
                isRange = true;
              }
              else if (aux != ',') {
               admitted = false;
              }
            }
        }
      }

      //If there were any mistakes at introducing data
      if (!admitted) {
        if (graphFactory.spanish) {
          alert ('Error: \n- Sólo se admiten números enteros separados por comas sin espacios \n- Alguna de las neuronas seleccionadas pueden estar fuera de rango \n- No se permite hacer una búsqueda en blanco');
        }

        if (graphFactory.english) {
          alert ('Error: \n- Only integers separated by commas without spaces are valid \n- Some of the selected neurons may be out of range \n- Blank search not allowed');
        }
      }

      //If data input is correct, but not a range
      else if (admitted && !isRange){ //Si el string con las neuronas pedidas por el usuario es sintácticamente correcto, se llama a la función que realiza el filtrado
        $scope.manualFiltering(value);
      }

      //If data input is correct and a range
      else if (admitted && isRange) {
        $scope.filteringByRange();
      }

    }

    //Removes neurons that only have connections with themselves
    $scope.cleanEdges = function(arrayNeuronal){
      for (var i=0; i<arrayNeuronal.length;i++) {
        //Hiding neurons with just connection with themselves
        if (arrayNeuronal[i].target.length == 1) {
          jsonCopy.nodes[i].hidden = true;
        }
        //Hiding neurons that do not belong to any of the synapses type defined
        if (arrayNeuronal[i].synapseType.length == 0) {
          jsonCopy.nodes[i].hidden = true;
        }
      }
    }

    //Show the info relative to a clicked neuron
    $scope.showEstatisticsNeurons = function(){
      var div =  document.getElementById('neuronInfo');
      div.innerHTML = div.innerHTML + '<b>ID: </b>' + d;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>T: </b>' + tipo;
      div.innerHTML = div.innerHTML + '<br><br>';

      document.getElementById('neuronInfo').style.display="inline";
      document.getElementById('neuronInfo').style.visibility="visible";
    }

    //Show the stats for the neurons active at the moment
    $scope.logNeurons = function(){
      var mossyCounter = 0;
      var granulleCounter = 0;
      var purkinjeCounter = 0;
      var DCNCounter = 0;
      var golgiCounter = 0;
      var IOCounter = 0;

      //Remove the previous info to show the new one
      var nodeToRemove = document.getElementById('log_n');
        while (nodeToRemove.firstChild) {
            nodeToRemove.removeChild(nodeToRemove.firstChild);
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
          var type = arrayNeuronal[[i]].type;
          switch (type) {

            case '0': {
                        mossyCounter++;
                        break;
            }

            case '1': {
                        granulleCounter++;
                        break;
            }

            case '2': {
                        purkinjeCounter++;
                        break;
            }

            case '3': {
                        DCNCounter++;
                        break;
            }

            case '4': {
                        golgiCounter++;
                        break;
            }

            case '5': {
                        IOCounter++;
                        break;
            }
          }
        }
      }

      //Generates the HTML for info visualization
      var div = document.getElementById('log_n');

      //Generate in spanish if active
      if (graphFactory.spanish) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Neuronas visualizadas</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy:</b> ' + mossyCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle:</b> ' + granulleCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Purkinje:</b> ' + purkinjeCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>DCN:</b> ' + DCNCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi:</b> ' + golgiCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>IO:</b> ' + IOCounter + '</center>';
      }

      //Generate in english if active
      if (graphFactory.english) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Visualized neurons</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy:</b> ' + mossyCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle:</b> ' + granulleCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Purkinje:</b> ' + purkinjeCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>DCN:</b> ' + DCNCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi:</b> ' + golgiCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>IO:</b> ' + IOCounter + '</center>';
      }


      document.getElementById('log').style.display = "none";
      document.getElementById('stats_n').style.display = "inline";
    }

    //Show the info about the edges actives at the moment
    $scope.logEdges = function(){
      var ACounter = 0;
      var BCounter = 0;
      var CCounter = 0;
      var DCounter = 0;
      var ECounter = 0;

      //Remove the previous info to show the new one
      var nodeToRemove = document.getElementById('log_a');
        while (nodeToRemove.firstChild) {
            nodeToRemove.removeChild(nodeToRemove.firstChild);
        }

      //Search all the active edges in each type of synapse
      for (var i=0; i<graphFactory.ASynapsesArray.length;i++){
        var pos = $scope.searchEdge(graphFactory.ASynapsesArray[i].source, graphFactory.ASynapsesArray[i].target);
        var hidden = jsonCopy.edges[pos].hidden;

        if (!hidden) {
          ACounter++;
        }
      }

      for (var i=0; i<graphFactory.BSynapsesArray.length;i++){
        var pos = $scope.searchEdge(graphFactory.BSynapsesArray[i].source, graphFactory.BSynapsesArray[i].target);
        var hidden = jsonCopy.edges[pos].hidden;

        if (!hidden) {
          BCounter++;
        }
      }

      for (var i=0; i<graphFactory.CSynapsesArray.length;i++){
        var pos = $scope.searchEdge(graphFactory.CSynapsesArray[i].source, graphFactory.CSynapsesArray[i].target);
        var hidden = jsonCopy.edges[pos].hidden;

        if (!hidden) {
          CCounter++;
        }
      }

      for (var i=0; i<graphFactory.DSynapsesArray.length;i++){
        var pos = $scope.searchEdge(graphFactory.DSynapsesArray[i].source, graphFactory.DSynapsesArray[i].target);
        var hidden = jsonCopy.edges[pos].hidden;

        if (!hidden) {
          DCounter++;
        }
      }

      for (var i=0; i<graphFactory.ESynapsesArray.length;i++){
        var pos = $scope.searchEdge(graphFactory.ESynapsesArray[i].source, graphFactory.ESynapsesArray[i].target);
        var hidden = jsonCopy.edges[pos].hidden;

        if (!hidden) {
          ECounter++;
        }
      }

      //Generate the HTML for visualization
      var div = document.getElementById('log_a');

      //Generate in spanish if active
      if (graphFactory.spanish) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Sinapsis visualizadas</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Granulle (Morado):</b> '  + ACounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Golgi (Verde):</b> ' + BCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle - Golgi (Azul):</b> ' + CCounter +  '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Granulle (Rojo):</b> ' + DCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Golgi (Naranja):</b> ' + ECounter + '</center>';
      }

      //Generate in english if active
      if (graphFactory.english) {
        div.innerHTML = div.innerHTML + '<center><b><font size="4">Visualized synapses</font></b></center>';
        div.innerHTML = div.innerHTML + '<br><br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Granulle (Purple):</b> '  + ACounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Mossy - Golgi (Green):</b> ' + BCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Granulle - Golgi (Blue):</b> ' + CCounter +  '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Granulle (Red):</b> ' + DCounter + '</center>';
        div.innerHTML = div.innerHTML + '<br>';
        div.innerHTML = div.innerHTML + '  <center><b>Golgi - Golgi (Orange):</b> ' + ECounter + '</center>';
      }


      document.getElementById('log').style.display = "none";
      document.getElementById('stats_a').style.display = "inline";
    }

  }])

  .factory('graphFactory', function graphFactory(){
    var receivedJSON;

    //var numeroMosey;
    //var numeroGranulle = 0;
    //var numeroPurkinje = 0;
    //var numeroDcn = 0;
    //var numeroGolgi = 0;
    //var numeroIo = 0;
    //var numeroTotalNeuronas = 0;

    //var iteracionesMosey;
    //var iteracionesGranulle;
    //var iteracionesPurkinje;
    //var iteracionesDCN;
    //var iteracionesGolgi;
    //var iteracionesIO;

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

    var minWeigth;
    var maxWeigth;

    var spanish;
    var english;

    var maxWeigthMossey;
    var maxWeigthGranulle;
    var maxWeigthPurkinje;
    var maxWeigthDCN;
    var maxWeigthGolgi;
    var maxWeigthIO;

    var minWeigthMossey;
    var minWeigthGranulle;
    var minWeigthPurkinje;
    var minWeigthDCN;
    var minWeigthGolgi;
    var minWeigthIO;

    var ANeuronArray;
    var BNeuronArray;
    var CNeuronArray;
    var DNeuronArray;
    var ENeuronArray;

    var ASynapsesArray;
    var BSynapsesArray;
    var CSynapsesArray;
    var DSynapsesArray;
    var ESynapsesArray;

    var arrayNeuronal = new Array();

    var s;

    var arrayMosey = new Array();
    var arrayGranulle = new Array();
    var arrayPurkinje = new Array();
    var arrayDCN = new Array();
    var arrayGolgi = new Array();
    var arrayIO = new Array();

    var d = "h";

    var selectedNeuronsArray = new Array();

    function findTarget  (neurona) {
      var lines = neurona.split(" ");
      var number = lines[1];
      var str = "";
      for (var i=1; i<arrayNeuronal[number].target.length;i++) {
        if (str != "")
        str = str + ' ' + arrayNeuronal[number].target[i];
        else
        str = str + arrayNeuronal[number].target[i];
      }

      if (str == "")
       str = "-";
      return str;
    }

    function findType(neurona) {
      var lines = neurona.split(" ");
      var number = lines[1];
      var type = arrayNeuronal[number].type;
      var typeName;

      switch(type) {
        case '0': {
          typeName = 'Mossy';
          break;
        }
        case '1': {
          typeName = 'Granulle';
          break;
        }
        case '2': {
          typeName = 'Purkinje';
          break;
        }
        case '3': {
          typeName = 'DCN';
          break;
        }
        case '4': {
          typeName = 'Golgi';
          break;
        }
        case '5': {
          typeName = 'IO';
          break;
        }
      }

      return typeName;
    }

    return {

      saveArrayMossy: function (mossy) {
        arrayMosey = mossy;
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
        return receivedJSON;
      },

      saveJSON: function(js){
        receivedJSON = js;
      },

      setD: function(e) {
        d = e;
      },

      getD: function() {
        return d;
      },

      /*getselectedNeuronsArray: function() {
        return selectedNeuronsArray;
      },*/

      setSelectedNeuronsArray: function(a) {
        selectedNeuronsArray = a;
      },

      //Show a default graph
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

      //Show the graph selected by the user
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

        //Binding the click event over a node, showing the node's name at the console
        s.bind('clickNode', function(e) {
            d = e.data.node.label;
            var prev = d.split(" ");
            var next = prev[1];
            selectedNeuronsArray.push(next);
            var type = findType(d);
            var targets = findTarget(d);
            var auxTargets = targets.split(" ");
            if (auxTargets.length > 3) {
              var targets0 = auxTargets[0];
              var targets1 = auxTargets[1];
              var targets2 = auxTargets[2];
            }

            var nodeToRemove = document.getElementById('neuronInfo');
              while (nodeToRemove.firstChild) {
                  nodeToRemove.removeChild(nodeToRemove.firstChild);
              }

            var div =  document.getElementById('neuronInfo');
            div.innerHTML = div.innerHTML + '<b>ID: </b>' + d;
            div.innerHTML = div.innerHTML + '<br><br>';
            div.innerHTML = div.innerHTML + '<b>T: </b>' + type;
            div.innerHTML = div.innerHTML + '<br><br>';
            if (targets.length > 3) {
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + targets0 + ', ' + targets1 + ', ' + targets2 + ' ';
              var element =  document.createElement("input");
              element.type = "button";
              element.value = "...";
              element.name = "...";
              element.onclick = function() {
                alert ('Total dest.: '+targets);
              }
              div.appendChild(element);
            }
            else if (targets == "-"){
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + 'no dest.';
            }

            else {
              div.innerHTML = div.innerHTML + '<b>ID dest.: </b>' + targets;
            }



            document.getElementById('neuronInfo').style.display="inline";
            document.getElementById('neuronInfo').style.visibility="visible";

            //------------------------------------------------------------------------------------------------
            //individual neuron selection
            var phrase;

            for (var i=0;i<selectedNeuronsArray.length;i++) {

              if (i==0) { //First elem
                phrase = selectedNeuronsArray[i];
                phrase = phrase + ',';
              }
              else if (i==selectedNeuronsArray.length-1) { //If it's the last neuron it mustn't have a final comma
                phrase = phrase + selectedNeuronsArray[i];
              }

              else { //middle element, should have final comma
                phrase = phrase + selectedNeuronsArray[i];
                phrase = phrase + ','
              }

            }

            var elemToRemove = document.getElementById('bar');
              while (elemToRemove.firstChild) {
                  elemToRemove.removeChild(elemToRemove.firstChild);
              }

            var div =  document.getElementById('bar');
            div.innerHTML = div.innerHTML + '<input id="inputNeuron" type="text" value="'+phrase+'"><br><br>';
        });


      }
    }
  });
