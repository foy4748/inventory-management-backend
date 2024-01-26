import { z } from 'zod';

export const detailsValidationSchema = z.object({
  //https://stackoverflow.com/questions/75317224/how-to-validate-a-string-literal-type-using-zod
  level: z.union([
    z.literal('Beginner'),
    z.literal('Intermediate'),
    z.literal('Advanced'),
  ]),
  description: z.string(),
});

export const tagValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});
const courseValidationSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  categoryId: z.string(),
  price: z.number(),
  tags: z.array(tagValidationSchema),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  details: detailsValidationSchema,
});

export default courseValidationSchema;
