import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  modelNo: { type: String, required: true },
  category: { type: String, required: true },
  operatingSystem: { type: String, required: true },
  connectivity: { type: [String], required: true },
  powerSource: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  releaseDate: { type: String, required: true },
  // Features
  storage: { type: String, required: true },
  ram: { type: String, required: true },
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
