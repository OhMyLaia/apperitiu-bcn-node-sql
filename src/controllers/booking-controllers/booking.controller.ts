import { ZodError } from "zod";
import Booking from "../../models/booking-model/booking.model.js";
import { bookingSchema } from "../../models/booking-model/zod/booking.schema.js";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";



//this is a Post Route
//http://localhost:8080/booking
// export const createBooking = async (req:AuthenticatedRequest, res:Response)=>{
//      try {
//     const validateData = bookingSchema.parse(req.body)

//     const userIdFromToken = req.user?.id // 👈 este ID viene del token

//     if (!userIdFromToken) {
//       return res.status(401).json({ error: "User not authenticated" })
//     }

//     const booking_price = validateData.booking_price ?? validateData.party_length * 1

//     if (isNaN(booking_price) || booking_price <= 0) {
//       throw new Error("Booking price must be a positive number")
//     }

//     const newBooking = await Booking.create({
//       ...validateData,
//       user_id: userIdFromToken, // 👈 Asigna el user_id aquí
//       booking_price,
//       is_paid: validateData.is_paid ?? false,
//     })

//     return res.status(201).json(newBooking)
//   } catch (error: any) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ error: "Validation failed", details: error.errors })
//     }
//     console.error("Error creating booking:", error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validateData = bookingSchema.parse(req.body);

    const userIdFromToken = req.user?.id;

    if (!userIdFromToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!validateData.terrace_id) {
      return res.status(400).json({ error: "Terrace ID is required" });
    }

    const booking_price = validateData.booking_price ?? validateData.party_length * 1;

    const newBooking = await Booking.create({
      ...validateData,
      user_id: userIdFromToken, // 🔐 solo del token
      booking_price,
      is_paid: validateData.is_paid ?? false,
    });

    return res.status(201).json(newBooking);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// this is a Put Route
//http://localhost:8080/booking/{booking_id}
// En tu booking.controller.ts
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    console.log(`Actualizando reserva ID: ${bookingId}`); // Log para depuración
    
    const findBooking = await Booking.findByPk(bookingId);
    if (!findBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const validateData = bookingSchema.partial().parse(req.body);
    console.log('Datos recibidos:', validateData); // Verifica los datos recibidos

    await findBooking.update(validateData);
    
    return res.status(200).json(findBooking);
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

//this is a get route
//http://localhost:8080/booking/

export const getBooking= async(req:Request, res: Response)=>{
    try {
        const showAllBooking=await Booking.findAll()
        return res.status(200).json(showAllBooking)
    } catch (error:any) {
         if (error instanceof ZodError) {
            return res.status(500).json({ error: "Schema validation failed", details: error.errors })
        }
        console.error("error fetching booking", error);
        return res.status(500).json()
    }
}

//this is a Get{id} route
//http://localhost:8080/booking/{id}

export const getBookingById=async(req:Request, res:Response)=>{
    try {
        const {id}=bookingSchema.parse(req.params)
        const booking=await Booking.findByPk(id)
        if(!booking){
            return res.status(404).json({error:"booking doesn't exist"})
        }
        return res.status(200).json(booking)
    } catch (error:any) {
        if(error instanceof ZodError){
            return res.status(400).json({error:"invalid Id", details:error.errors})
        }
        console.error("error fetching booking", error)
        return res.status(500).json({error:"internal server error"})
    }
}

//this is a delete route
//http://localhost:8080/booking/{id}

export const deleteBookingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // No uses bookingSchema.parse aquí
        
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        await booking.destroy();
        return res.status(200).json({ message: "Booking deleted successfully" });
        
    } catch (error: any) {
        console.error("Error deleting booking:", error);
        return res.status(500).json({ 
            error: "Internal server error",
            details: error.message // Opcional: solo para desarrollo
        });
    }
}
//----
export const getBookingsByTerraceId = async (req: Request, res: Response) => {
  try {
    const terraceId = req.params.terraceId;

    if (!terraceId) {
      return res.status(400).json({ error: "Terrace ID is required" });
    }

    const bookings = await Booking.findAll({
      where: { terrace_id: terraceId }
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings by terrace:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
 
export const markBookingAsShown = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    console.log(`Marcando reserva ${bookingId} como mostrada`); // Log de depuración
    
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      console.log(`Reserva ${bookingId} no encontrada`);
      return res.status(404).json({ error: "Booking not found" });
    }

    console.log(`Estado actual de has_shown: ${booking.has_shown}`); // Log de depuración
    
    await booking.update({ has_shown: true });
    console.log(`Reserva ${bookingId} marcada como mostrada correctamente`);
    
    return res.status(200).json({ 
      message: "Booking marked as shown",
      booking 
    });
  } catch (error: any) {
    console.error("Error marking booking as shown:", error);
    return res.status(500).json({ 
      error: error.message || "Internal server error",
      stack: error.stack // Solo para desarrollo
    });
  }
}

export const getBookingsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
console.log("User ID recibido:", userId);
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Terrace,
          attributes: ["business_name", "address"],
        },
      ],
      order: [["booking_date", "DESC"]],
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings by user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
