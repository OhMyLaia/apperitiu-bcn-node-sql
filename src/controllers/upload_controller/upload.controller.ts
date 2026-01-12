import { Request, Response } from 'express';
import cloudinary from "../../services/cloudinary-service/cloudinary.service.js";
import { UploadedFile } from 'express-fileupload';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.files?.image as UploadedFile;

    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: 'No valid image file uploaded' });
    }

     const allowedFolders = ['users', 'terraces'];
    const folder = req.query.folder as string;

      if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        error: `Carpeta no permitida. Usa: ${allowedFolders.join(', ')}`,
      });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, { //con esta linea cloudinary guarda las fotos en una carpeta raiz, se pueden añadir aqui las carpetas , por ejemplo folder:terraces, en dashboar de cloudinary en assets puedes verñas
        folder
    //   folder: 'uploads', 
    });

    return res.status(200).json({
        message:"image uploaded",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
};