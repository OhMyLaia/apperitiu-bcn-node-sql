import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";
// import Tag from '../../models/terrace-model/db/tags-model-sequelize.js'
import { CustomTerraceSchema } from "../../models/terrace-model/zod/customTerrace-schema.js";
import { Request, Response } from "express";
import User from "../../models/user-model/user.model.js";
import bcrypt from "bcrypt";

// http://localhost:8080/terraces
// GET ALL items
export const getAllTerraces = async (req: Request, res: Response) => {
  try {
    const terraces = await Terrace.findAll();
    res.json(terraces);
    res.status(200);
  } catch (error: any) {
    console.error(`Error fetching terraces: error ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({ error: "❌ Error fetching terraces", details: error.errors });
    }

    console.error(`❌ Error fetching terraces:`, error);
    return res.status(500).json({ error: "Error fetching terraces" });
  }
};

// http://localhost:8080/terraces/id
// GET items/:id
export const getTerraceById = async (req: Request, res: Response) => {
  const terraceID = req.params.id;
  // const { terrace } = req.body;

  if (!terraceID) {
    return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
  }

  try {
    const terrace = await Terrace.findByPk(terraceID);
    // const terrace = await Terrace.findOne({ where: { id: terraceID } });
    console.log("📦 Terrace fetched:", terrace?.toJSON());

    if (!terrace) {
      return res.status(404).json({ error: "Terrace ID- not found" });
    }
    res.status(200).json(terrace);
  } catch (error: any) {
    console.error(`Error fetching terrace ID-${terraceID}: error ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({ error: "❌ Error fetching terrace", details: error.errors });
    }

    console.error(`❌ Error fetching terrace:`, error);
    return res.status(500).json({ error: "Error fetching terrace" });
  }
};

// http://localhost:8080/terraces
// POST items
export const createNewTerrace = async (req: Request, res: Response) => {
  try {
    const terraceData = CustomTerraceSchema.parse(req.body);

    if (!terraceData) {
      return res.status(204).json({ error: "Invalid or inexistent terrace" });
    }
    console.warn("💡 terraceData validated:", terraceData);

    const createdTerrace = await Terrace.create(terraceData);
    return res.status(201).json(createdTerrace);
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("🔥 FULL ERROR:", error);
      return res
        .status(400)
        .json({ error: "❌ Validation failed", details: error.errors });
    }

    console.error(`❌ Error adding terrace:`, error);
    return res.status(500).json({ error: "Error adding terrace" });
  }
};

// http://localhost:8080/terraces/id
// PUT items/:id
export const updateTerrace = async (req: Request, res: Response) => {
  const terraceID = req.params.id;
  const updateData = req.body;

  if (!terraceID) {
    return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No update data provided" });
  }

  try {
    const [updatedRows] = await Terrace.update(updateData, {
      where: { id: terraceID },
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "Terrace not found or no changes made" });
    }

    res.status(200).json({
      message: "Terrace updated successfully",
      terraceID,
      updatedFields: updateData,
    });
  } catch (error: any) {
    console.error(`Error updating terrace ID-${terraceID}: ${error}`);

    if (error.name === "ZodError") {
      return res.status(500).json({
        error: "❌ Error updating terrace",
        terraceID,
        details: error.errors,
      });
    }

    console.error(`❌ Error updating terrace:`, error);
    return res.status(500).json({
      error: "Error updating terrace",
      message: error.message,
    });
  }
};

// http://localhost:8080/terraces
// DELETE items/:id
export const deleteTerrace = async (req: Request, res: Response) => {
  const terraceID = req.params.id;

  if (!terraceID) {
    return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
  }

  try {
    await Terrace.destroy({ where: { id: terraceID } });
    res.sendStatus(200);
  } catch (error: any) {
    console.error(`Error deleting terrace ID-${terraceID}: ${error}`);

    if (error.name === "ZodError") {
      return res
        .status(500)
        .json({
          error: "❌ Error deleting terrace",
          terraceID,
          details: error.errors,
        });
    }
    console.error(`❌ Error adding terrace:`, error);
    return res.status(500).json({ error: "Error deleting terrace" });
  }
};

//-----Claim terrace------//
export const getTerraceByCatastroRef = async (req: Request, res: Response) => {
  try {
    const { catastroRef } = req.params;

    // Busca una terraza por su referencia catastral
    const terrace = await Terrace.findOne({
      where: {
        cadastro_ref: catastroRef, // Asumiendo que tu columna se llama 'cadastro_ref'
      },
    });

    if (!terrace) {
      return res
        .status(404)
        .json({
          message:
            "No s'ha trobat cap terrassa amb aquesta referència catastral.",
        });
    }

    res.status(200).json(terrace);
  } catch (error) {
    console.error("Error al buscar terrassa per referència catastral:", error);
    res
      .status(500)
      .json({ message: "Error intern del servidor al buscar la terrassa." });
  }
};

export const updateTerraceWithPassword = async (
  req: Request,
  res: Response
) => {
  const terraceID = req.params.id;
  const { password, updateData } = req.body;
  const userId = (req as any).user.id;
  if (!terraceID) {
    return res.status(400).json({ error: "Invàlid terrace ID" });
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No update data provided" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuari no trobat." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contrasenya incorrecta" });
    }

    if (user.id_terrace != terraceID) {
      return res
        .status(403)
        .json({ error: "No tens permisos per a modificar dades d'aquesta terrassa" });
    }

    const [updatedRows] = await Terrace.update(updateData, {
      where: { id: terraceID },
    });

    if (updatedRows == 0) {
      return res
        .status(404)
        .json({ error: "No s'ha fet cap canvi." });
    }

    res.status(200).json({
      message: "Terrace updated successfully",
      terraceID,
      updatedFields: updateData,
    });
  } catch (error: any) {
    console.error(`❌ Error a l'actualitzar terrassa:`, error);
    return res.status(500).json({ error: "Error intern del servidor" });
  }
};
