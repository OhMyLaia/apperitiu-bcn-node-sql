import { Router } from "express";
import { createSession } from "../../services/payment-service/payment.service.js";

const router= Router()

router.post("/create-checkout-session", createSession)
console.log("✅ Payment route file loaded!");
export default router