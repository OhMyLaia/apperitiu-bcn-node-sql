// routes/auth-routes/auth.routes.ts
import { Router } from 'express';
import { loginUser } from '../../controllers/auth-controller/auth.controller.js';

const router = Router();

// Ruta para login
router.post('/auth/login', loginUser);

export default router;
