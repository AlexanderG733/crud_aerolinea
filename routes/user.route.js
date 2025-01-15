import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";


const router = Router();

router.post('/regUser', UserController.regUser);
router.post('/logUser', UserController.logUser);
router.get('/home', verifyToken, UserController.profile);


router.get('/', verifyAdmin, verifyToken, UserController.findeAll)


export default router;