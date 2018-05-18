var estacionamiento=[];
function crearEstacionamiento(filas,columnas){
  var lugares=parseInt(filas)*parseInt(columnas);

  for (var i = 0; i < lugares; i++) {
    var lugarVacio={
      ocupado: false,
      nombre: null,
      ci: null,
      matricula: null,
      detalle: null,
      ingreso: null,
    }
    estacionamiento[i]=lugarVacio;
  }
}
  function buscarLugar(){
    var lugar=null;
    estacionamiento.forEach(
      function(item,index) {
        if (lugar==null && item.ocupado==false) {
          lugar=index;
        }
      }
      );
    return lugar;
  }
  function ocuparLugar(nroLugar,cliente){
    var lugar={
      ocupado: true,
      nombre: cliente.nombre,
      ci: cliente.ci,
      matricula: cliente.matricula,
      detalle: cliente.detalle,
      ingreso: Date.now(),
    }
    estacionamiento[nroLugar]=lugar;

  }
  function liberarLugar(nroLugar){
    var lugarVacio={
      ocupado: false,
      nombre: null,
      ci: null,
      matricula: null,
      detalle: null,
      ingreso: null,
    }
    estacionamiento[nroLugar]=lugarVacio;
  }

var lectorqr = new Instascan.Scanner({ video: document.getElementById('monitor') });
lectorqr.addListener('scan', function (contenido) {
  var smartCard = JSON.parse(contenido)

  swal(
    'Exito!',
    'Se detecto el vehiculo ' +smartCard.d+", matricula: "+smartCard.m,
    'success'
    );

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
