///admin
var a, b, c, d, e;
document.addEventListener("keypress", unlock);
var porcentajes=[];
var table = document.getElementById("lista");
function agregarfila(n, nombre, matricula, detalle, entrada, salida){
 // Create an empty <tr> element and add it to the 1st position of the table:
var row = table.insertRow(0);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
var cell5 = row.insertCell(4);
var cell6 = row.insertCell(5);

// Add some text to the new cells:
cell1.innerHTML = n;
cell2.innerHTML = nombre;
cell3.innerHTML = matricula;
cell4.innerHTML = detalle;
cell5.innerHTML = moment(entrada).format("D, MMM YYYY, h:mm a");
if (salida>0) {
    cell6.innerHTML = moment(salida*1000).format("D, MMM YYYY, h:mm a");
}
}

function unlock(evento) {
    a = b;
    b = c;
    c = d;
    d = e;
    e = evento.keyCode;
    if (a == 97 && b == 100 && c == 109 && d == 105 && e == 110) {
        iniciarAdmin();
        $("#myModal2").modal();
    }
}

function iniciarAdmin() {
    document.getElementById('mapa').innerHTML = '';
    document.getElementById('lista').innerHTML = '';
    iLugar = 1;
    for (var i = 0; i < ajustes.filas; i++) {
        var buttonGroup = $("<div/>") // creates a div element
            .attr("id", "bg" + i) // adds the id
            .addClass("btn-group");
        $("#mapa").append(buttonGroup);
         $("#mapa").append("<br>");

        for (var i2 = 0; i2 < ajustes.columnas; i2++) {
            var casillero = ('0' + iLugar).slice(-2);
            var clase = "btn btn-";
            var desc = "Libre";
            if (estacionamiento[iLugar - 1].afuera) {
                clase += "info";
                desc = estacionamiento[iLugar - 1].nombre + '<br>' + estacionamiento[iLugar - 1].matricula + '<br>' + estacionamiento[iLugar - 1].detalle;
            } else if (estacionamiento[iLugar - 1].salida != null) {
                clase += "warning";
                desc = estacionamiento[iLugar - 1].nombre + '<br>' + estacionamiento[iLugar - 1].matricula + '<br>' + estacionamiento[iLugar - 1].detalle;
            } else if (estacionamiento[iLugar - 1].ocupado == true) {
                clase += "danger";
                desc = estacionamiento[iLugar - 1].nombre + '<br>' + estacionamiento[iLugar - 1].matricula + '<br>' + estacionamiento[iLugar - 1].detalle;
            } else {
                clase += "success";
            
            };

                if (estacionamiento[iLugar - 1].ocupado==true) {
                    var Lugar= estacionamiento[iLugar - 1];
                    agregarfila(iLugar, Lugar.nombre, Lugar.matricula, Lugar.detalle, Lugar.ingreso, Lugar.salida);
            }
            var boton = $('<button/>').attr({
                name: 'btn' + i2,
                class: clase,
                'data-toggle': "tooltip",
                'data-html': "true",
                title: desc
            }).html(casillero);
            $("#bg" + i).append(boton);
            iLugar++;
        }
    }
    $('[data-toggle="tooltip"]').tooltip();
    // Find a <table> element with id="myTable":
    graficar();

}
function guardarPorcentaje(){
    var ocupados=0; 
    var vacios=0;
    estacionamiento.forEach(
            function(item){
                if (item.ocupado==true) {
                    ocupados= ocupados+1;
                } else{
                    vacios=vacios+1;
                }

            }
        );
    var total= ocupados+vacios;
    var porcentaje= ocupados/total*100;
    var hora= Date.now();
    var temporal={
        porcentaje: porcentaje,
        horas: hora
        }
        porcentajes.push(temporal);

}
setInterval(guardarPorcentaje, ajustes.frecuencia*60*60*1000);
guardarPorcentaje();






function graficar(){
    var ctx = document.getElementById("myChart");
    var valores=[];
    var horas=[];
    porcentajes.forEach(
            function(item){
             valores.push(item.porcentaje);

             horas.push(moment(item.horas).format("D, MMM YYYY, h:mm a"));
             
}
);

            
        
    var scatterChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: "% Lugares ocupados",
            backgroundColor:"rgba(150,0,0,0.5)",
        borderColor:"rgba(150,0,0,0.3)",
       
            data: valores
        }]
    },
    options: {
        
        scales: {
            xAxes: [{
                type: 'category',
                labels: horas
                
            }],
            yAxes: [{
                 ticks: {
                    beginAtZero:true,
                     min: 0,
                max: 100
                }
               
            }]
        }
    }
});

}