import { Request, Response } from "express";
import Review from "../../models/review-model/review.model.js";
import User from "../../models/user-model/user.model.js";
import Terrace from "../../models/terrace-model/db/terrace-model-sequelize.js";
import "../../models/associations/associations.js";
//import supabaseAdmin from '../config/supabase-admin.js';

import { reviewSchema } from "../../models/review-model/zod/review-schema.js";

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll(/* {
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name'], // como la relacion esta hecha puedo obtener info del usuario aunque no este creado en mi model
        },
        {
          model: Terrace,
          attributes: ['id', 'business_name'], //mismo caso que el anterior, puedo obtener info de la terraza aunque no este creada en mi model
        },
      ],
    } */);

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReviewsFromUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const whereClause = userId ? { where: { userId: String(userId) } } : {};

    const reviews = await Review.findAll({
      ...whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "email", "name"],
        },
        {
          model: Terrace,
          attributes: ["id", "business_name"],
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postReview = async (req: Request, res: Response) => {
  try {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { rating, comment, userId, terraceId } = parsed.data;

    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name"],
    });
    const terrace = await Terrace.findByPk(terraceId, {
      attributes: ["id", "business_name", "cadastro_ref"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!terrace) {
      return res.status(404).json({ error: "Terrace not found" });
    }

    const review = await Review.create({
      rating,
      comment,
      userId,
      userName: user.name,
      terraceId,
    });

    const reviews = await Review.findAll({
      where: { terraceId },
    });

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    await Terrace.update(
      { average_rating: average },
      { where: { id: terraceId } }
    );
    console.log(`🎯 Updated terrace ${terraceId} with average:`, average);

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
