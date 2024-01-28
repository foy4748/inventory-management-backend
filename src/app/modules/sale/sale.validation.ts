import { z } from 'zod';

const saleValidationSchema = z.object({
  unitPrice: z.number().min(1),
  quantity: z.number().min(1),
  sale_date: z.string(),
  product_id: z.string().length(12),
  productName: z.string(),
  productBrand: z.string(),
  productModel: z.string(),
});

export default saleValidationSchema;
