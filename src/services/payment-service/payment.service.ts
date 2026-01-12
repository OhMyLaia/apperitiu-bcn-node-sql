import { Request, Response } from "express"; // Importar Request y Response para tipado
import Stripe from "stripe";
import Booking from "../../models/booking-model/booking.model.js";
import dotenv from 'dotenv'

dotenv.config(); // Asegúrate de cargar las variables de entorno

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!,{
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion
})

export const createSession = async (req: Request, res: Response) => {
  try {
    // ✅ Acceder a booking_id y terrace_id desde el cuerpo de la solicitud
    const booking_id = req.body.booking_id;
    let terrace_id = req.body.terrace_id; 

    // Asegurarse de que terrace_id siempre sea una cadena, incluso si no se proporciona
    if (typeof terrace_id === 'undefined' || terrace_id === null) {
      terrace_id = ''; 
    }

    const booking = await Booking.findByPk(booking_id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const price = Number(booking.booking_price);

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid booking price" });
    }

    const unitAmount = Math.round(price * 100); 

    console.log("Creating Stripe session with:", {
      booking_id: booking.id,
      terrace_id: terrace_id, // terrace_id ahora está definido
      party_length: booking.party_length,
      price,
      unitAmount,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Terrace Booking",
              description: `Booking for ${booking.party_length} persons`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      // ✅ terrace_id se usa aquí, ahora que está definido
      success_url: `http://localhost:4200/calendar?terraceId=${terrace_id}&bookingId=${booking.id}`, 
      cancel_url: `http://localhost:4200/calendar?terraceId=${terrace_id}&status=cancelled`, // También corregido aquí
      metadata: {
        bookingId: booking.id,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
