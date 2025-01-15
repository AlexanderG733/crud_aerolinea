
document.addEventListener('DOMContentLoaded', () => {
    loadServicios()

    const resgisterServi = document.querySelector('#formServicio')

    resgisterServi.addEventListener('submit', async e => {
        e.preventDefault();
        const id = e.target.id.value;
        const tipo_servicio = e.target.tipo_servicio.value;
    
        try {//api/v1/servicio/register
            const { data } = await axios.post('/api/v1/servicio/register', {
                id, tipo_servicio
            });
            resgisterServi.reset();
        Swal.fire({
            icon: 'success',
            title: 'Servicio registrado',
            text: 'El servicio ha sido registrado exitosamente'
        });
        loadServicios();
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
    
async function loadServicios() {
    try {
        const response = await axios.get('/api/v1/servicio/list');
        const servicios = response.data;
        const tableBody = document.getElementById('serviciosTbBd');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        servicios.forEach(servicio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicio.id}</td>
                <td>${servicio.tipo_servicio}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateServicio('${servicio.id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteServicio('${servicio.id}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los servicios:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los servicios'
        });
    }
}

async function deleteServicio(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/api/v1/servicio/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('servicio eliminado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'servicio eliminado',
            text:  'El servicio ha sido eliminado exitosamente'
        });
        loadServicios(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        alert('Error al eliminar el servicio');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al eliminar el servicio'
        });
    }
}

async function updateServicio(id) {  
    const token = localStorage.getItem('token');

    const updateFields = {
        id: prompt('Nuevo id:'),
        tipo_servicio: prompt('Nuevo tipo servicio:')
    };

    try {
        const { data } = await axios.patch(`/api/v1/servicio/${id}`, updateFields, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
            }
        });
        console.log('servicio actualizado con éxito');
        Swal.fire({
            icon: 'success',
            title: 'servicio actualizado',
            text: 'El servicio ha sido actualizado exitosamente'
        });
        loadServicios(); // Recargar la lista de tripulantes después de actualizar
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error al actualizar el servicio'
        });
    }
}

async function searchServicio() {
    const searchInput = document.getElementById('searchInput').value;

    try {
        // Realizar la solicitud a la API
        const response = await axios.get(`/api/v1/servicio/search?query=${searchInput}`);
        
        // Verifica y muestra la respuesta para depuración
        console.log("Respuesta de la API:", response.data);

        // Asumimos que la respuesta es un solo objeto
        const servicio = response.data;

        // Limpiar el contenido de la tabla antes de agregar nuevos resultados
        const tableBody = document.getElementById('serviciosTbBd');
        tableBody.innerHTML = '';  // Limpiar tabla

        // Agregar el avión a la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${servicio.id}</td>
            <td>${servicio.tipo_servicio}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="updateServicio('${servicio.id}')">Actualizar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteServicio('${servicio.id}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);

    } catch (error) {
        console.error('Error al buscar el servicio:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar el servicio. Verifique los detalles en la consola.'
        });
    }
}

    window.searchServicio = searchServicio;
    window.updateServicio = updateServicio;
    window.deleteServicio = deleteServicio;
    window.loadServicios = loadServicios;
});