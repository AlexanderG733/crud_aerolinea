
document.addEventListener('DOMContentLoaded', () => {
    loadTripulantes(); 
    loadAviones();  // Llamamos a la función para cargar los aviones
     

    const resgisterTripulant = document.querySelector('#formTripulante')

    resgisterTripulant.addEventListener('submit', async e => {
        e.preventDefault();
        const nombre1 = e.target.nombre1.value;
        const nombre2 = e.target.nombre2.value;
        const apellido1 = e.target.apellido1.value;
        const apellido2 = e.target.apellido2.value;
        const telefono = e.target.telefono.value;
        const rango = e.target.rango.value;
        const id_avion = e.target.selectAviones.value;
        const id = e.target.id_tripulante.value;
    
        try {//api/v1/tripulante/register
            const { data } = await axios.post('/api/v1/tripulante/register', {
                nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion,id
            });
        resgisterTripulant.reset();
        Swal.fire({
            icon: 'success',
            title: 'tripulante registrado',
            text: 'El tripulante ha sido registrado exitosamente'
        });
        loadTripulantes();
        } catch (error) {
            if (error.response) {
                console.error('Error de respuesta del servidor:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message || 'Error de respuesta del servidor'
                });
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor:', error.request);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se recibió respuesta del servidor'
                });
            } else {
                console.error('Error al configurar la solicitud:', error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al configurar la solicitud'
                });
            }
        }
    });

async function deleteTripulante(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/api/v1/tripulante/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('tripulante eliminado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'tripulante eliminado',
            text:  'El tripulante ha sido eliminado exitosamente'
        });
        loadTripulantes(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar el tripulante:', error);
        alert('Error al eliminar el tripulante');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar el tripulante'
        });
    }
}

async function updateTripulante(id) {  
    const token = localStorage.getItem('token');

    const updateFields = {
        nombre1: prompt('Nuevo nombre 1:'),
        nombre2: prompt('Nuevo nombre 2:'),
        apellido1: prompt('Nuevo Apellido 1:'),
        apellido2: prompt('Nuevo Apellido 2:'),
        telefono: prompt('Nuevo teléfono:'),
        rango: prompt('Nuevo rango:'),
        id_avion: prompt('Nuevo id avion:')
    };

    try {
        const { data } = await axios.patch(`/api/v1/tripulante/${id}`, updateFields, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('Tripulante actualizado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'Tripulante actualizado',
            text: 'El Tripulante ha sido actualizado exitosamente'
        });
        loadTripulantes(); // Recargar la lista de tripulantes después de actualizar
    } catch (error) {
        console.error('Error al actualizar el Tripulante:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al actualizar el Tripulante'
        });
    }
}


async function loadTripulantes() {
    try {
        const response = await axios.get('/api/v1/tripulante/list');
        const tripulantes = response.data;
        const tableBody = document.getElementById('tripulantesTbBd');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        tripulantes.forEach(tripulante => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tripulante.id}</td>
                <td>${tripulante.nombre1}</td>
                <td>${tripulante.nombre2}</td>
                <td>${tripulante.apellido1}</td>
                <td>${tripulante.apellido2}</td>
                <td>${tripulante.telefono}</td>
                <td>${tripulante.rango}</td>
                <td>${tripulante.id_avion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateTripulante('${tripulante.id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTripulante('${tripulante.id}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los tripulantes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los tripulantes'
        });
    }
}

    async function loadAviones() {
        try {
            //obtener los aviones desde la API
            const response = await axios.get('/api/v1/avion/list');
            const aviones = response.data;

            const selectElement = document.getElementById('selectAviones');
            selectElement.innerHTML = '<option selected>Seleccionar...</option>'; // Limpiar el select antes de llenarlo

            // Recorrer los aviones y agregar cada uno como una opción
            aviones.forEach(avion => {
                const option = document.createElement('option');
                option.value = avion.id;
                option.textContent = `${avion.id} - ${avion.nombre}`;
                selectElement.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar los aviones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se logro cargar los aviones'
            });
        }
    }


    async function searchTripulante() {
        const searchInput = document.getElementById('searchInput').value;
    
        try {
            // Realizar la solicitud a la API
            const response = await axios.get(`/api/v1/tripulante/search?query=${searchInput}`);
            
            // Verifica y muestra la respuesta para depuración
            console.log("Respuesta de la API:", response.data);
    
            // Asumimos que la respuesta es un solo objeto
            const tripulante = response.data;
    
            // Limpiar el contenido de la tabla antes de agregar nuevos resultados
            const tableBody = document.getElementById('tripulantesTbBd');
            tableBody.innerHTML = '';  // Limpiar tabla
    
            // Agregar el avión a la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tripulante.id}</td>
                <td>${tripulante.nombre1}</td>
                <td>${tripulante.nombre2}</td>
                <td>${tripulante.apellido1}</td>
                <td>${tripulante.apellido2}</td>
                <td>${tripulante.telefono}</td>
                <td>${tripulante.rango}</td>
                <td>${tripulante.id_avion}</td>
                


                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateTripulante('${tripulante.id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTripulante('${tripulante.id}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
    
        } catch (error) {
            console.error('Error al buscar el tripulante:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el tripulante. Verifique los detalles en la consola.'
            });
        }
    }

    window.updateTripulante = updateTripulante;
    window.deleteTripulante = deleteTripulante;
    window.loadTripulantes = loadTripulantes;
    window.searchTripulante = searchTripulante;
});