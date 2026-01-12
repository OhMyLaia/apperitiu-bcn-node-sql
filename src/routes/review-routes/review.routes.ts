import { Router } from 'express';
import { getReviews, postReview, getReviewsFromUser } from '../../controllers/review-controllers/review.controller.js';

const router = Router();

router.get('/', getReviews);
router.get('/from-user', getReviewsFromUser);
router.post('/', postReview);
console.log('Review routes initialized');

export default router;