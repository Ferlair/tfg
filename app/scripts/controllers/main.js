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

  /*.controller ('GrafosCtrl', ['$scope', function($scope){

        $scope.otro = "Hola";


  }])*/

  .controller('MainCtrl',['$scope','renderFactory','grafoFactory', function($scope, renderFactory, grafoFactory){

    //Código para Sigma.js
    //grafoFactory.crearGrafo();


    //Código para la visualización con WebGl, descomentar para funcionalidad
    /*init();

    function init() {
        renderFactory.createCamera();
        renderFactory.createCube();
        renderFactory.setup();
        renderFactory.paint();
    }*/



    /*$scope.mostrar = function(numero){
      switch (numero) {
        case 1: //grafoFactory.crearGrafo();
                break;
        case 2: $scope.algo="nada que mostrar";
                break;
        case 3:
                break;
        case 4: $scope.algo="../app/images/grafico_lineal.jpg";
                break;
        case 5: $scope.algo="../app/images/grafico_tarta.png";
                break;
        default:

      }
    }*/
  }])

  .factory ('renderFactory', function renderFactory(){
          var xrotation;
          var yrotation;
          var zrotation;
          var WIDTH = 600;
          var HEIGHT = 400;
          var ASPECT = WIDTH / HEIGHT;
          var renderer = new THREE.WebGLRenderer();
          var scene = new THREE.Scene();
          var camera;
          var barra1;
          var barra2;
          var barra3;

          return {
              createCube: function () {
                  // variables del cubo que va a representar una de las barras de la gráfica
                  var length = 50;
                  var segments = 16;

                  // el material de la barra
                  var sphereMaterial = new THREE.MeshLambertMaterial({
                      color: 0xFF00FF
                  });


                  barra1 = new THREE.Mesh(new THREE.BoxGeometry(15, 60, 15), sphereMaterial);

                  //Set Cube Rotation
                  barra1.rotation.x += 0.4;
                  barra1.rotation.y += 0.3;
                  barra1.rotation.z += 0.1;

                  barra1.position.set(0, 0.0, -7.0);

                  //Propiedades para la segunda barra

                  barra2 = new THREE.Mesh(new THREE.BoxGeometry(15, 60, 15), sphereMaterial);

                  // posición inicial para la barra
                  barra2.rotation.x += 0.4;
                  barra2.rotation.y += 0.3;
                  barra2.rotation.z += 0.1;

                  barra2.position.set(30, 0.0, -7.0);

                  barra3 = new THREE.Mesh(new THREE.BoxGeometry(15, 60, 15), sphereMaterial);

                  // posición inicial para la barra
                  barra3.rotation.x += 0.4;
                  barra3.rotation.y += 0.3;
                  barra3.rotation.z += 0.1;

                  barra3.position.set(60, 0.0, -7.0);

                  scene.add(new THREE.AmbientLight(0x0000ff));

                  scene.add(barra1, barra2, barra3);

              },
              createCamera: function () {
                  // atributos para la cámara
                  var VIEW_ANGLE = 40;
                  var NEAR = 0.1;
                  var FAR = 10000;

                  // creamos la cámara
                  camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                  ASPECT,
                  NEAR,
                  FAR);

                  // ajuste de la posición de la cámara
                  camera.position.x = 30;
                  camera.position.y = 0;
                  camera.position.z = 100;

                  // añadimos la cámara a la escena
                  scene.add(camera);

              },
              paint: function () {
                  // dibujamos la escena
                  renderer.render(scene, camera);
              },
              setup: function () {
                  // renderización de la escena
                  renderer.setSize(WIDTH, HEIGHT);
                  document.getElementById('container1').appendChild(renderer.domElement);

              }

          };
  });

/*  .factory('grafoFactory', function grafoFactory(){
    return{
      crearGrafo: function(){
        sigma.parsers.json('data.json', {
          renderer: {
            type:'webgl',
            container: document.getElementById('container1')
          },
          settings: {
            defaultNodeColor: '#000'
          }
        });
      }
    }
  });*/
