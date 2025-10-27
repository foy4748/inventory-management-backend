"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const errorHandlers = {
    CastError: (err) => {
        const errorResponse = {
            success: false,
            message: 'Invalid ID',
            errorMessage: err.value + ` is not a valid ID!`,
            errorDetails: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
        };
        const statusCode = http_status_1.default.BAD_REQUEST;
        return {
            statusCode,
            errorResponse,
        };
    },
    ValidationError: (err) => {
        const errors = err.issues.map((issue) => {
            const field = issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1];
            const message = issue.message;
            return `${field} is ${message.toLowerCase()}`;
        });
        const errorResponse = {
            success: false,
            message: 'Validation Error',
            errorMessage: errors.reduce((acc, curr) => acc + curr + '. ', '').trim(),
            errorDetails: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
        };
        const statusCode = http_status_1.default.BAD_REQUEST;
        return {
            statusCode,
            errorResponse,
        };
    },
    DuplicateEntry: (err) => {
        const errorMessage = Object.entries(err === null || err === void 0 ? void 0 : err.keyValue)
            .reduce((acc, [key, value]) => acc + key + ` with value '${value}' already exists. `, '')
            .trim();
        const errorResponse = {
            success: false,
            message: 'Duplicate Entry',
            errorMessage,
            errorDetails: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
        };
        const statusCode = http_status_1.default.BAD_REQUEST;
        return {
            statusCode,
            errorResponse,
        };
    },
    JsonWebTokenError: (err) => {
        const errorResponse = {
            success: false,
            message: 'Invalid Access Token was provided',
            errorMessage: err.message,
            errorDetails: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
        };
        const statusCode = http_status_1.default.FORBIDDEN;
        return {
            statusCode,
            errorResponse,
        };
    },
};
exports.default = errorHandlers;
