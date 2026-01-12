import { Router } from "express";
import {
    getTerraceTags,
    upsertTerraceTags,
    deleteTerraceTags,
} from '../../controllers/tags-controllers/tags.controller.js';

const router = Router();

router.get("/terraces/:id/tags", getTerraceTags);
router.put("/terraces/:id/tags", upsertTerraceTags);
router.delete("/terraces/:id", deleteTerraceTags);

export default router;