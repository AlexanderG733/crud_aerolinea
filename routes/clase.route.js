import { Router } from "express";
import { ClasController } from "../controllers/clase.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";


const router = Router();

 router.post('/register', ClasController.registerClase);

// Ruta para mostrar las clases
router.get('/list', ClasController.listClase);

// Ruta para buscar las clases
router.get('/search', ClasController.searchClase);

// Ruta para eliminar una clase
router.delete('/:id', verifyToken, verifyAdmin, ClasController.deleteClase);

router.put('/:id', verifyToken, verifyAdmin, ClasController.updateClase);
router.patch('/:id', verifyToken, verifyAdmin, ClasController.updateClase)

export default router;