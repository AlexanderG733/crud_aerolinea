import { Router } from "express"; "../controllers/avion.controller.js";
import { TripuController } from "../controllers/tripulante.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

router.post('/register', TripuController.registerTripulante);

// Ruta para eliminar los tripulantes
router.delete('/:id', verifyToken, verifyAdmin, TripuController.deleteTripulante);

router.get('/search', TripuController.searchTripulante);

// Ruta para mostrar los tripulantes
router.get('/list', TripuController.listTripulante);

// Ruta para actualizar un tripulante (PUT y PATCH)
router.put('/:id', verifyToken, verifyAdmin, TripuController.updateTripulacion);
router.patch('/:id', verifyToken, verifyAdmin, TripuController.updateTripulacion);

export default router;