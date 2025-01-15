document.addEventListener('DOMContentLoaded', () => {
    const resgisterClient = document.querySelector('#formAvion')
    loadAviones()

    resgisterClient.addEventListener('submit', async e => {
        e.preventDefault();
        const nombre = e.target.nombre.value;
    
        try {//api/v1/clientes/register
            const { data } = await axios.post('/api/v1/avion/register', {
                id, nombre
            });
        resgisterClient.reset();
        Swal.fire({
            icon: 'success',
            title: 'Avion registrado',
            text: 'El avion ha sido registrado exitosamente'
        });
        loadAviones()
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
    async function loadAviones() {
        try {
            const response = await axios.get('/api/v1/avion/list');
            const aviones = response.data;
            const tableBody = document.getElementById('avionesTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
    
            aviones.forEach(avion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${avion.id}</td>
                    <td>${avion.nombre}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateAvion('${avion.id}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAvion('${avion.id}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los aviones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los aviones'
            });
        }
    }
    async function deleteAvion(id) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/avion/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('Avion eliminado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Avion eliminado',
                text:  'El Avion ha sido eliminado exitosamente'
            });
            loadAviones(); // Recargar la lista
        } catch (error) {
            console.error('Error al eliminar el avion:', error);
            alert('Error al eliminar el avion');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar el avion'
            });
        }
    }
    
    // Función para mostrar el formulario con los datos del cliente a actualizar
    async function updateAvion(id) {
        const token = localStorage.getItem('token');

        const updateFields = {
            nombre: prompt('Nuevo nombre:')
        };
    
        try {
            const { data } = await axios.patch(`/api/v1/avion/${id}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('Avion actualizado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'Avion actualizado',
                text: 'El Avion ha sido actualizado exitosamente'
            });
            loadAviones(); // Recargar la lista de clientes después de actualizar
        } catch (error) {
            console.error('Error al actualizar el avion:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el avion'
            });
        }
    }
    
    async function searchAvion() {
        const searchInput = document.getElementById('searchInput').value;
    
        try {
            // Realizar la solicitud a la API
            const response = await axios.get(`/api/v1/avion/search?query=${searchInput}`);
            
            // Verifica y muestra la respuesta para depuración
            console.log("Respuesta de la API:", response.data);
    
            // Asumimos que la respuesta es un solo objeto
            const avion = response.data;
    
            // Limpiar el contenido de la tabla antes de agregar nuevos resultados
            const tableBody = document.getElementById('avionesTbBd');
            tableBody.innerHTML = '';  // Limpiar tabla
    
            // Agregar el avión a la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${avion.id}</td>
                <td>${avion.nombre}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="updateAvion('${avion.id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAvion('${avion.nombre}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
    
        } catch (error) {
            console.error('Error al buscar el avion:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el avión. Verifique los detalles en la consola.'
            });
        }
    }
    
    // Exponer las funciones globalmente para que puedan ser llamadas desde el HTML
    window.deleteAvion = deleteAvion;
    window.updateAvion = updateAvion;
    window.loadAviones = loadAviones;
    window.searchAvion = searchAvion;
    });
    