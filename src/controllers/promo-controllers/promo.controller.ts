import { Request, Response } from 'express';
import Promo from '../../models/promo-model/promo.model.js';
import { promoSchema } from '../../models/promo-model/zod/promo.schema.js'

export const getAllPromos = async (req: Request, res: Response) => {
    try {
        const promos = await Promo.findAll();
        res.json(promos);
        res.status(200);

    } catch (error: any) {
        console.log(`Error fetching promotions: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching promotion", details: error.errors })
        }

        console.error(`❌ Error fetching promos:`, error);
        return res.status(500).json({ error: "Error fetching promos" });
    }
};

export const getPromoById = async (req: Request, res: Response) => {
    const promoID = req.params.id;
    

    if (!promoID) {
        return res.status(400).json({ error: "Invalid or nonexistent promotion ID" });
    }

    try {
        const promo = await Promo.findByPk(promoID);
        

        if (!promo) {
            return res.status(404).json({ error: "promotion ID not found" });
        }
        res.status(200).json(promo);

    } catch (error: any) {
        console.log(`Error fetching promotion ID ${promoID}: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching promotion", details: error.errors })
        }

        console.error(`❌ Error fetching promotion:`, error);
        return res.status(500).json({ error: "Error fetching promotion" });
    }
};

export const createPromo = async (req: Request, res: Response) => {

    try {
        const promoData = promoSchema.parse(req.body);

        if (!promoData) {
            return res.status(204).json({ error: "Invalid or nonexistent promotion" });
        }
        console.log("💡 Promotion data validated:", promoData);

        const createdPromo = await Promo.create(promoData);
        return res.status(201).json(createdPromo);

    } catch (error: any) {
        if (error.name === "ZodError") {
            console.error("🔥 FULL ERROR:", error);
            return res.status(400).json({ error: "❌ Validation failed", details: error.errors });
        }

        console.error(`❌ Error adding promotion:`, error);
        return res.status(500).json({ error: "Error adding promotion" });
    }
};

export const updatePromo = async (req: Request, res: Response) => {
    const promoID = req.params.id;
    const updateData = req.body; // Assuming the update data is sent in the request body

    if (!promoID) {
        return res.status(400).json({ error: "Invalid or nonexistent promotion ID" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No updated data provided" });
    }

    try {
        const [updatedRows] = await Promo.update(updateData, { 
            where: { id: promoID } 
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Promo not found or no changes were made" });
        }

        res.status(200).json({ 
            message: "Promo updated successfully",
            promoID,
            updatedFields: updateData
        });

    } catch (error: any) {
        console.error(`Error updating promotion ID ${promoID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ 
                error: "❌ Error updating promotion", 
                promoID, 
                details: error.errors
            });
        }
        
        console.error(`❌ Error updating promotion:`, error);
        return res.status(500).json({ 
            error: "Error updating promotion",
            message: error.message 
        });
    }
};

export const deletePromo = async (req: Request, res: Response) => {
    const promoID = req.params.id;

    if (!promoID) {
        return res.status(400).json({ error: "Invalid or nonexistent promotion ID" })
    }

    try {
        await Promo.destroy({ where: { id: promoID } });
        res.sendStatus(200);

    } catch (error: any) {
        console.error(`Error deleting promotion ID ${promoID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error deleting promotion", promoID, details: error.errors});
        }
        console.error(`❌ Error adding promotion:`, error);
        return res.status(500).json({ error: "Error deleting promotion" });
    }
};
