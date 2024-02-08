/* eslint-disable @typescript-eslint/no-explicit-any */
import ISale, { TCategorizeSaleQuery } from './sale.interface';
import Sale from './sale.model';
import { defaultPage, defaultLimit } from '../product/product.constant';
import Product from '../product/product.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose, { PipelineStage } from 'mongoose';
import getWeeksInMonth from '../../utils/month_to_weeks';

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
// Get Yearly, Monthly, Weekly Categorized Sales Data
export const SgetCategorizedSales = async (
  query: null | TCategorizeSaleQuery,
) => {
  const allowedFields = {
    product_id: '$product_id',
    name: '$name',
    brand: '$brand',
    modelNo: '$modelNo',
    saleDate: '$sale_date',
  };
  const sortLogic: Record<string, 1 | -1> = { _id: -1 };

  const queries = {
    // Yearly Data
    yearly: (years: number[]): PipelineStage[] => {
      const first = Number(years[0]);
      return [
        {
          $bucket: {
            groupBy: { $year: '$sale_date' },
            boundaries: years as number[],
            default: first - 1,
            output: {
              data: {
                $push: allowedFields,
              },
            },
          },
        },
        {
          $sort: sortLogic,
        },
      ];
    },

    // Monthly Data
    monthly: (year: number, months: number[]): PipelineStage[] => [
      {
        $match: {
          $expr: { $eq: [{ $year: '$sale_date' }, year] },
        },
      },
      {
        $bucket: {
          groupBy: { $month: '$sale_date' },
          boundaries: months,
          default: (months[0] - 1 + 12) % 12,
          output: {
            data: {
              $push: allowedFields,
            },
          },
        },
      },
      {
        $sort: sortLogic,
      },
    ],

    // Weekly Data
    weekly: (year: number, month: number): PipelineStage[] => [
      {
        $match: {
          $expr: {
            $and: [{ $eq: [{ $year: '$sale_date' }, year] }],
          },
        },
      },
      {
        $bucket: {
          groupBy: { $week: '$sale_date' },
          boundaries: getWeeksInMonth(year, month),
          default: (getWeeksInMonth(year, month)[0] - 1 + 53) % 53,
          output: {
            data: {
              $push: allowedFields,
            },
          },
        },
      },
      {
        $sort: sortLogic,
      },
    ],
  };
  if (!query?.categorizeBy || query?.categorizeBy == 'yearly') {
    return await Sale.aggregate(
      queries['yearly'](
        query?.years.split(',').map((itm) => parseInt(itm)) as number[],
      ),
    );
  } else if (query?.categorizeBy == 'monthly') {
    if (query?.year && query?.months) {
      const months = query?.months.split(',').map((itm) => parseInt(itm));
      return await Sale.aggregate(
        queries['monthly'](Number(query?.year), months),
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Provide Year and Months to categorize by Month',
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
    return await Sale.aggregate(
      queries['yearly'](query?.years.split(',').map((itm) => parseInt(itm))),
    );
  }
};

// Get Yearly, Monthly, Weekly Categorized Sales Count
export const SgetCategorizedSalesCount = async (
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
