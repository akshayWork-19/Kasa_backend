import express from 'express';
import { checkAvailablity, createBooking, getUsersBookings } from '../controllers/bookingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', createBooking);
router.get('/my', getUsersBookings);
router.get('/check-availability', checkAvailablity);

export default router;