import { Schema, model } from 'mongoose';
import ISale from './sale.interface';

const saleSchema = new Schema<ISale>({
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  unitPrice: {
    type: Number,
    min: 0,
    required: true,
  },
  sale_date: {
    type: Date,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productBrand: {
    type: String,
    required: true,
  },
  productModel: {
    type: String,
    required: true,
  },
});

const Sale = model<ISale>('Sale', saleSchema);

export default Sale;
