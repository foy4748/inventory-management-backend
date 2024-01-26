//import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  brand: string;
  modelNo: string;
  category: string;
  operatingSystem: string;
  connectivity: string[];
  powerSource: string;
  price: number;
  quantity: number;
  releaseDate: string;
  // Features
  storage: string;
  ram: string;
}
