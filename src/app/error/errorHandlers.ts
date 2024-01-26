import httpStatus from 'http-status';
import mongoose from 'mongoose';
import TErrorResponse from './error.interface';
import { ZodError, ZodIssue } from 'zod';

const errorHandlers = {
  CastError: (err: mongoose.Error.CastError) => {
    const errorResponse: TErrorResponse = {
      success: false,
      message: 'Invalid ID',
      errorMessage: err.value + ` is not a valid ID!`,
      errorDetails: err,
      stack: err?.stack,
    };

    const statusCode = httpStatus.BAD_REQUEST;

    return {
      statusCode,
      errorResponse,
    };
  },
  ValidationError: (err: ZodError) => {
    const errors = err.issues.map((issue: ZodIssue) => {
      const field = issue?.path[issue.path.length - 1];
      const message = issue.message;
      return `${field} is ${message.toLowerCase()}`;
    });

    const errorResponse: TErrorResponse = {
      success: false,
      message: 'Validation Error',
      errorMessage: errors.reduce((acc, curr) => acc + curr + '. ', '').trim(),
      errorDetails: err,
      stack: err?.stack,
    };

    const statusCode = httpStatus.BAD_REQUEST;

    return {
      statusCode,
      errorResponse,
    };
  },
  DuplicateEntry: (err: any) => {
    const errorMessage = Object.entries(err?.keyValue)
      .reduce(
        (acc, [key, value]) =>
          acc + key + ` with value '${value}' already exists. `,
        '',
      )
      .trim();
    const errorResponse: TErrorResponse = {
      success: false,
      message: 'Duplicate Entry',
      errorMessage,
      errorDetails: err,
      stack: err?.stack,
    };

    const statusCode = httpStatus.BAD_REQUEST;

    return {
      statusCode,
      errorResponse,
    };
  },
  JsonWebTokenError: (err: any) => {
    const errorResponse: TErrorResponse = {
      success: false,
      message: 'Invalid Access Token was provided',
      errorMessage: err.message,
      errorDetails: err,
      stack: err?.stack,
    };

    const statusCode = httpStatus.FORBIDDEN;

    return {
      statusCode,
      errorResponse,
    };
  },
};

export default errorHandlers;
