/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from './product.interface';
import Product from './product.model';
import {
  filterableFields,
  defaultPage,
  defaultLimit,
} from './product.constant';
import { Types } from 'mongoose';
//import AppError from '../../error/AppError';

// Create a New Product
export const ScreateProduct = async (payload: IProduct) => {
  const response = await Product.create(payload);
  return response;
};

// Get Products
export const SgetProducts = async (
  query: Record<string, any>,
  //) Promise<IProductsResult> => {
) => {
  //const { sortBy, sortOrder } = query;
  //const sortRule: any = {};
  const filterRule: any = {};
  const paginationRule: any = {
    page: defaultPage,
    limit: defaultLimit,
  };
  // Creating filter Rules
  filterableFields.forEach((field) => {
    if (field in query) {
      if (field == 'releaseDate') {
        filterRule[field] = { $gte: query[field] };
      }
      // For Pagination
      if (field == 'page') {
        paginationRule[field] = Number(query[field]);
        return;
      }
      // For Pagination
      if (field == 'limit') {
        paginationRule[field] = Number(query[field]);
        return;
      }
      filterRule[field] = query[field];
    }
  });
  // ===================================================

  if ('minPrice' in query && 'maxPrice' in query) {
    filterRule['price'] = {
      $gte: Number(query['minPrice']),
      $lte: Number(query['maxPrice']),
    };
  }
  if (query.isRestock) {
    filterRule['quantity'] = { $in: [0] };
  } else {
    filterRule['quantity'] = { $nin: [0] };
  }

  const { page, limit } = paginationRule;
  const response = await Product.find(filterRule)
    .skip((page - 1) * limit)
    .limit(limit);

  paginationRule['total'] = await Product.find(filterRule).countDocuments();

  return {
    meta: paginationRule,
    data: response,
  };
};

// Get a Single Product
export const SgetSingleProduct = async (id: string) => {
  const data = await Product.findOne({ _id: new Types.ObjectId(id) });
  console.log(data);
  return data;
};

export const SupdateProduct = async (payload: IProduct) => {
  console.log(payload._id);
  const data = await Product.updateOne(
    { _id: new Types.ObjectId(payload._id) },
    payload,
  );
  console.log(data);
  return data;
};

// Delete Products
export const SdeleteProducts = async (payload: string[]) => {
  const deleteResponse = await Product.deleteMany({ _id: { $in: payload } });
  return deleteResponse;
};
