import { Router } from "express"; "../controllers/avion.controller.js";
import { PasajeroController } from "../controllers/pasajero.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

router.post('/register', PasajeroController.registerPasajero);

// Ruta para eliminar los pasajeros
router.delete('/:id', verifyToken, verifyAdmin, PasajeroController.deletePasajero);

router.get('/search', PasajeroController.searchPasajero);

// Ruta para mostrar los pasajeros
router.get('/list', PasajeroController.listPasajero);

// Ruta para actualizar un pasajero (PUT y PATCH)
router.put('/:id', verifyToken, verifyAdmin, PasajeroController.updatePasajero);
router.patch('/:id', verifyToken, verifyAdmin, PasajeroController.updatePasajero);

export default router;