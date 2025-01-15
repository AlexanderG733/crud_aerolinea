import { Router } from "express";
import { AviController } from "../controllers/avion.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

router.post('/register', AviController.registerAvion);

// Ruta para mostrar los aviones
router.get('/list', AviController.listAvion);

// Ruta para buscar los aviones
router.get('/search', AviController.searchAvion);

// Ruta para eliminar un avion
router.delete('/:id', verifyToken, verifyAdmin, AviController.deleteAvion);

// Ruta para actualizar un avion (PUT y PATCH)
router.put('/:id', verifyToken, verifyAdmin, AviController.updateAeronave);
router.patch('/:id', verifyToken, verifyAdmin, AviController.updateAeronave);

export default router;