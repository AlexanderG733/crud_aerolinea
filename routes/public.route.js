import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

import { flightController } from "../controllers/vuelo.controller.js";

const router = Router();


//ocultar la extension del archivo

const __filename = fileURLToPath(import.meta.url);//añadido
const __dirname = path.dirname(__filename);//añadido

//const publicPath = path.join(__dirname, "../public");
//ruta login

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

//ruta home
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//ruta cliente
router.get('/avion', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/avion.html'));
});

//ruta tripulante
router.get('/tripulante', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/tripulante.html'));
});

//ruta clase
router.get('/clase', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/clase.html'));
});

//ruta servicio
router.get('/servicio', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/servicio.html'));
});

//ruta pasajero
router.get('/pasajero', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pasajero.html'));
});

//ruta ticket
router.get('/ticket', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/ticket.html'));
});
router.get('/agendamiento', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/agendamiento.html'));
});

router.post('/send-email', flightController.sendEmail);


export default router;