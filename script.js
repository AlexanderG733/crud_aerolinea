const resgisterAvion = document.querySelector('#formAvion')

resgisterAvion.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = e.target.nombre.value;

    try {
        const {data} = await axios.post('/api/v1/avion/register', {
           nombre
        })
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de respuesta del servidor:', error.response.data);
            //console.error('Código de estado:', error.response.status);
            //console.error('Encabezados:', error.response.headers);
            
            // Personaliza un mensaje para el usuario
            alert(`Error al crear el avion: ${error.response.data.message || 'Error desconocido del servidor'}`);
        } else if (error.request) {
            // La solicitud fue realizada pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor:', error.request);
            //alert('Error al conectar con el servidor, por favor intente más tarde.');
        } else {
            // Algo ocurrió al configurar la solicitud
            console.error('Error al configurar la solicitud:', error.message);
            //alert('Hubo un problema al procesar la solicitud, por favor intente de nuevo.');
        }
    }

})