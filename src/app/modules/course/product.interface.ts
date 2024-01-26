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
  storage: number;
  ram: number;
  camera: number;
}

export type TQuery = {
  page?: number | `${number}`;
  limit?: number | `${number}`;
  minPrice?: number | `${number}`;
  maxPrice?: number | `${number}`;
  name?: string;
  brand?: string;
  modelNo?: string;
  category?: string;
  operatingSystem?: string;
  connectivity?: string;
  powerSource?: string;
  quantity?: number;
  releaseDate?: string;
  // Features
  storage?: number;
  ram?: number;
  camera?: number;
};
