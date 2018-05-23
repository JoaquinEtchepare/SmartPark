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

  function crearQr(cliente, idDelDiv){
    var qrcode = new QRCode(idDelDiv, {
    text: JSON.stringify(cliente),
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
});
  }

  function ingresarEstadia(){

  }
  function crearCliente()
  {

    swal.mixin({
  input: 'text',
  confirmButtonText: 'siguiente &rarr;',
  showCancelButton: true,
  progressSteps: ['1', '2', '3', "4"]
}).queue([
  {
    title: 'Nombre',
    text: 'Juan Perez'
  },
  {
    title: 'C.I',
    text: 'Sin puntos ni guiones'
  },
  {
    title: 'Matricula',
    text: 'IAA1234'
  },
  {
    title: 'Detalle',
    text: 'Honda rojo'
  }
]).then((result) => {
  if (result.value) {
    var smartCard={
      n: result.value[0],
      c: result.value[1],
      m: result.value[2],
      d: result.value[3]};

    swal({
      title: 'SmartCard Creada!',
      html:
        '<div id="qrcode" style="text-align: center;"></div>'
        ,
      confirmButtonText: 'Imprimir',
      onOpen: function(){
        crearQr(smartCard,"qrcode");
      }
    }).then(function(){
      crearQr(smartCard,"impresionQR");
      window.print();
    })
  }
})
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
