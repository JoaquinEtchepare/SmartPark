var salida = null;
var estacionamiento = [];
var ajustes = {
    tDiaria: 100,
    tHora: 10,
    filas: 4,
    columnas: 10
};

function crearEstacionamiento(filas, columnas) {
    estacionamiento = [];
    var lugares = parseInt(filas) * parseInt(columnas);

    for (var i = 0; i < lugares; i++) {
        var lugarVacio = {
            ocupado: false,
            nombre: null,
            ci: null,
            matricula: null,
            detalle: null,
            ingreso: null,
            salida: null
        }
        estacionamiento[i] = lugarVacio;
    }
}

function imprimir(smartCard) {
    var old = document.body.innerHTML;
    document.body.innerHTML = '<img style="display: inline-block; width: 200px: height: 250px" src="img/logo.png"/><div id="qrcode2" style="display: inline-block;"></div>';
    crearQr(smartCard, "qrcode2");
    setTimeout(function () {
        window.print();
        document.body.innerHTML = old;
    }, 500);


}

function buscarLugar() {
    var lugar = null;
    estacionamiento.forEach(
        function (item, index) {
            if (lugar == null && item.ocupado == false) {
                lugar = index;
            }
        }
    );
    return lugar;
}

function parkeado(matricula) {
    var result = false;
    estacionamiento.forEach(
        function (item, index) {
            if (item.matricula == matricula) {
                result = index;
            }
        }
    );
    return result;
}

function ocuparLugar(nroLugar, cliente, salida2) {
    var lugar = {
        ocupado: true,
        nombre: cliente.nombre,
        ci: cliente.ci,
        matricula: cliente.matricula,
        detalle: cliente.detalle,
        ingreso: Date.now(),
        salida: salida2
    }
    if (salida != null) {
        salida = null;
    }
    if (parkeado(lugar.matricula) === false) {
        estacionamiento[nroLugar] = lugar;
    }

}



function liberarLugar(nroLugar) {
    var lugarVacio = {
        ocupado: false,
        nombre: null,
        ci: null,
        matricula: null,
        detalle: null,
        ingreso: null,
    }
    estacionamiento[nroLugar] = lugarVacio;
}

function crearQr(cliente, idDelDiv) {
    var qrcode = new QRCode(idDelDiv, {
        text: JSON.stringify(cliente),
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });
}

function ingresarEstadia() {

    swal({
        title: 'Seleccione fecha de salida',
        html: '<input type="date" id="datepicker">',
        showConfirmButton: true,
        customClass: 'swal2-overflow'
    }).then(function (result) {
        var fecha = document.getElementById('datepicker').value;
        salida = moment(fecha).hour(moment().hour()).minutes(moment().minutes());
        var dif = salida.unix() - moment().unix();
        var dias = Math.round(dif / 86400);
        if (moment().isBefore(salida)) {
            swal({
                title: 'Confirma estacionar por ' + dias.toString() + ' dias ?',
                text: "Costo de la estadia: $" + (dias * ajustes.tDiaria).toString(),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00aa06',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {


                    swal({
                        title: 'Acerque su SmartCard al lector',
                        onOpen: () => {
                            swal.showLoading()
                        }
                    })


                }
            })
        } else {
            salida = null;
            swal({
                type: 'error',
                title: 'No puede estacionar en pasado :(',
                showConfirmButton: false,
                timer: 3000
            })
        }


    });
}

function crearCliente() {

    swal.mixin({
        input: 'text',
        confirmButtonText: 'siguiente &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3', "4"]
    }).queue([
        {
            title: 'Nombre',
            text: 'Ej: Juan Perez'
  },
        {
            title: 'C.I',
            text: 'Sin puntos ni guiones'
  },
        {
            title: 'Matricula',
            text: 'Ej: IAA1234'
  },
        {
            title: 'Detalle',
            text: 'Ej: Honda rojo'
  }
]).then((result) => {
        if (result.value) {
            var smartCard = {
                n: result.value[0],
                c: result.value[1],
                m: result.value[2],
                d: result.value[3]
            };

            swal({
                title: 'SmartCard Creada!',
                html: '<div id="qrcode" style="text-align: center;"></div>',
                confirmButtonText: 'Imprimir',
                onOpen: function () {
                    crearQr(smartCard, "qrcode");
                }
            }).then(function () {
                setTimeout(function () {
                    imprimir(smartCard)
                }, 500);
            })
        }
    })
}

