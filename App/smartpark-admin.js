///admin
var a, b, c, d, e;
document.addEventListener("keypress", unlock);

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
    iLugar = 1;
    for (var i = 0; i < ajustes.filas; i++) {
        var buttonGroup = $("<div/>") // creates a div element
            .attr("id", "bg" + i) // adds the id
            .addClass("btn-group");
        $("#mapa").append(buttonGroup);

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
}
