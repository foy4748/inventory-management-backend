/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import sendResponse, { TResponse } from '../../utils/sendResponse';
import { IProduct, TQuery } from './product.interface';
import {
  ScreateProduct,
  SdeleteProducts,
  SgetProducts,
  SgetSingleProduct,
} from './product.service';

export const CproductCreate = catchAsyncError(async (req, res, _) => {
  const { body, decoded } = req;

  body.createdBy = decoded._id;
  const data: IProduct = await ScreateProduct(body);
  const responseObj: TResponse<IProduct> = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data,
  };
  sendResponse<IProduct>(res, responseObj);
});

export const CgetProducts = catchAsyncError(async (req, res, _) => {
  const { query }: { query: TQuery } = req;
  const { data, meta } = await SgetProducts(query);
  const responseObj: TResponse<IProduct[]> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully',
    meta,
    data,
  };
  sendResponse<IProduct[]>(res, responseObj);
});

export const CgetSingleProduct = catchAsyncError(async (req, res, _) => {
  const { id } = req.params;
  const data = await SgetSingleProduct(id as string);
  const responseObj: TResponse<IProduct> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully',
    data: data as IProduct,
  };
  sendResponse<IProduct>(res, responseObj);
});

export const CdeleteProducts = catchAsyncError(async (req, res, _) => {
  const { body }: { body: string[] } = req;
  const deleteResponse = await SdeleteProducts(body);
  const responseObj: TResponse<object> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products deleted successfully',
    data: deleteResponse,
  };
  sendResponse(res, responseObj);
});
