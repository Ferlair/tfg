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

    $scope.cargarNeuronas = function($fileContent) {
      /*var str = "Hola mundo \nadios \nhasta luego";
      var n = str.split("\n");
      console.log(str);
      console.log("n: "+n);
      var palabra = n[0].split(" ");
      var pal2 = n[2].split(" ");
      console.log ("palabra: "+palabra);
      console.log(palabra[0]);
      console.log(pal2[1]);*/

      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];

      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        //console.log ("str: "+str[i]);
        //console.log("linea: "+palabrasPorLineas[0]);
        origen[i] = palabrasPorLineas[0];
        destino[i] = palabrasPorLineas[2];
        //console.log ("origen: "+origen);
        //console.log("destino: "+destino);
      }

      console.log(lineas);
      console.log("cantidad origen: "+origen.length);
      console.log("primeros origen: "+origen[0]+origen[1] +origen[2]);
      console.log("cantidad destino: "+destino.length);
      console.log("primeros destino: "+destino[0]+destino[1]+destino[2]);

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
            defaultHoverLabelBGColor: "#0010ff",
            nodeHoverColor: "#fff",
            defaultNodeHoverColor: "#fff",
            edgeColor: "#a30707",
            defaultLabelHoverColor: "#ffffff",
            NodeColor: '#000001',
            defaultLabelColor: '#0010ff'
          }
        })
      }
    }
  });
