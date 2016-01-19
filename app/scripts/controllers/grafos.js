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
      /*var numero = {
                      [
                        {
                          "id": "n"+$nodos,
                          "label":"$nodos",
                          "x": 1,
                          "y": 2,
                          "size": 4
                        },
                        {
                          "id": "n1",
                          "label": "Another node",
                          "x": 3,
                          "y": 1,
                          "size": 2
                        }
                      ],
                      [
                        {
                          "id": "e0",
                          "source": "n"+$nodos,
                          "target": "n1"
                        }
                      ]
                    };
          //console.log(str);
        //  $scope.numeros = JSON.parse($scope.numeros);
        grafoFactory.cargar(numero);*/
        var jsonObj = { nodes: [
                            {
                              /*id: "n0",
                              label: "nodo1",
                              x: "1",
                              y: "2",
                              size: "4"*/
                            }
                          ],
                        edges: [
                          {
                             "id": "e0",
                             "source": "n0",
                             "target": "n1"
                          }
                        ]};

      /*  var nodes =
                            {
                              //id: "n0",
                              label: "nodo1",
                              x: "1",
                              y: "2",
                              size: "4"
                            };*/
      //  var nodo = $nodos;

        //nodes.id = "n"+$nodos;

        //var aleatorio = Math.floor((Math.random() * 20) + 1);
        //console.log (aleatorio);

        var nodo = {
                      id: "",
                      label: "",
                      x: "",
                      y: "",
                      size: ""
                    }; //Almacena las características de cada nodo


        var arista = {
                       "id": "e0",
                       "source": "n0",
                       "target": "n1"
                      }; //Almacena las características de cada arista

        for (var i=0; i < $nodos; i++) {
          console.log(i);
          nodo.id = "n"+i;
          nodo.label = "nodo"+i;
          nodo.x = "" + (Math.floor((Math.random()*20)+1));
          nodo.y = "" + (Math.floor((Math.random()*20)+1));
          nodo.size = "" + (Math.floor((Math.random()*20)+1));

          jsonObj.nodes[i] = nodo;

          //Creación de aristas
          arista.id = "e"+i;
          arista.source = "n" + (Math.floor((Math.random()*i)+1));
          arista.target = "n" + (Math.floor((Math.random()*i)+1));

          jsonObj.edges[i] = arista;
        }

        console.log(jsonObj);

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
            defaultNodeColor: '#ef9c04',
            defaultLabelColor: '#ef9c04'
          }
        })
      }
    }
  });
