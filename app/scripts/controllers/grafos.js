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

    //Función que reinicia el elemento 'container',
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
        //Input: número de nodos que el usuario desea representar en pantalla
        //Output: Objeto json con el número de nodos deseados, completados con valores aleatorios
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
            edgeColor: "#a30707",
            defaultLabelHoverColor: "#ffffff",
            NodeColor: '#000001',
            defaultLabelColor: '#0010ff'

          }
        })
      }
    }
  });
