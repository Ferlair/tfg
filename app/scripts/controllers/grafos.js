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

    //var datosArray;
    var jsonCopy;

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

            //if (i==1822)
             //nodo.hidden = true;

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

        jsonCopy = jsonObj;

        //obj =JSON.parse(jsonObj.nodes[0]);
        //jsonObj.nodes[1822].hidden = true;
        //console.log(jsonObj.nodes[1822]);
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



      //console.log('tamaño array: '+items.length);

      for (var m=0; m<items.length;m++){
        //console.log(m+'mi array: '+items[m]);
      }

      datosArray = items;

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

        jsonCopy = jsonObj;

        //Mostramos el grafo por pantalla
        grafoFactory.cargar(jsonObj);


    }



    //Función para mostrar un grafo por defecto
    $scope.mostrar_grafo = function() {
        refresh();
        grafoFactory.crearGrafo();
    }

    //FUNCIÓN DE PRUEBA PARA MOSTRAR MENSAJES -------------------------
    $scope.mostrarSaludo = function(numero) {
      var x = document.getElementById(numero);
      if (x.checked)
        console.log ('La neurona número '+numero+ ' está activada');
      else {
        console.log ('La neurona número '+numero+' está desactivada');
      }
    }

    // FUNCIÓN DE PRUEBA -----------------------------------------------------------------------------------------
    $scope.comprobar = function() {

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

    /*$scope.mostrarDatos = function(check) {
      var mosey = document.getElementById('1');
      var granulle = document.getElementById('2');
      var purkinje = document.getElementById('3');
      var dcn = document.getElementById('4');
      var golgi = document.getElementById('5');
      var io = document.getElementById('6');

      var valorMosey = 2;
      var valorGranulle = 3;
      var valorpurkinje = 4;

      console.log ('tamaño datosArray: '+datosArray.length);
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
      };

      //Creación del lienzo inicial
      for (var i=0; i<1871; i++) {
        var nodo = getNodo();
        var arista = getAristas();
        nodo.id = "n"+i;
        nodo.label = "neurona "+i;

        //Mosey Fibers
        if (i>=0 && i<248) {
          var radius = 1;
          var angle = Math.random()*Math.PI*2;
          //var angle = valorMosey*Math.PI*2;
          //valorMosey = valorMosey * 10;
          var x = Math.cos(angle)*radius;
          var y = Math.sin(angle)*radius;
          nodo.x=x;
          nodo.y=y;
          nodo.size = 1;

          if (!mosey.checked)
            nodo.hidden = true;

          jsonObj.nodes[i] = nodo;

          arista.id = "e"+i;
          arista.source = "n" + i;
          arista.target = "n" + i;
          jsonObj.edges[i] = arista;

          for (var j=1; j<datosArray[i].length;j++){
            arista.id="e"+i;
            arista.source="n"+i;
            arista.target="n"+datosArray[i][j];
            jsonObj.edges[i]=arista;
          }

        }

        //Granulle Cells
        else if (i>=248 && i<1748){
          var radius = 4;
          var angle = Math.random()*Math.PI*2;
          var x = Math.cos(angle)*radius;
          var y = Math.sin(angle)*radius;
          nodo.x=x;
          nodo.y=y;
          nodo.size = 1;

          if (!granulle.checked)
            nodo.hidden = true;

          jsonObj.nodes[i] = nodo;

          arista.id = "e"+i;
          arista.source = "n" + i;
          arista.target = "n" + i;
          jsonObj.edges[i] = arista;

          for (var j=1; j<datosArray[i].length;j++){
            arista.id="e"+i;
            arista.source="n"+i;
            arista.target="n"+datosArray[i][j];
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

          if (!purkinje.checked)
            nodo.hidden = true;

          jsonObj.nodes[i] = nodo;

          arista.id = "e"+i;
          arista.source = "n" + i;
          arista.target = "n" + i;
          jsonObj.edges[i] = arista;

          for (var j=1; j<datosArray[i].length;j++){
            arista.id="e"+i;
            arista.source="n"+i;
            arista.target="n"+datosArray[i][j];
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

          if (!dcn.checked)
            nodo.hidden = true;

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

          if (!golgi.checked)
            nodo.hidden = true;

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

          if (!io.checked)
            nodo.hidden = true;

          jsonObj.nodes[i] = nodo;

          arista.id = "e"+i;
          arista.source = "n" + i;
          arista.target = "n" + i;
          jsonObj.edges[i] = arista;
        }
        //jsonCopy = jsonObj;
      //  console.log("Valor angle: "+ angle);


      }
      grafoFactory.cargar(jsonObj);
    }*/

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
