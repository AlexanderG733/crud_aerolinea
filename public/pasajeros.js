
document.addEventListener('DOMContentLoaded', () => {
    loadPasajeros(); 
    loadTickets()

    const resgisterPasajero = document.querySelector('#formPasajero')

    resgisterPasajero.addEventListener('submit', async e => {
        e.preventDefault();

        const id = e.target.id.value;
        const nombre1 = e.target.nombre1.value;
        const nombre2 = e.target.nombre2.value;
        const apellido1 = e.target.apellido1.value;
        const apellido2 = e.target.apellido2.value;
        const telefono = e.target.telefono.value;
        const pasaporte = e.target.pasaporte.value;
        const id_ticket = e.target.selectTickets.value;
    
        try {//api/v1/tripulante/register
            const { data } = await axios.post('/api/v1/pasajero/register', {
                id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket
            });
         resgisterPasajero.reset();
        Swal.fire({
            icon: 'success',
            title: 'pasajero registrado',
            text: 'El pasajero ha sido registrado exitosamente'
        });
        loadPasajeros();
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

    async function updatePasajero(id) {  
        const token = localStorage.getItem('token');
    
        const updateFields = {
            id: prompt('Nuevo id :'),
            nombre1: prompt('Nuevo nombre 1:'),
            nombre2: prompt('Nuevo nombre 2:'),
            apellido1: prompt('Nuevo Apellido 1:'),
            apellido2: prompt('Nuevo Apellido 2:'),
            telefono: prompt('Nuevo teléfono:'),
            id_ticket: prompt('Nuevo id ticket:')
        };
    
        try {
            const { data } = await axios.patch(`/api/v1/pasajero/${id}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('pasajero actualizado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'pasajero actualizado',
                text: 'El pasajero ha sido actualizado exitosamente'
            });
            loadPasajeros(); // Recargar la lista de pasajeros después de actualizar
        } catch (error) {
            console.error('Error al actualizar el pasajero:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el pasajero'
            });
        }
    }


    async function loadPasajeros() {
        try {
            const response = await axios.get('/api/v1/pasajero/list');
            const pasajeros = response.data;
            const tableBody = document.getElementById('pasajerosTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
    
            pasajeros.forEach(pasajero => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pasajero.id}</td>
                    <td>${pasajero.nombre1}</td>
                    <td>${pasajero.nombre2}</td>
                    <td>${pasajero.apellido1}</td>
                    <td>${pasajero.apellido2}</td>
                    <td>${pasajero.telefono}</td>
                    <td>${pasajero.pasaporte}</td>
                    <td>${pasajero.id_ticket}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updatePasajero('${pasajero.id}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePasajero('${pasajero.id}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los pasajaeros:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los pasajaeros'
            });
        }
    }


    async function loadTickets() {
        try {
            //obtener los aviones desde la API
            const response = await axios.get('/api/v1/ticket/list');
            const tickets = response.data;
        
            const selectElement = document.getElementById('selectTickets');
            selectElement.innerHTML = '<option selected>Seleccionar...</option>'; // Limpiar el select antes de llenarlo
    
            // Recorrer los aviones y agregar cada uno como una opción
            tickets.forEach(ticket => {
                const option = document.createElement('option');
                option.value = ticket.id;
                option.textContent = `id: ${ticket.id} - ${ticket.destino}`;
                selectElement.appendChild(option);
            });
    
        } catch (error) {
            console.error('Error al cargar los tickets:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se logro cargar los tickets'
            });
        }
    }
    async function deletePasajero(id) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/pasajero/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('pasajero eliminado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'pasajero eliminado',
                text:  'El pasajero ha sido eliminado exitosamente'
            });
            loadPasajeros(); // Recargar la lista
        } catch (error) {
            console.error('Error al eliminar el pasajero:', error);
            alert('Error al eliminar el pasajero');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar el pasajero'
            });
        }
    }
    
    async function searchPasajero() {
        const searchInput = document.getElementById('searchInput').value;
    
        try {
            // Realizar la solicitud a la API
            const response = await axios.get(`/api/v1/pasajero/search?query=${searchInput}`);
            
            // Verifica y muestra la respuesta para depuración
            console.log("Respuesta de la API:", response.data);
    
            // Asumimos que la respuesta es un solo objeto
            const pasajero = response.data;
    
            // Limpiar el contenido de la tabla antes de agregar nuevos resultados
            const tableBody = document.getElementById('pasajerosTbBd');
            tableBody.innerHTML = '';  // Limpiar tabla
    
            // Agregar el avión a la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pasajero.id}</td>
                <td>${pasajero.nombre1}</td>
                <td>${pasajero.nombre2}</td>
                <td>${pasajero.apellido1}</td>
                <td>${pasajero.apellido2}</td>
                <td>${pasajero.telefono}</td>
                <td>${pasajero.pasaporte}</td>
                <td>${pasajero.id_ticket}</td>
                
                <td>
                  <button class="btn btn-warning btn-sm" onclick="updatePasajero('${pasajero.id}')">Actualizar</button>
                  <button class="btn btn-danger btn-sm" onclick="deletePasajero('${pasajero.id}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
    
        } catch (error) {
            console.error('Error al buscar el pasajero:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el pasajero. Verifique los detalles en la consola.'
            });
        }
    }

    window.deletePasajero = deletePasajero;
    window.loadPasajeros = loadPasajeros;
    window.updatePasajero = updatePasajero;
    window.searchPasajero = searchPasajero;
        
});