import { RequestHandler } from 'express';
import { AnyZodObject, ZodArray, ZodString } from 'zod';

const validateRequest = (
  schema: AnyZodObject | ZodArray<ZodString, 'many'>,
): RequestHandler => {
  return async (req, _, next) => {
    const { body } = req;
    //console.log(body);
    try {
      await schema.parseAsync(body ?? {});
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
