/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from './product.interface';
import Product from './product.model';
import {
  filterableFields,
  defaultPage,
  defaultLimit,
} from './product.constant';
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

  const { page, limit } = paginationRule;
  const response = await Product.find(filterRule)
    .populate('createdBy')
    .skip((page - 1) * limit)
    .limit(limit);

  paginationRule['total'] = await Product.find(filterRule).countDocuments();

  return {
    meta: paginationRule,
    data: response,
  };
};
