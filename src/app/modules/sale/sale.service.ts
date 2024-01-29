/* eslint-disable @typescript-eslint/no-explicit-any */
import ISale from './sale.interface';
import Sale from './sale.model';
import { defaultPage, defaultLimit } from '../product/product.constant';
import Product from '../product/product.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

//import AppError from '../../error/AppError';

// Create a New Sale
export const ScreateSale = async (payload: ISale) => {
  const { product_id, quantity: saleQuantity } = payload;
  const toBeSalingProduct = await Product.findById(product_id);

  const updatedStock = Number(toBeSalingProduct?.quantity) - saleQuantity;
  // Checking whether sale is allowed or not
  if (updatedStock < 0) {
    new AppError(httpStatus.FORBIDDEN, "Can't sale exceeding stock");
  }
  await Product.updateOne(
    { _id: new mongoose.Types.ObjectId(product_id) },
    { $set: { quantity: updatedStock } },
  );
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

  paginationRule['total'] = await Sale.find({
    quantity: { $nin: [0] },
  }).countDocuments();

  return {
    meta: paginationRule,
    data: response,
  };
};
