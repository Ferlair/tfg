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

  .controller('MainCtrl',['$scope','grafoFactory', function($scope, grafoFactory){

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

    //Arrays para almacenar las neuronas de cada tipo
    var arrayMosey = [];
    var arrayGranulle = [];
    var arrayPurkinje = [];
    var arrayDCN = [];
    var arrayGolgi = [];
    var arrayIO = [];

    $scope.activarVisualizaciones = function() {
      document.getElementById('color').style.display = 'inline';
      document.getElementById('bn').style.display = 'none';
    }

    $scope.desactivarVisualizaciones = function() {
      document.getElementById('color').style.display = 'none';
      document.getElementById('bn').style.display = 'inline';
    }

    $scope.desactivarVisualizaciones();

    //Devuelve el color de la arista en función del peso introducido
    $scope.getColor = function(numeroRedondeado) {
      var color;
      switch (numeroRedondeado) {
        case '10': {
          color = "#FF0000";
          break;
        }
        case '9': {
          color = "#F70029";
          break;
        }
        case '8': {
          color = "#E30026";
          break;
        }
        case '7': {
          color = "#E60049";
          break;
        }
        case '6': {
          color = "#DC0046";
          break;
        }
        case '5': {
          color = "#D80061";
          break;
        }
        case '4': {
          color = "#D800C6";
          break;
        }
        case '3': {
          color = "#C00008";
          break;
        }
        case '2': {
          color = "#770008";
          break;
        }
        case '1': {
          color = "#5600D8";
          break;
        }
        case '0': {
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

    //Función que se encarga de asignar un color a cada una de las aristas del json
    $scope.colorearAristas = function(arrayNeuronal) {
      var color;
      var origen;
      var destino;

      for (var i=1; i<jsonCopy.edges.length; i++) {
        origen = jsonCopy.edges[i].source.substr(1);
        destino = jsonCopy.edges[i].target.substr(1);
        var posicion=-1;
        var esta = false;

        while (!esta) {
          posicion++;
          esta = arrayNeuronal[origen].destino[posicion] == destino;
        }

        var peso = arrayNeuronal[origen].peso[posicion];
        color = $scope.getColor(peso);
        jsonCopy.edges[i].color = color;
      }
    }

    $scope.generarJSON = function(arrayNeuronal) {

        var nombreArista = 0;
        var index=0;

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
        for (var i=0; i<arrayNeuronal.length; i++) {
          var nodo = getNodo();

          //Mosey Fibers
          if (arrayNeuronal[i].tipo == '0') {
            arrayMosey.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 1;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.000001;
            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }
            numeroMosey++;
            grafoFactory.numeroMosey = numeroMosey;
          }

          //Granulle Cells
          else if (arrayNeuronal[i].tipo == '1'){
            arrayGranulle.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 4;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.001;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroGranulle++;
            grafoFactory.numeroGranulle = numeroGranulle;
          }

          //Purkinje Cells
          else if(arrayNeuronal[i].tipo == '2') {
            arrayPurkinje.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 6;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0003;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroPurkinje++;
            grafoFactory.numeroPurkinje = numeroPurkinje;
          }

          //DCN Cells
          else if(arrayNeuronal[i].tipo == '3'){
            arrayDCN.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 8;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0004;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroDcn++;
            grafoFactory.numeroDcn = numeroDcn;
          }

          //Golgi Cells
          else if(arrayNeuronal[i].tipo == '4'){
            arrayGolgi.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 10;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.0005;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroGolgi++;
            grafoFactory.numeroGolgi = numeroGolgi;
          }

          //IO Cells
          else if(arrayNeuronal[i].tipo == '5'){
            arrayIO.push(arrayNeuronal[i].id);
            nodo.id = "n"+arrayNeuronal[i].id;
            nodo.label = "neurona "+arrayNeuronal[i].id;
            var radius = 12;
            var angle = Math.random()*Math.PI*2;
            var x = Math.cos(angle)*radius;
            var y = Math.sin(angle)*radius;
            nodo.x=x;
            nodo.y=y;
            nodo.size = 0.006;

            jsonObj.nodes[i] = nodo;

            for (var j=0; j<arrayNeuronal[i].destino.length;j++){
              var arista = getAristas();
              arista.source="n"+arrayNeuronal[i].id;
              arista.target="n"+arrayNeuronal[i].destino[j];
              arista.id="e"+ arista.source+'+'+arista.target;
              if (i==0 && j==0) {
                jsonObj.edges[0] = arista;
              }
              else {
                jsonObj.edges.push(arista);
              }
            }

            numeroIo++;
            grafoFactory.numeroIo = numeroIo;
          }



          numeroTotalNeuronas++;
          grafoFactory.numeroTotalNeuronas = numeroTotalNeuronas;

        }

        //console.log(arrayNeuronal);
        //console.log('numero de mosey '+grafoFactory.numeroMosey);
        jsonCopy = jsonObj;
        $scope.escribirDatos();
        grafoFactory.almacenarArrayMosey(arrayMosey);
        grafoFactory.almacenarArrayGranulle(arrayGranulle);
        grafoFactory.almacenarArrayPurkinje(arrayPurkinje);
        grafoFactory.almacenarArrayDCN(arrayDCN);
        grafoFactory.almacenarArrayGolgi(arrayGolgi);
        grafoFactory.almacenarArrayIO(arrayIO);
        grafoFactory.almacenarJSON(jsonCopy);
        $scope.colorearAristas(arrayNeuronal);
        $scope.activarVisualizaciones();

    }

    //Entrada: fichero de texto con datos neuronales
    //Salida:
    $scope.nuevoCargarNeuronas = function($fileContent) {
      var lineas = $fileContent.split("\n");
      var palabrasPorLineas;
      var origen = [];
      var destino = [];
      var tipo = [];
      var peso = [];
      var arrayNeuronal = new Array();

      for (var j=0; j<lineas.length; j++) {
        var aux = lineas[j].replace(/\s+/g, " ");
        lineas[j] = aux;
      }

      for (var i=0; i<lineas.length; i++) {
        palabrasPorLineas = lineas[i].split(" ");
        origen[i] = palabrasPorLineas[0];
        destino[i] = palabrasPorLineas[1];
        tipo[i] = palabrasPorLineas[4];
        peso[i] = palabrasPorLineas[5];
        //console.log('origen '+origen[i]+' destino '+destino[i]+ 'tipo '+tipo[i]+ ' iteración '+i);
      }

      //Obtenemos el número total de neuronas que contiene el archivo
      grafoFactory.numeroTotalNeuronas = $scope.obtenerNumeroNeuronas(origen,destino);

      //Inicializamos el array con un valor para cada una de las neuronas que hay en el fichero
      //El valor inicial es de id igual al número de neurona, destino la propia neurona y peso 0
      arrayNeuronal = $scope.inicializarArray(grafoFactory.numeroTotalNeuronas, arrayNeuronal);

      //A continuación se lee una a una cada neurona y se agrega su neurona de destino y un peso
      for (var j=0; j<destino.length; j++) {
        var elementoRepetido = arrayNeuronal[origen[j]].destino.indexOf(destino[j]);
        if (elementoRepetido==-1) {
          var p = peso[j];
          arrayNeuronal[origen[j]].peso.push(p.toString());
          arrayNeuronal[origen[j]].destino.push(destino[j]); //Se agrega el destino
        }

      }
      //console.log(arrayNeuronal);

      //Asignación del tipo de neurona
      for (var i=0; i<origen.length; i++) {
        var auxTipo = tipo[i];
        var auxPos = origen[i];

        //Inicialmente cada neurona no tiene un tipo asignado, se inicializa
        //con el primer valor que encuentra como tipo, mientras que rechaza los siguientes
        //para evitar múltiples valores para el tipo para la misma neurona
        if (arrayNeuronal[auxPos].tipo == '-') {

          arrayNeuronal[auxPos].tipo = auxTipo;
        }
      }

      //Las neuronas que no tenían un tipo asignado en el fichero reciben el valor 0 por defecto
      for (var i=0; i<(arrayNeuronal.length); i++) {
        var pesoPorDefecto = 0;
        if (arrayNeuronal[i].tipo == '-')
          arrayNeuronal[i].tipo = pesoPorDefecto.toString();
      }
      grafoFactory.almacenarArrayNeuronal(arrayNeuronal);
      $scope.generarJSON(arrayNeuronal);
    }

    //Se obtiene el número de neurona más alto, teniendo en cuenta tanto las neuronas de origen como de destino
    //de esta manera, se inicializará el array con los valores de id del 0 al número más alto obtenido en esta función
    $scope.obtenerNumeroNeuronas = function(origen,destino) {
      var maximoOrigen = Math.max.apply(null,origen);
      var maximoDestino = Math.max.apply(null,destino);
      var max = Math.max(maximoOrigen, maximoDestino);
      max++;
      return max;
    }

    //Debemos crear una celda del array para cada una de las neuronas, con valores iniciales por defecto
    $scope.inicializarArray = function(limite, arrayNeuronal) {
      for (var i=0; i<limite; i++) {
        var neurona = new Array();
        var pesoInicial = 0;
        neurona.destino = [];
        neurona.peso = [];
        neurona.id = i.toString();
        neurona.destino.push(i.toString());
        neurona.peso.push(pesoInicial.toString());
        neurona.tipo = '-';
        arrayNeuronal.push(neurona);
      }
      return arrayNeuronal;
    }

  }])
