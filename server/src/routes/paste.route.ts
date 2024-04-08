import { Router } from "express";
import { pasteCode, getCode } from "../controllers/paste.controller";
import validateResource from "../middlewares/validateResource";
import { getPasteSchema, createPasteSchema } from "../schema/paste.schema";

const router = Router();

router.route('/get').get(validateResource(getPasteSchema), getCode);
router.route('/paste').post(validateResource(createPasteSchema), pasteCode);

export default router;