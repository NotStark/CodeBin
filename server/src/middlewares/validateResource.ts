import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const validateResource =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
        });
        next();
      } catch (e) {
        return res.status(400).json({ errorMessage: fromZodError(e as ZodError).toString(), error: JSON.stringify(e) });
      }
    };

export default validateResource;