function ingresoNormal(contenido) {
    var smartCard = JSON.parse(contenido);
    var cliente = {
        nombre: smartCard.n,
        ci: smartCard.c,
        matricula: smartCard.m,
        detalle: smartCard.d
    }
    var lugarSugerido = buscarLugar();
    swal({
        title: cliente.nombre + ', prefieres el lugar ' + (lugarSugerido + 1).toString() + '?',
        text: "Costo de la estadia: $" + ajustes.tHora.toString() + " por hora.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00aa06',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cambiar lugar'
    }).then((result) => {

        if (result.value) {
            ocuparLugar(lugarSugerido, cliente, null);
            swal({
                type: 'success',
                title: cliente.nombre + ', circule hasta el lugar ' + (lugarSugerido + 1).toString(),
                showConfirmButton: false,
                timer: 3000
            })

        } else {
            var lugaresLibres = [];
            estacionamiento.forEach(
                function (lugar, nroLugar) {
                    if (lugar.ocupado == false) {
                        lugaresLibres.push(nroLugar + 1);
                    }
                }
            );
            swal({
                title: 'Seleccione lugar',
                input: 'select',
                inputOptions: lugaresLibres,
                inputPlaceholder: 'Lugar...',
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    var miLugar = lugaresLibres[result.value];
                    ocuparLugar(miLugar - 1, cliente, null);
                    swal({
                        type: 'success',
                        title: cliente.nombre + ', circule hasta el lugar ' + miLugar,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            })



        }
    })
}


function ingresoEstadia(contenido) {
    var smartCard = JSON.parse(contenido);
    var cliente = {
        nombre: smartCard.n,
        ci: smartCard.c,
        matricula: smartCard.m,
        detalle: smartCard.d
    }
    var lugarSugerido = buscarLugar();
    swal({
        title: cliente.nombre + ', prefieres el lugar ' + (lugarSugerido + 1).toString() + '?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00aa06',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cambiar lugar'
    }).then((result) => {

        if (result.value) {
            ocuparLugar(lugarSugerido, cliente, salida.unix());
            swal({
                type: 'success',
                title: cliente.nombre + ', circule hasta el lugar ' + (lugarSugerido + 1).toString(),
                showConfirmButton: false,
                timer: 3000
            })

        } else {
            var lugaresLibres = [];
            estacionamiento.forEach(
                function (lugar, nroLugar) {
                    if (lugar.ocupado == false) {
                        lugaresLibres.push(nroLugar + 1);
                    }
                }
            );
            swal({
                title: 'Seleccione lugar',
                input: 'select',
                inputOptions: lugaresLibres,
                inputPlaceholder: 'Lugar...',
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    var miLugar = lugaresLibres[result.value];
                    ocuparLugar(miLugar - 1, cliente, salida.unix());
                    swal({
                        type: 'success',
                        title: cliente.nombre + ', circule hasta el lugar ' + miLugar,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            })



        }
    })
}

function retirada(smartCard, lugar, tipo) {
    switch (tipo) {
        case 1:
            var horas = (Date.now() - estacionamiento[lugar].ingreso) / 3600 / 1000;
            horas = Math.round(horas * 10) / 10;
            var money = horas * ajustes.tHora;
            swal({
                title: 'Salida',
                text: "Su estadia es de " + horas + "hs, con un costo de $" + money,
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'PAGAR $'+money+'!'
            }).then((result) => {
                if (result.value) {
                    swal(
                        'Gracias!',
                        smartCard.n + ', esperamos volverlo a ver pronto!',
                        'success'
                    );
                    liberarLugar(lugar);
                }
            })
            break;
        case 2:
            var dias = (estacionamiento[lugar].salida - (estacionamiento[lugar].ingreso) / 1000) / 86400;
            dias = Math.round(dias);
            var money = dias * ajustes.tDiaria;
            swal({
                title: 'Salida',
                text: "Su estadia es de " + dias + " dias, con un costo de $" + money,
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'PAGAR $'+money+'!'
            }).then((result) => {
                if (result.value) {
                    swal(
                        'Gracias!',
                        smartCard.n + ', esperamos volverlo a ver pronto!',
                        'success'
                    );
                    liberarLugar(lugar);
                }
            })
            break;
        case 3:
            var dias = (estacionamiento[lugar].salida - (estacionamiento[lugar].ingreso) / 1000) / 86400;
            dias = Math.round(dias);
            var money = dias * ajustes.tDiaria;
            var horas = (moment().unix()-estacionamiento[lugar].salida)/3600;
            horas = Math.round(horas * 10) / 10;
            var recargo = horas * ajustes.tHora;
            swal({
                title: 'Pasado de hora...',
                text: "Excedio " + horas + "hs. de los "+dias+" dias contratados con un costo de $" + money +" mas un recargo de $"+recargo,
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'PAGAR $'+(money+recargo).toString()+'!'
            }).then((result) => {
                if (result.value) {
                    swal(
                        'Gracias!',
                        smartCard.n + ', esperamos volverlo a ver pronto!',
                        'success'
                    );
                    liberarLugar(lugar);
                }
            })
            break;
    }

}

function tarifas() {

}

function ayuda() {

}
var lectorqr = new Instascan.Scanner({
    video: document.getElementById('monitor'),
});
lectorqr.addListener('scan', function (contenido) {
    var smartCard = JSON.parse(contenido);
    if (parkeado(smartCard.m) === false) {
        if (salida != null) {
            swal.close();
            ingresoEstadia(contenido);
        } else {
            ingresoNormal(contenido);
        }
    } else {
        var lugar = parkeado(smartCard.m);
        if (estacionamiento[lugar].salida == null) {
            retirada(smartCard, lugar, 1);
        } else if (moment().isBefore(estacionamiento[lugar].salida * 1000)) {
            retirada(smartCard, lugar, 2);
            console.log(2, estacionamiento[lugar]);
        } else if (moment().isAfter(estacionamiento[lugar].salida * 1000)) {
            retirada(smartCard, lugar, 3);
            console.log(3, estacionamiento[lugar]);
        }

    }


});
Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        lectorqr.start(cameras[0]);
    } else {
        console.error('No hay camaras.');
    }
}).catch(function (e) {
    console.error(e);
});
crearEstacionamiento(ajustes.filas, ajustes.columnas);

//////////////////
