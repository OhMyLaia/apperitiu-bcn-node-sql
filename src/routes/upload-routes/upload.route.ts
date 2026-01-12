import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { uploadImage } from '../../controllers/upload_controller/upload.controller.js'

const router = Router();

router.post('/upload', fileUpload({ useTempFiles: true }), uploadImage);

export default router;