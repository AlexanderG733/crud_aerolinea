import 'dotenv/config';
import express from 'express';
import avionRouter from './routes/avion.route.js';
import publicRouter from './routes/public.route.js';
import userRouter from './routes/user.route.js';
import tripulanteRouter from './routes/tripulante.route.js';
import claseRouter from './routes/clase.route.js';
import servicioRouter from './routes/servicio.route.js';
import pasajeroRouter from './routes/pasajero.route.js';
import ticketRouter from './routes/ticket.route.js';

import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/* app.get('/', (req, res) => {
    res.send('Hello World!');
}) */
    app.get('/', (req, res) => {
        res.redirect('/login');
    });

 app.use(express.json());//parsear el body de la petición a json
 app.use(express.urlencoded({ extended: true}));
/* app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public')); */

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRouter);
app.use('/api/v1/avion', avionRouter);// vista avion
app.use('/api/v1/tripulante', tripulanteRouter);// vista tripulante
app.use('/api/v1/clase', claseRouter);// vista clase
app.use('/api/v1/servicio', servicioRouter);// vista servico
app.use('/api/v1/pasajero', pasajeroRouter);// vista pasajero
app.use('/api/v1/ticket', ticketRouter);// vista ticket
app.use('/api/v1/user', userRouter);// vista usuario


//RUTAS
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)});