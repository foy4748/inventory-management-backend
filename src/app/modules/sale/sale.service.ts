/* eslint-disable @typescript-eslint/no-explicit-any */
import ISale from './sale.interface';
import Sale from './sale.model';
import { defaultPage, defaultLimit } from '../product/product.constant';
//import AppError from '../../error/AppError';

// Create a New Sale
export const ScreateSale = async (payload: ISale) => {
  const response = await Sale.create(payload);
  return response;
};

// Get Sales
export const SgetSales = async () => {
  //const { sortBy, sortOrder } = query;
  //const sortRule: any = {};
  const paginationRule: any = {
    page: defaultPage,
    limit: defaultLimit,
  };

  const { page, limit } = paginationRule;
  const response = await Sale.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  paginationRule['total'] = await Sale.find({}).countDocuments();

  return {
    meta: paginationRule,
    data: response,
  };
};
