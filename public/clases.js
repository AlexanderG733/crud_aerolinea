
document.addEventListener('DOMContentLoaded', () => {
    loadClases()
    loadServicios()

    const resgisterClas = document.querySelector('#formClase')

     resgisterClas.addEventListener('submit', async e => {
        e.preventDefault();
        const id = e.target.id.value;
        const tipo_clase = e.target.tipo_clase.value;
        const id_servicio = e.target.selectServicios.value;
        try {//api/v1/clase/register
            const { data } = await axios.post('/api/v1/clase/register', {
                id, tipo_clase, id_servicio
            });
        resgisterClas.reset();
        Swal.fire({
            icon: 'success',
            title: 'Clase registrada',
            text: 'La clase ha sido registrado exitosamente'
        });
        loadClases()
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
    
    //Obtener los datos de la DB 
    async function loadClases() {
        try {
            const response = await axios.get('/api/v1/clase/list');
            const clases = response.data;
            const tableBody = document.getElementById('clasesTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
    
            clases.forEach(clase => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${clase.id}</td>
                    <td>${clase.tipo_clase}</td>
                    <td>${clase.id_servicio}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateClase('${clase.id}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteClase('${clase.id}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar las clases:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las clases'
            });
        }
    }
    

    async function loadServicios() {
        try {
            //obtener los aviones desde la API
            const response = await axios.get('/api/v1/servicio/list');
            const servicios = response.data;
    
            const selectElement = document.getElementById('selectServicios');
            selectElement.innerHTML = '<option selected>Seleccionar...</option>'; // Limpiar el select antes de llenarlo
    
            // Recorrer los aviones y agregar cada uno como una opción
            servicios.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio.id;
                option.textContent = `id: ${servicio.id} - ${servicio.tipo_servicio}`;
                selectElement.appendChild(option);
            });
    
        } catch (error) {
            console.error('Error al cargar los servicio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se logro cargar los servicios'
            });
        }
        }
    
        async function updateClase(id) {
    
            const token = localStorage.getItem('token');
            const updateFields = {
                id: prompt('Nuevo id :'),
                tipo_clase: prompt('Nueva tipo clase:'),
                id_servicio: prompt('Nuevo id servicio :')
            };
            try {
                const { data } = await axios.patch(`/api/v1/clase/${id}`, updateFields, {
                    headers: {
                        Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                    }
                });
                console.log('Clase actualizada con éxito');
                Swal.fire({
                    icon: 'success',
                    title: 'Clase actualizada',
                    text: 'La clase ha sido actualizada exitosamente'
                });
                loadClases(); // Recargar la lista de clases después de actualizar
            } catch (error) {
                console.error('Error al actualizar la clase:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al actualizar la clase'
                });
            }
        }


async function deleteClase(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/api/v1/clase/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('Clase eliminada con éxito');
        Swal.fire({
            icon: 'success',
            title: 'Clase eliminada',
            text:  'La clase ha sido eliminada exitosamente'
        });
        loadClases(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar La clase:', error);
        alert('Error al eliminar La clase');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar La clase'
        });
    }
}
async function searchClase() {
    const searchInput = document.getElementById('searchInput').value;

    try {
        // Realizar la solicitud a la API
        const response = await axios.get(`/api/v1/clase/search?query=${searchInput}`);
        
        // Verifica y muestra la respuesta para depuración
        console.log("Respuesta de la API:", response.data);

        // Asumimos que la respuesta es un solo objeto
        const clase = response.data;

        // Limpiar el contenido de la tabla antes de agregar nuevos resultados
        const tableBody = document.getElementById('clasesTbBd');
        tableBody.innerHTML = '';  // Limpiar tabla

        // Agregar el avión a la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${clase.id}</td>
            <td>${clase.tipo_clase}</td>
            <td>${clase.id_servicio}</td>
            
            <td>
                <button class="btn btn-warning btn-sm" onclick="updateClase('${clase.id}')">Actualizar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteClase('${clase.id}')">Eliminar</button>
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

        
    window.updateClase = updateClase;
    window.deleteClase = deleteClase;
    window.searchClase = searchClase;

});