import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ValidationError, fromZodError } from "zod-validation-error";

const validateResource =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
        });
        next();
      } catch (e: any ) {
        let errorRes: { error: typeof e, errorMessage?: string | ValidationError } = { error: JSON.stringify(e) }
        if (e instanceof ZodError) {
          errorRes.errorMessage = fromZodError(e)
        } else {
          errorRes.errorMessage = 'Invalid request'
        }
        return res.status(400).json(errorRes);
      }
    };

export default validateResource;