import { RequestHandler } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject): RequestHandler => {
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
