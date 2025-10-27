"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlers_1 = __importDefault(require("../error/errorHandlers"));
const zod_1 = require("zod");
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    //console.log(err);
    let errorResponse;
    let statusCode = err.statusCode || 500;
    errorResponse = {
        success: false,
        message: err.message,
        errorMessage: err.message,
        errorDetails: err,
        stack: err === null || err === void 0 ? void 0 : err.stack,
    };
    if ((err === null || err === void 0 ? void 0 : err.name) == 'CastError') {
        const result = errorHandlers_1.default['CastError'](err);
        statusCode = result.statusCode;
        errorResponse = result.errorResponse;
    }
    if (err instanceof zod_1.ZodError) {
        const result = errorHandlers_1.default['ValidationError'](err);
        statusCode = result.statusCode;
        errorResponse = result.errorResponse;
    }
    if ((err === null || err === void 0 ? void 0 : err.code) == 11000) {
        const result = errorHandlers_1.default['DuplicateEntry'](err);
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
    if (err.message == 'jwt must be provided' ||
        err.message == 'jwt expired' ||
        err.message == 'Unauthorized Access') {
        errorResponse.errorMessage =
            'You do not have the necessary permissions to access this resource.';
        errorResponse.errorDetails = null;
        errorResponse.stack = null;
        errorResponse.success = false;
        statusCode = http_status_1.default.UNAUTHORIZED;
        errorResponse.message = 'Unauthorized Access';
    }
    if (err.message.includes('Password')) {
        return res.status(http_status_1.default.BAD_REQUEST).send({
            success: false,
            statusCode: 400,
            message: err.message,
            data: null,
        });
    }
    res.status(statusCode).send(errorResponse);
    next();
};
exports.default = globalErrorHandler;
