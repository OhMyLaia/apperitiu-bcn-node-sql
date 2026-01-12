import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../../controllers/favorite-controller/favorite.controller.js';

const router = Router();

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/', removeFavorite);

export default router;
