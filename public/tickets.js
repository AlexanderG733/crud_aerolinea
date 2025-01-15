document.addEventListener('DOMContentLoaded', () => {
    loadTickets(); 
    loadAviones();
    loadPasajeros();
    loadClases();

    const resgisterTicket = document.querySelector('#formTicket')

    resgisterTicket.addEventListener('submit', async e => {
        e.preventDefault();
        const id = e.target.id.value;
        const destino = e.target.destino.value;
        const hora_llegada = e.target.hora_llegada.value;
        const hora_embarque = e.target.hora_embarque.value;
        const fecha = e.target.fecha.value;
        const asiento = e.target.asiento.value;
        const id_pasajero = e.target.selectPasajeros.value;
        const id_avion = e.target.selectAviones.value;
        const id_clase = e.target.selectClases.value;
       

        try {//api/v1/tripulante/register
            const { data } = await axios.post('/api/v1/ticket/register', {
                id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase
            });
        resgisterTicket.reset();
        Swal.fire({
            icon: 'success',
            title: 'ticket registrado',
            text: 'El ticket ha sido registrado exitosamente'
        });
        loadTickets();
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


    async function loadTickets() {
        try {
            const response = await axios.get('/api/v1/ticket/list');
            const tickets = response.data;
            const tableBody = document.getElementById('ticketsTbBd');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
    
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.destino}</td>
                    <td>${ticket.origen}</td>
                    <td>${ticket.hora_llegada}</td>
                    <td>${ticket.hora_embarque}</td>
                    <td>${ticket.fecha}</td>
                    <td>${ticket.asiento}</td>
                    <td>${ticket.id_pasajero}</td>
                    <td>${ticket.id_avion}</td>
                    <td>${ticket.id_clase}</td>

                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateTicket('${ticket.id}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTicket('${ticket.id}')">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los tickets:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los tickets'
            });
        }
    }

    async function loadPasajeros() {
        try {
            //obtener los aviones desde la API
            const response = await axios.get('/api/v1/pasajero/list');
            const pasajeros = response.data;

            const selectElement = document.getElementById('selectPasajeros');
            selectElement.innerHTML = '<option selected>Seleccionar...</option>'; // Limpiar el select antes de llenarlo

            // Recorrer los aviones y agregar cada uno como una opción
            pasajeros.forEach(pasajero => {
                const option = document.createElement('option');
                option.value = pasajero.id;
                option.textContent = `${pasajero.id} - ${pasajero.nombre1} - ${pasajero.apellido1}`;
                selectElement.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar los pasajeros:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se logro cargar los pasajeros'
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

    async function loadClases() {
        try {
            //obtener los aviones desde la API
            const response = await axios.get('/api/v1/clase/list');
            const clases = response.data;

            const selectElement = document.getElementById('selectClases');
            selectElement.innerHTML = '<option selected>Seleccionar...</option>'; // Limpiar el select antes de llenarlo

            // Recorrer los aviones y agregar cada uno como una opción
            clases.forEach(clase => {
                const option = document.createElement('option');
                option.value = clase.id;
                option.textContent = `${clase.id} - ${clase.tipo_clase}`;
                selectElement.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar los clases:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se logro cargar los clases'
            });
        }
    }

    async function deleteTicket(id) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/v1/ticket/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('ticket eliminado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'ticket eliminado',
                text:  'El ticket ha sido eliminado exitosamente'
            });
            loadTickets(); // Recargar la lista
        } catch (error) {
            console.error('Error al eliminar el ticket:', error);
            alert('Error al eliminar el ticket');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al eliminar el ticket'
            });
        }
    }

    async function updateTicket(id) {  
        const token = localStorage.getItem('token');
    
        const updateFields = {
            id: prompt('Nuevo id:'),
            destino: prompt('Nuevo destino:'),
            origen: prompt('Nuevo origen:'),
            hora_llegada: prompt('Nueva hora llegada:'),
            hora_embarque: prompt('Nueva hora embarque:'),
            fecha: prompt('Nueva fecha:'),
            asiento: prompt('Nuevo asiento:'),
            id_pasajero: prompt('Nuevo id pasajero:'),
            id_avion: prompt('Nuevo id avion:'),
            id_clase: prompt('Nuevo id clase:'),

        };
    
        try {
            const { data } = await axios.patch(`/api/v1/ticket/${id}`, updateFields, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los encabezados de la solicitud
                }
            });
            console.log('ticket actualizado con éxito');
            Swal.fire({
                icon: 'success',
                title: 'ticket actualizado',
                text: 'El ticket ha sido actualizado exitosamente'
            });
            loadTickets(); // Recargar la lista de ticket después de actualizar
        } catch (error) {
            console.error('Error al actualizar el ticket:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el ticket'
            });
        }
    }

    async function searchTicket() {
        const searchInput = document.getElementById('searchInput').value;
    
        try {
            // Realizar la solicitud a la API
            const response = await axios.get(`/api/v1/ticket/search?query=${searchInput}`);
            
            // Verifica y muestra la respuesta para depuración
            console.log("Respuesta de la API:", response.data);
    
            // Asumimos que la respuesta es un solo objeto
            const ticket = response.data;
    
            // Limpiar el contenido de la tabla antes de agregar nuevos resultados
            const tableBody = document.getElementById('ticketsTbBd');
            tableBody.innerHTML = '';  // Limpiar tabla
    
            // Agregar el avión a la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.destino}</td>
                    <td>${ticket.origen}</td>
                    <td>${ticket.hora_llegada}</td>
                    <td>${ticket.hora_embarque}</td>
                    <td>${ticket.fecha}</td>
                    <td>${ticket.asiento}</td>
                    <td>${ticket.id_pasajero}</td>
                    <td>${ticket.id_avion}</td>
                    <td>${ticket.id_clase}</td>

                    <td>
                        <button class="btn btn-warning btn-sm" onclick="updateTicket('${ticket.id}')">Actualizar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTicket('${ticket.id}')">Eliminar</button>
            `;
            tableBody.appendChild(row);
    
        } catch (error) {
            console.error('Error al buscar el ticket:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al buscar el ticket. Verifique los detalles en la consola.'
            });
        }
    }
    
    window.searchTicket = searchTicket;
    window.updateTicket = updateTicket;
    window.deleteTicket = deleteTicket;
    window.loadTickets = loadTickets;

});