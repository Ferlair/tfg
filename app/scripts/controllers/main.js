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

  .controller('MainCtrl',['$scope','renderFactory','grafoFactory', function($scope, renderFactory, grafoFactory){

    //Variable destinada a almacenar el json con información de nodos y aristas
    var jsonCopy;

    //Almacenamiento del número de neuronas de cada tipo
    var numeroMosey = 0;
    var numeroGranulle = 0;
    var numeroPurkinje = 0;
    var numeroDcn = 0;
    var numeroGolgi = 0;
    var numeroIo = 0;
    var numeroTotalNeuronas = 0;

    $scope.getColor = function(numeroRedondeado) {
      var color;
      switch (numeroRedondeado) {
        case 10: {
          color = "#FF0000";
          break;
        }
        case 9: {
          color = "#F70029";
          break;
        }
        case 8: {
          color = "#E30026";
          break;
        }
        case 7: {
          color = "#E60049";
          break;
        }
        case 6: {
          color = "#DC0046";
          break;
        }
        case 5: {
          color = "#D80061";
          break;
        }
        case 4: {
          color = "#D800C6";
          break;
        }
        case 3: {
          color = "#C00008";
          break;
        }
        case 2: {
          color = "#770008";
          break;
        }
        case 1: {
          color = "#5600D8";
          break;
        }
        case 0: {
          color = "#1200D8";
          break;
        }
      }

      return color;
    }

    $scope.escribirDatos = function(){

      var div =  document.getElementById('especificaciones');

      div.innerHTML = div.innerHTML + 'Información sobre los datos neuronales cargados:';
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número total de neuronas: </b>'+ grafoFactory.numeroTotalNeuronas;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo Mosey: </b>' + grafoFactory.numeroMosey;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo Granulle: </b>' + grafoFactory.numeroGranulle;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo Purkinje: </b>' + grafoFactory.numeroPurkinje;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo DCN: </b>' + grafoFactory.numeroDcn;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo Golgi: </b>' + grafoFactory.numeroGolgi;
      div.innerHTML = div.innerHTML + '<br><br>';
      div.innerHTML = div.innerHTML + '<b>Número de neuronas tipo IO: </b>' + grafoFactory.numeroIo;

      $scope.checked = true;

    }

    $scope.crearPesos = function() {
      var pesos = [];
      var pesoAleatorio;

      for (var i=0; i<grafoFactory.numeroTotalNeuronas; i++) {
        pesoAleatorio = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
        pesos.push(pesoAleatorio);
      }

      grafoFactory.pesoGlobal = pesos;
      console.log ('tamaño total de neuronas '+grafoFactory.numeroTotalNeuronas);
      console.log ('tamaño array de pesos: '+pesos.length);
      console.log ('tamaño grafofactory pesos: '+grafoFactory.pesoGlobal.length);
    }

    $scope.colorearAristas = function() {
      var color;

      for (var i=0; i<grafoFactory.numeroTotalNeuronas; i++) {
        color = $scope.getColor(grafoFactory.pesoGlobal[i]);
        jsonCopy.edges[i].color = color;
      }
    }

    //PRUEBA -----------------------------------------------------------------------------------
    $scope.mostrarNeuronasLeidas = function(arrayNeuronal) {

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

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //jsonObj.edges[i].color = "#ff0000";
            numeroMosey++;
            grafoFactory.numeroMosey = numeroMosey;

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

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //console.log(grafoFactory.pesoGlobal.length);
            //color = $scope.getColor(grafoFactory.pesoGlobal[i]);
            //jsonObj.edges[i].color = color;
            numeroGranulle++;
            grafoFactory.numeroGranulle = numeroGranulle;
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
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            numeroPurkinje++;
            grafoFactory.numeroPurkinje = numeroPurkinje;
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

            numeroDcn++;
            grafoFactory.numeroDcn = numeroDcn;
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

            numeroGolgi++;
            grafoFactory.numeroGolgi = numeroGolgi;
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

            numeroIo++;
            grafoFactory.numeroIo = numeroIo;
          }

          numeroTotalNeuronas++;
          grafoFactory.numeroTotalNeuronas = numeroTotalNeuronas;

        }

        jsonCopy = jsonObj;
        $scope.crearPesos();
        $scope.escribirDatos();
        grafoFactory.almacenarJSON(jsonCopy);
        $scope.colorearAristas();

    }

    //PRUEBA -----------------------------------------------------------------------------------
    $scope.generarJSON = function(arrayNeuronal) {

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

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //jsonObj.edges[i].color = "#ff0000";
            numeroMosey++;
            grafoFactory.numeroMosey = numeroMosey;

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

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //console.log(grafoFactory.pesoGlobal.length);
            //color = $scope.getColor(grafoFactory.pesoGlobal[i]);
            //jsonObj.edges[i].color = color;
            numeroGranulle++;
            grafoFactory.numeroGranulle = numeroGranulle;
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
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            numeroPurkinje++;
            grafoFactory.numeroPurkinje = numeroPurkinje;
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

            numeroDcn++;
            grafoFactory.numeroDcn = numeroDcn;
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

            numeroGolgi++;
            grafoFactory.numeroGolgi = numeroGolgi;
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

            numeroIo++;
            grafoFactory.numeroIo = numeroIo;
          }

          numeroTotalNeuronas++;
          grafoFactory.numeroTotalNeuronas = numeroTotalNeuronas;

        }

        jsonCopy = jsonObj;
        $scope.crearPesos();
        $scope.escribirDatos();
        grafoFactory.almacenarJSON(jsonCopy);
        $scope.colorearAristas();

    }

    /*$scope.mostrarNeuronasLeidas = function(arrayNeuronal) {

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

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //jsonObj.edges[i].color = "#ff0000";
            numeroMosey++;
            grafoFactory.numeroMosey = numeroMosey;

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

            jsonObj.nodes[i] = nodo;

            arista.id = "e"+i;
            arista.source = "n" + i;
            arista.target = "n" + i;
            jsonObj.edges[i] = arista;

            for (var j=1; j<arrayNeuronal[i].length;j++){
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            //console.log(grafoFactory.pesoGlobal.length);
            //color = $scope.getColor(grafoFactory.pesoGlobal[i]);
            //jsonObj.edges[i].color = color;
            numeroGranulle++;
            grafoFactory.numeroGranulle = numeroGranulle;
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
              arista.id="e"+i;
              arista.source="n"+i;
              arista.target="n"+arrayNeuronal[i][j];
              jsonObj.edges[i]=arista;
            }

            numeroPurkinje++;
            grafoFactory.numeroPurkinje = numeroPurkinje;
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

            numeroDcn++;
            grafoFactory.numeroDcn = numeroDcn;
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

            numeroGolgi++;
            grafoFactory.numeroGolgi = numeroGolgi;
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

            numeroIo++;
            grafoFactory.numeroIo = numeroIo;
          }

          numeroTotalNeuronas++;
          grafoFactory.numeroTotalNeuronas = numeroTotalNeuronas;

        }

        jsonCopy = jsonObj;
        $scope.crearPesos();
        $scope.escribirDatos();
        grafoFactory.almacenarJSON(jsonCopy);
        $scope.colorearAristas();

    }*/

    //Entrada: fichero de texto con datos neuronales
    //Salida: array bidimensional con las aristas para cada neurona
    $scope.cargarNeuronas = function($fileContent) {
      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];

      //VÁLIDO, DESCOMENTAR PARA OBTENER VALORES REALES DEL FICHERO
      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = palabrasPorLineas[0]; //Almacenamos la neurona origen
        destino[i] = palabrasPorLineas[2]; //Almacenamos la neurona destino
      }

      console.log ('numero de lineas: '+lineas.length);

      //BUCLE QUE TOMA VALORES DE ORIGEN Y DESTINO ALEATORIOS PARA PRUEBAS
      /*for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = Math.floor(Math.random() * (1870 - 1 + 1)) + 1;
        destino[i] = Math.floor(Math.random() * (1870 - 1 + 1)) + 1;
      }*/

      console.log ('numero de origen: '+ origen.length);

      var items = [[0]];

      var numeroNeuronas = $scope.obtenerNumeroNeuronas(origen);



      //Creamos el array con el número de neuronas deseados
      for (var j=0; j<numeroNeuronas; j++){
        items.push([0]);
      }

      for (var k=0; k<items.length;k++){
        items[[origen[k]]].push(destino[k]);
      }

      console.log ('items: '+items);

      $scope.mostrarNeuronasLeidas(items);
    }

    //EN PRUEBAS ------------------------------------------------------------------------
    //Entrada: fichero de texto con datos neuronales
    //Salida: array bidimensional con las aristas para cada neurona
    $scope.nuevoCargarNeuronas = function($fileContent) {
      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];
      var arrayNeuronal = new Array();
      //arrayNeuronal.destino = [];
      //arrayNeuronal.peso = [];

      //VÁLIDO, DESCOMENTAR PARA OBTENER VALORES REALES DEL FICHERO
      /*for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = palabrasPorLineas[0]; //Almacenamos la neurona origen
        destino[i] = palabrasPorLineas[2]; //Almacenamos la neurona destino
      }*/

      //ELIMINAR, SÓLO PRUEBAS
      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = Math.floor(Math.random() * (1870 - 1 + 1)) + 1;
        destino[i] = Math.floor(Math.random() * (1870 - 1 + 1)) + 1;
      }

      //console.log ('origen: '+origen.length);

      //Obtenemos el número total de neuronas que contiene el archivo
      grafoFactory.numeroTotalNeuronas = $scope.obtenerNumeroNeuronas(origen,destino);

      //console.log ('numero de neuronas en el fichero: '+grafoFactory.numeroTotalNeuronas);

      //console.log('numeroTotalNeuronas'+grafoFactory.numeroTotalNeuronas);

      arrayNeuronal = $scope.inicializarArray(grafoFactory.numeroTotalNeuronas, arrayNeuronal);



      /*for (var i=0; i<arrayNeuronal.length;i++) {
        console.log ('id: '+arrayNeuronal[i].id);
        console.log ('destino: '+arrayNeuronal[i].destino);
        console.log ('peso: '+arrayNeuronal[i].peso);
      }*/

      var aux;

      for (var j=0; j<10; j++) {
        //$scope.asignarNeurona(origen[j],destino[j], arrayNeuronal);
        //arrayNeuronal[origen[j]].destino.push(destino[j]);
        var aux = [];
        aux.id = 0;
        aux.destino = [];
        aux.peso = [];
        aux = arrayNeuronal[j];
        console.log('aux id: '+ aux.id);
        aux.destino.push(43+j);

        console.log('aux destino: '+aux.destino);
        //console.log(arrayNeuronal[origen[j]].destino);
      }

      //console.log ('numero total de arrayneuronal: '+arrayNeuronal.length);

      //console.log ('arrayNeuronal: '+arrayNeuronal);

    }

    $scope.obtenerNumeroNeuronas = function(origen,destino) {
      var maximoOrigen = Math.max.apply(null,origen);
      var maximoDestino = Math.max.apply(null, destino);
      var max = Math.max(maximoOrigen, maximoDestino);
      max++;
      return max;
    }

    //Prueba para asignar una neurona dentro de nuestro array de neuronas
    //VÁLIDO
    $scope.asignarNeurona = function(origen, destino, arrayNeuronal) {
      /*var esta = false;
      var i=0;
      var peso = Math.floor(Math.random() * (10-1+1)+1);
      var neurona = new Array();
      neurona.destino = [];
      neurona.peso = [];

      //console.log ('aqui: '+arrayNeuronal);

      //Buscamos si la neurona se encontraba previamente en nuestro array de neuronas
      while ((!esta) && (i<arrayNeuronal.length)) {
        esta = (origen==arrayNeuronal[i].id);
        i++;
      }

      if (esta) {
        console.log('esta');
        arrayNeuronal[i-1].destino.push(destino);
        arrayNeuronal[i-1].peso.push(peso);
      }
      else { //Creamos un nuevo objeto y lo añadimos al array de neuronas
        console.log('no está');
        //neurona.id = origen;
        //neurona.destino.push(destino);
        //neurona.peso.push(peso);
        //arrayNeuronal.push(neurona);
      }

      //console.log('array: '+arrayNeuronal);
      //return arrayNeuronal;*/
      var peso = Math.floor(Math.random() * (10-1+1)+1);

      arrayNeuronal[0].destino.push(destino);
      //arrayNeuronal[origen].peso.push(peso);
    }

    //Prueba para la inicialización del arrayNeuronal
    //Debemos crear una celda del array para cada una de las neuronas, con valores iniciales por defecto
    $scope.inicializarArray = function(limite, arrayNeuronal) {
      for (var i=0; i<limite; i++) {
        var neurona = new Array();
        neurona.id = i;
        neurona.destino = i;
        neurona.peso = 0;
        arrayNeuronal.push(neurona);
      }
      return arrayNeuronal;
    }

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
