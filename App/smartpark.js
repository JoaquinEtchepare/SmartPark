
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