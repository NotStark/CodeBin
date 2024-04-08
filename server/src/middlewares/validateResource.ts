import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
        });
        next();
      } catch (e: any) {
        console.log(e);
        return res.status(400).json({ errorMessage: 'invalid request', error: JSON.stringify(e) });
      }
    };

export default validateResource;