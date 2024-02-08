import { ErrorRequestHandler } from 'express';
import errorHandlers from '../error/errorHandlers';
import TErrorResponse from '../error/error.interface';
import { ZodError } from 'zod';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //console.log(err);
  let errorResponse: TErrorResponse;
  let statusCode: number = err.statusCode || 500;
  errorResponse = {
    success: false,
    message: err.message,
    errorMessage: err.message,
    errorDetails: err,
    stack: err?.stack,
  };
  if (err?.name == 'CastError') {
    const result = errorHandlers['CastError'](err);
    statusCode = result.statusCode;
    errorResponse = result.errorResponse;
  }

  if (err instanceof ZodError) {
    const result = errorHandlers['ValidationError'](err);
    statusCode = result.statusCode;
    errorResponse = result.errorResponse;
  }

  if (err?.code == 11000) {
    const result = errorHandlers['DuplicateEntry'](err);
    statusCode = result.statusCode;
    errorResponse = result.errorResponse;
  }

  // Handled in the validateRole middleware
  /*
  if (err.name == 'JsonWebTokenError') {
    const result = errorHandlers['JsonWebTokenError'](err);
    statusCode = result.statusCode;
    errorResponse = result.errorResponse;
  }
  */

  if (
    err.message == 'jwt must be provided' ||
    err.message == 'jwt expired' ||
    err.message == 'Unauthorized Access'
  ) {
    errorResponse.errorMessage =
      'You do not have the necessary permissions to access this resource.';
    errorResponse.errorDetails = null;
    errorResponse.stack = null;
    errorResponse.success = false;
    statusCode = httpStatus.UNAUTHORIZED;
    errorResponse.message = 'Unauthorized Access';
  }

  if (err.message.includes('Password')) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      statusCode: 400,
      message: err.message,
      data: null,
    });
  }

  res.status(statusCode).send(errorResponse);
  next();
};

export default globalErrorHandler;
