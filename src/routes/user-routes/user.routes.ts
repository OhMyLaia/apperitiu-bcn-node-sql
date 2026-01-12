import { Router } from 'express';
import { createUser, getAllUsers, getUserByEmailOrId, updateUser, deleteUser , getLoggedInUserProfile, claimTerraceOwnership, unclaimTerraceOwnership} from '../../controllers/user-controllers/user.controller.js';
// ✅ CORRECCIÓN: Quitado .js de la ruta de importación para que TypeScript encuentre la interfaz correctamente
import { isTokenValid } from '../../middleware/auth.middleware.js'; 
import { loginUser } from '../../controllers/auth-controller/auth.controller.js';


const router = Router();
router.post('/login', loginUser);

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', isTokenValid, getUserByEmailOrId);
router.get('/perfil', isTokenValid, getLoggedInUserProfile);

router.put('/users/:id', isTokenValid, updateUser);


router.delete('/users/:id', isTokenValid, deleteUser);

router.put("/users/:userId/claim-terrace",isTokenValid, claimTerraceOwnership);
router.put("/users/:userId/unclaim-terrace", isTokenValid, unclaimTerraceOwnership);



export default router;
