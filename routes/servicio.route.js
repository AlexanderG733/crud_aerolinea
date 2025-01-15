import { Router } from "express";
import { ServiController } from "../controllers/servicio.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();


 router.post('/register', ServiController.registerServicio);

 // Ruta para eliminar un servicio
 router.delete('/:id', verifyToken, verifyAdmin, ServiController.deleteServicio);

// Ruta para mostrar los aviones
router.get('/list', ServiController.listServicio);

router.get('/search', ServiController.searchServicio);

router.put('/:id', verifyToken, verifyAdmin, ServiController.updateServicio);
router.patch('/:id', verifyToken, verifyAdmin, ServiController.updateServicio)

export default router;