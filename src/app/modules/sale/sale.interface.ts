import mongoose from 'mongoose';

export default interface ISale {
  _id: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  sale_date: Date;
  product_id: mongoose.Types.ObjectId;
  productName: string;
  productBrand: string;
  productModel: string;
  buyer_name: string;
}
