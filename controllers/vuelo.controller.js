import nodemailer from 'nodemailer';

const sendEmail = async (req, res) => {
  const { origen, destino, ida, vuelta, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miless2gf@gmail.com',
      pass: 'hhye thdn wxue eddq'      
    }
  });

  
  const mailOptions = {
    from: 'miless2gf@gmail.com',
    to: email,       
    subject: 'Detalles de agendamiento de vuelo',
    text: `
      DETALLES DEL VUELO
      Correo: ${email}
      Origen: ${origen}
      Destino: ${destino}
      Fecha de ida: ${ida}
      Fecha de vuelta: ${vuelta}
    `
  };

  try {
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo enviado exitosamente' });

    console.log('Correo enviado con éxito');
  } catch (error) {
    res.json({ message: 'error al enviar el correo' });
    console.log('Hubo un error al enviar el correo');
  }
};

export const flightController = {
    sendEmail
}