import { Router} from "express"
import { createBooking, deleteBookingById, getBooking, getBookingById, getBookingsByTerraceId, markBookingAsShown, updateBooking, getBookingsByUserId } from "../../controllers/booking-controllers/booking.controller.js"
import { isTokenValid } from "../../middleware/auth.middleware.js"

const router=Router()

router.post("/booking",isTokenValid, createBooking)
router.patch("/booking/:id",isTokenValid, updateBooking)
router.get("/booking",isTokenValid, getBooking )
router.get("/booking/:id",isTokenValid, getBookingById )
router.delete("/booking/:id",isTokenValid, deleteBookingById )
// En router booking.routes.js o ts
router.patch("/booking/:id/mark-shown", isTokenValid, markBookingAsShown);
router.get("/booking/terrace/:terraceId", isTokenValid, getBookingsByTerraceId);
router.get("/booking/user/:userId", isTokenValid, getBookingsByUserId);

export default router