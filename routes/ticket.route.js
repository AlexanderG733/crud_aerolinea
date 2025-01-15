import { Router } from "express"; "../controllers/avion.controller.js";
import { TicketController } from "../controllers/ticket.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";


const router = Router();

// Ruta para eliminar los tripulantes
router.delete('/:id', verifyToken, verifyAdmin, TicketController.deleteTicket);

router.post('/register', TicketController.registerTicket);

router.get('/search', TicketController.searchTicket);

// Ruta para actualizar un ticket (PUT y PATCH)
router.put('/:id', verifyToken, verifyAdmin, TicketController.updateTicket);
router.patch('/:id', verifyToken, verifyAdmin, TicketController.updateTicket);

// Ruta para mostrar los tickets
router.get('/list', TicketController.listTicket)

export default router;