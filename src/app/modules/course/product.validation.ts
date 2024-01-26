import { z } from 'zod';

const productValidationSchema = z.object({
  name: z.string(),
  brand: z.string(),
  modelNo: z.string(),
  category: z.string(),
  operatingSystem: z.string(),
  connectivity: z.array(z.string()),
  powerSource: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  releaseDate: z.string(),
  // Features
  storage: z.number(),
  ram: z.number(),
  camera: z.number(),
});

export default productValidationSchema;
