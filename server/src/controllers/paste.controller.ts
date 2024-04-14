import { Response, Request } from "express"
import PasteModel from "../models/paste.model";
import type { createPasteSchemaType, getPasteSchemaType } from '../schema/paste.schema';

const pasteCode = async (req: Request, res: Response) => {
    const { key, content, settings } = req.body as createPasteSchemaType;
    try {
        const paste = await PasteModel.create({ key, content, settings });
        res.status(201).json(paste);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getCode = async (req: Request, res: Response) => {
    const { key } = req.params as getPasteSchemaType;
    try {
        const paste = await PasteModel.findOne({ key }, { _id: 0, __v: 0 });
        if (paste) {
            res.status(200).json(paste);
        } else {
            res.status(404).json({ message: 'Not Found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { pasteCode, getCode };