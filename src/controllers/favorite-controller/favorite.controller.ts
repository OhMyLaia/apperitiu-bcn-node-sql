import Favorite from '../../models/favorite-model/favorite.model.js';
import { Request, Response } from 'express';
import User from '../../models/user-model/user.model.js';
import Terrace from '../../models/terrace-model/db/terrace-model-sequelize.js';
import { favoriteSchema } from '../../models/favorite-model/zod/favorite-schema.js';


export const addFavorite = async (req: Request, res: Response) => {

  try {

    // 1. Validació amb Zod
    const parsed = favoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { userId, terraceId } = parsed.data;

    // 2. Comprova si l'usuari i la terrassa existeixen
    const user = await User.findByPk(userId, {
      attributes: ['id'],
    });
    const terrace = await Terrace.findByPk(terraceId, {
      attributes: ['id'], // només els camps que existeixen a Supabase
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!terrace) {
      return res.status(404).json({ error: 'Terrace not found' });
    }
    const [favorite, created] = await Favorite.findOrCreate({
      where: { id_user: userId, id_terrace: terraceId },
    });
    res.status(200).json({ favorite, created });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Error adding favorite' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query param' });
  }

  try {
    const favorites = await Favorite.findAll({ where: { id_user: userId } });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error al obtenir els favs:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  const { terraceId, userId } = req.body; //altra manera de fer-ho. check if it works later
  /*   const userId = req.user.id;
   */
  try {
    await Favorite.destroy({
      where: { id_user: userId, id_terrace: terraceId },
    });
    res.status(200).json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Error removing favorite' });
  }
};
