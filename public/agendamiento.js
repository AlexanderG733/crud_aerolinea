
document.getElementById('ida').min = new Date().toISOString().split('T')[0];
document.getElementById('vuelta').min = new Date().toISOString().split('T')[0];

 document.addEventListener('DOMContentLoaded', () => {
    const resgisterAgenda = document.querySelector('#formAgendar')
    resgisterAgenda.addEventListener('submit', async e => {
        e.preventDefault();

        const email = e.target.email.value;
        const origen = e.target.origen.value;
        const destino = e.target.destino.value;
        const ida  = e.target.ida.value;
        const vuelta = e.target.vuelta.value;
    
        try {
            const { data } = await axios.post('/send-email', {
                email, origen, destino, ida, vuelta
            });
        resgisterAgenda.reset();
        Swal.fire({
        icon: 'success',
        title: ' registrado',
        text: 'El vuelo se agendo correctamente revisa tu correo'
    });
        } catch (error) {
            if (error.response) {
                console.error('Error');
                Swal.fire({
                    icon: 'Error al agendar el vuelo',
                    title: 'Error al agendar el vuelo',
                    text:  'Error al agendar el vuelo'
                });
            }
        }
    })
}); 