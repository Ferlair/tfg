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


    $scope.mostrarNeuronasLeidas = function(arrayNeuronal) {

        refresh();

        console.log('tamaño TOTAL de arrayneuronal: '+arrayNeuronal.length);

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
        for (var i=0; i<1871; i++) {
          var nodo = getNodo();
          var arista = getAristas();
          nodo.id = "n"+i;
          nodo.label = "neurona "+i;

          //Mosey Fibers
          if (i>=0 && i<248) {
            //console.log('estamos en bucle 1');
            var radius = 1;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 1;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            /*arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + 2;
            jsonObj.edges[i] = arista;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + 3;
            jsonObj.edges[i] = arista;*/
            //console.log('arrayneuronal tamaño: '+arrayNeuronal[i].length);

            for (var j=1; j<arrayNeuronal[i].length;j++){
              //console.log('tamaño arrayneuronal en la posición i: '+arrayNeuronal[i].length);
              //console.log('neurona '+i+': ');
              //console.log('arista número '+j+': '+arrayNeuronal[i][j]);
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

          }

          //Granulle Cells
          else if (i>=248 && i<1748){
            console.log('estamos en bucle 2');
            var radius = 4;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 1;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            for (var j=1; j<arrayNeuronal[i].length;j++){
              //console.log('tamaño arrayneuronal en la posición i: '+arrayNeuronal[i].length);
              //console.log('neurona '+i+': ');
              //console.log('arista número '+j+': '+arrayNeuronal[i][j]);
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }
          }

          //Purkinje Cells
          else if(i>=1748 && i<1796) {
            var radius = 6;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 2;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            for (var j=1; j<arrayNeuronal[i].length;j++){
              //console.log('tamaño arrayneuronal en la posición i: '+arrayNeuronal[i].length);
              //console.log('neurona '+i+': ');
              //console.log('arista número '+j+': '+arrayNeuronal[i][j]);
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }
          }

          //DCN Cells
          else if(i>=1796 && i<1820){
            var radius = 8;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 1;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;
          }

          //Golgi Cells
          else if(i>=1820 && i<1823){
            var radius = 10;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 1;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;
          }

          //IO Cells
          else if(i>=1823 && i<=1870){
            var radius = 12;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 1;

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;
          }

        }
        grafoFactory.cargar(jsonObj);
    }

    //Entrada: fichero de texto con datos neuronales
    //Salida: array bidimensional con las aristas para cada neurona
    $scope.cargarNeuronas = function($fileContent) {

      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];

      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = palabrasPorLineas[0]; //Almacenamos la neurona origen
        destino[i] = palabrasPorLineas[2]; //Almacenamos la neurona destino
      }

      var items = [[0]];

      //Creamos el array con el número de neuronas deseados
      for (var j=0; j<1871; j++){
        items.push([0]);
      }

      for (var k=0; k<items.length;k++){
        items[[origen[k]]].push(destino[k]);
      }



      console.log('tamaño array: '+items.length);

      for (var m=0; m<items.length;m++){
        console.log(m+'mi array: '+items[m]);
      }

      $scope.mostrarNeuronasLeidas(items);

    }

    //Función para mostrar/esconder el html de generar grafo
    $scope.visibilidad = function(visible) {
      $scope.checked = visible;
    }

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

    //Función encargada de cargar el grafo seleccionado por el usuario
    $scope.cargarGrafo = function($fileContent) {
      refresh();
      //Debe transformarse el texto al formato json para su correcta visualización
      $fileContent = JSON.parse($fileContent);

      grafoFactory.cargar ($fileContent);
    }


    //Input: número de nodos que el usuario desea representar en pantalla
    //Output: Objeto json con el número de nodos deseados, completados con valores aleatorios
    $scope.generarGrafo = function($nodos) {
      refresh();

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
        }

        //Creación de valores aleatorios de nodos y aristas
        for (var i=0; i < $nodos; i++) {
          var nodo = getNodo();
          var arista = getAristas();

          nodo.id = "n"+i;
          nodo.label = "neurona"+i;
          nodo.x = "" + (Math.floor((Math.random()*100)+1));
          nodo.y = "" + (Math.floor((Math.random()*100)+1));
          nodo.size = "" + (Math.floor((Math.random()*40)+1));

          jsonObj.nodes[i] = nodo;

          //Creación de aristas
          arista.id = "e"+i;
          arista.source = "n" + i;
          arista.target = "n" + (Math.floor((Math.random()*i)+1));

          jsonObj.edges[i] = arista;
        }

        //Mostramos el grafo por pantalla
        grafoFactory.cargar(jsonObj);

    }

    //Función para mostrar un grafo por defecto
    $scope.mostrar_grafo = function() {
        refresh();
        grafoFactory.crearGrafo();
    }

  }])

  .factory('grafoFactory', function grafoFactory(){
    return{

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
            defaultNodeColor: "#000000",
            nodeHoverColor: "#0000ff",
            defaultNodeHoverColor: "#0000ff",
            defaultEdgeColor: "#003300",
            edgeColor: "#003300",
            defaultLabelHoverColor: "#0010ff",
            defaultLabelColor: '#0010ff'
          }
        })
      }
    }
  });
