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


    var jsonCopy;

    $scope.inicio = function() {
      refresh();
      jsonCopy = grafoFactory.recuperarJSON();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.inicio();

    //Función para mostrar/esconder el html de generar grafo  ------
    /*$scope.visibilidad = function(visible) {
      $scope.checked = visible;
    }*/

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
    /*$scope.cargarGrafo = function($fileContent) {
      refresh();
      //Debe transformarse el texto al formato json para su correcta visualización
      $fileContent = JSON.parse($fileContent);

      grafoFactory.cargar ($fileContent);
    }*/


    //Input: número de nodos que el usuario desea representar en pantalla
    //Output: Objeto json con el número de nodos deseados, completados con valores aleatorios
    /*$scope.generarGrafo = function($nodos) {
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

        jsonCopy = jsonObj;

        //Mostramos el grafo por pantalla
        grafoFactory.cargar(jsonObj);

    }*/


    //Función para mostrar un grafo por defecto
    /*$scope.mostrar_grafo = function() {
        refresh();
        grafoFactory.crearGrafo();
    }*/

    //
    $scope.comprueba = function() {
      var mosey = document.getElementById('1');
      var granulle = document.getElementById('2');
      var purkinje = document.getElementById('3');
      var dcn = document.getElementById('4');
      var golgi = document.getElementById('5');
      var io = document.getElementById('6');

      //Mostrar/ocultar neuronas mosey
      if (!mosey.checked) {
        for (var i=0; i<248; i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=0; i<248; i++)
          jsonCopy.nodes[i].hidden = false;
      }

      //Mostrar/ocultar neuronas granulle
      if (!granulle.checked) {
        for (var i=248; i<1748;i++)
        jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=248; i<1748;i++)
        jsonCopy.nodes[i].hidden = false;
      }

      //Mostrar/ocultar neuronas purkinje
      if (!purkinje.checked) {
        for (var i=1748; i<1796;i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=1748; i<1796;i++)
          jsonCopy.nodes[i].hidden = false;
      }

      //Mostrar/ocultar neuronas dcn
      if (!dcn.checked) {
        for (var i=1796; i<1820;i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=1796; i<1820;i++)
          jsonCopy.nodes[i].hidden = false;
      }

      //Mostrar/ocultar neuronas golgi
      if (!golgi.checked) {
        for (var i=1820; i<1823;i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=1820; i<1823;i++)
          jsonCopy.nodes[i].hidden = false;
      }

      //Mostrar/ocultar neuronas io
      if (!io.checked) {
        for (var i=1823; i<=1870;i++)
          jsonCopy.nodes[i].hidden = true;
      }
      else {
        for (var i=1823; i<=1870;i++)
          jsonCopy.nodes[i].hidden = false;
      }

      refresh();
      grafoFactory.cargar(jsonCopy);
    }

    $scope.slider = {
        min: 0,
        max: 248,
        options: {
        floor: 0,
        ceil: 248
      }
    };

  }])

  .factory('grafoFactory', function grafoFactory(){
    var jsonRecibido;
    return{

      recuperarJSON: function() {
        return jsonRecibido;
      },

      almacenarJSON: function(js){
        jsonRecibido = js;
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
        new sigma ({
          graph: grafo,
          renderer: {
            type: 'webgl',
            container: document.getElementById('container2')
          },
          settings: {
            defaultNodeColor: "#ffffff",
            nodeHoverColor: "#0000ff",
            defaultNodeHoverColor: "#0000ff",
            defaultEdgeColor: "#00ff00",
            edgeColor: "#00ff00",
            defaultLabelHoverColor: "#0010ff",
            defaultLabelColor: '#0010ff'
          }
        })
      }
    }
  });
