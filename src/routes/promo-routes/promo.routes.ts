import { Router } from 'express';
import {getAllPromos, getPromoById, createPromo, updatePromo, deletePromo} from '../../controllers/promo-controllers/promo.controller.js'

const router = Router();
router.get('/promos', getAllPromos);
router.get('/promos/:id', getPromoById);
router.post('/promos', createPromo);
router.put('/promos/:id', updatePromo);
router.delete('/promos/:id', deletePromo);

export default router;