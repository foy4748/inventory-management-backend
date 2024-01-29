import { z } from 'zod';

const saleValidationSchema = z.object({
  price: z.number().min(1),
  quantity: z.number().min(1),
  sale_date: z.string(),
  product_id: z.string(),
  name: z.string(),
  brand: z.string(),
  modelNo: z.string(),
  buyer_name: z.string(),
});

export default saleValidationSchema;
