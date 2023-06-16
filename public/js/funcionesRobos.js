const url = "http://localhost:8080/api/robo";

const validateForm = (direccion, latitud, longitud, descripcion) => {

  const validateDireccion = () => {
    let texto;
    if (direccion === null || direccion === '' || direccion.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese la dirección</span>';
      document.getElementById('texto1').innerHTML = texto;
      return false;
    } else if (direccion.length < 4) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Tiene que ser mayor o igual a 4 caracteres</span>';
      document.getElementById('texto1').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto1').innerHTML = '';
      return true;
    }
  };

  const validateLatitud = () => {
    let texto;
    if (latitud === null || latitud === '' || latitud.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese la latitud</span>';
      document.getElementById('texto2').innerHTML = texto;
      return false;
    } else if (latitud < 6.13 || latitud > 6.217) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">La latitud debe estar entre 6.13 y 6.217</span>';
      document.getElementById('texto2').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto2').innerHTML = '';
      return true;
    }
  };

  const validateLongitud = () => {
    let texto;
    if (longitud === null || longitud === '' || longitud.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese la longitud</span>';
      document.getElementById('texto3').innerHTML = texto;
      return false;
    } else if (longitud < -75.567 || longitud > -75.34) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">La longitud debe estar entre -75.567 y -75.34</span>';
      document.getElementById('texto3').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto3').innerHTML = '';
      return true;
    }
  };

  const validateDescripcion = () => {
    let texto;
    if (descripcion === null || descripcion === '' || descripcion.length === 0) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Ingrese una descripción</span>';
      document.getElementById('texto4').innerHTML = texto;
      return false;
    } else if (descripcion.length < 10) {
      texto = '<span style="color: #fff; background-color: #e6213f; padding: 3px;border-radius: 3px;">Tiene que ser mayor o igual a 10 caracteres</span>';
      document.getElementById('texto4').innerHTML = texto;
      return false;
    } else {
      document.getElementById('texto4').innerHTML = '';
      return true;
    }
  };

  validateDireccion()
  validateLongitud()
  validateLatitud()
  validateDescripcion()

  return (
    validateDireccion() &&
    validateLongitud() &&
    validateLatitud() &&
    validateDescripcion()
  );
}

const registrarRobo = async () => {
  // Obtener los datos
  const direccion = document.getElementById('direccion').value;
  const latitud = document.getElementById('latitud').value;
  const longitud = document.getElementById('longitud').value;
  const descripcion = document.getElementById('descripcion').value;

  // Realizar las validaciones
  if (validateForm(direccion, latitud, longitud, descripcion)){
    // Realizar la inserción de los datos
    let robo = {
      direccion: direccion,
      latitud: latitud,
      longitud: longitud,
      descripcion: descripcion
    };
    console.log(robo);
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(robo),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Robo agregado exitosamente',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            //listarDatos();
            window.location.href = '/robos';
          }
        });
      } else {
        console.error('Error al crear Robo', response.status);
        Swal.fire({
          title: 'Error',
          text: 'Error al crear el Robo',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al realizar la solicitud',
        icon: 'error',
      });
    }
  } 
};

const editarRobo = async (_id) => {
  // Obtener los datos
  const direccion = document.getElementById('direccion').value;
  const latitud = document.getElementById('latitud').value;
  const longitud = document.getElementById('longitud').value;
  const descripcion = document.getElementById('descripcion').value;

  // Realizar las validaciones
  validateForm(direccion, latitud, longitud, descripcion);

  // Realizar la inserción de los datos
  let robo = {
    direccion: direccion,
    latitud: latitud,
    longitud: longitud,
    descripcion: descripcion
  };

  Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de que desea editar el Robo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url + `/${_id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(robo),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Error en la solicitud de actualización');
          }
          return resp.json();
        })
        .then(json => {
          Swal.fire({
            title: 'Actualizado',
            text: json.msg,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              // Realizar alguna acción después de la confirmación
              window.location.href = "/robos";
            }
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Error al editar el Robo',
            icon: 'error'
          });
          console.error('Error al editar el Robo', error);
        });
    }
  });
};


const eliminarRobo = async (_id) => {
  Swal.fire({
    title: '¿Está seguro?',
    text: '¿Está seguro de que desea eliminar el Robo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      let robo = {
        _id: _id
      };
      fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(robo),
      })
        .then((resp) => resp.json())
        .then(json => {
          Swal.fire({
            title: 'Eliminado',
            text: json.msg,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            };
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Error al eliminar Robo',
            icon: 'error'
          });
          console.error('Error al eliminar Robo', error);
        });
    };
  });
};

module.exports = {
  registrarRobo,
  eliminarRobo,
  editarRobo
};