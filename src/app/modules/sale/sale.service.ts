/* eslint-disable @typescript-eslint/no-explicit-any */
import ISale, { TCategorizeSaleQuery } from './sale.interface';
import Sale from './sale.model';
import { defaultPage, defaultLimit } from '../product/product.constant';
import Product from '../product/product.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose, { PipelineStage } from 'mongoose';

// Create a New Sale
export const ScreateSale = async (payload: ISale) => {
  const { product_id, quantity: saleQuantity } = payload;
  const toBeSalingProduct = await Product.findById(product_id);

  const updatedStock = Number(toBeSalingProduct?.quantity) - saleQuantity;
  console.log(updatedStock);
  // Checking whether sale is allowed or not
  if (updatedStock < 0) {
    throw new AppError(httpStatus.FORBIDDEN, "Can't sale exceeding stock");
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

// Get Yearly, Monthly, Weekly Categorized Sales
export const SgetCategorizedSales = async (
  query: null | TCategorizeSaleQuery,
) => {
  // https://stackoverflow.com/questions/74986463/how-to-filter-data-between-year-and-month-in-mongodb
  // Tested in NoSQL Booster
  const queries = {
    // Yearly Query
    yearly: (): PipelineStage[] => [
      {
        $group: {
          _id: { $year: '$sale_date' },
          totalSale: { $sum: '$quantity' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
    // Monthly Query
    monthly: (year: number): PipelineStage[] => [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: '$sale_date' }, year] },
              //{$eq: [{$month: "$sale_date"}, 4] }
            ],
          },
        },
      },
      {
        $group: {
          _id: { $month: '$sale_date' },
          totalSale: { $sum: '$quantity' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
    // Weekly Query
    weekly: (year: number, month: number): PipelineStage[] => [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: '$sale_date' }, year] },
              { $eq: [{ $month: '$sale_date' }, month] },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $week: '$sale_date' },
          totalSale: { $sum: '$quantity' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
  };

  if (!query?.categorizeBy || query?.categorizeBy == 'yearly') {
    return await Sale.aggregate(queries['yearly']());
  } else if (query?.categorizeBy == 'monthly') {
    if (query?.year) {
      return await Sale.aggregate(queries['monthly'](Number(query?.year)));
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Provide Year to categorize by Month',
      );
    }
  } else if (query?.categorizeBy == 'weekly') {
    if (query?.year && query?.month) {
      return await Sale.aggregate(
        queries['weekly'](Number(query?.year), Number(query?.month)),
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Provide Year & Month to categorize by Week',
      );
    }
  } else {
    return await Sale.aggregate(queries['yearly']());
  }
};
