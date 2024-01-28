/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import sendResponse, { TResponse } from '../../utils/sendResponse';
import ISale from './sale.interface';
import { ScreateSale, SgetSales } from './sale.service';

export const CsaleCreate = catchAsyncError(async (req, res, _) => {
  const { body, decoded } = req;

  body.createdBy = decoded._id;
  const data: ISale = await ScreateSale(body);
  const responseObj: TResponse<ISale> = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sale created successfully',
    data,
  };
  sendResponse<ISale>(res, responseObj);
});

export const CgetSales = catchAsyncError(async (req, res, _) => {
  const { data, meta } = await SgetSales();
  const responseObj: TResponse<ISale[]> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sales retrieved successfully',
    meta,
    data,
  };
  sendResponse<ISale[]>(res, responseObj);
});
