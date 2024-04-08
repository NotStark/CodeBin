import { Response, Request } from "express"
import PasteModel from "../models/paste.model";
import type { createPasteSchemaType, getPasteSchemaType } from '../schema/paste.schema';

const pasteCode = async (req: Request, res: Response) => {
    const { key, content, settings } = req.body as createPasteSchemaType;
    const paste = await PasteModel.create({ key, content, settings });
    res.status(201).json(paste);
}


const getCode = async (req: Request, res: Response) => {
    const { key } = req.params as getPasteSchemaType;
    console.log(req.params);
    const paste = await PasteModel.findOne({ key } , { _id: 0, __v: 0 });
    if (paste) {
        res.status(200).json(paste);
    } else {
        res.status(404).json({ message: 'Not Found' });
    }
}

export { pasteCode, getCode };