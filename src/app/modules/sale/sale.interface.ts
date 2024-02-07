import mongoose from 'mongoose';

export default interface ISale {
  _id?: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  sale_date: Date;
  product_id: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  modelNo: string;
  buyer_name: string;
}

export type TCategorizeSaleQuery = {
  categorizeBy?: null | 'yearly' | 'monthly' | 'weekly';
  year: number | `${number}`;
  month: number | `${number}`;
  months?: string;
};
