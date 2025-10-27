"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CgetCategorizedSalesV2 = exports.CgetCategorizedSales = exports.CgetCategorizedSalesCount = exports.CgetSales = exports.CsaleCreate = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const sale_service_1 = require("./sale.service");
exports.CsaleCreate = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, decoded } = req;
    body.createdBy = decoded._id;
    const data = yield (0, sale_service_1.ScreateSale)(body);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Sale created successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetSales = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield (0, sale_service_1.SgetSales)();
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Sales retrieved successfully',
        meta,
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetCategorizedSalesCount = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const data = yield (0, sale_service_1.SgetCategorizedSalesCount)(query);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Categorized Sales Counts retrieved successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetCategorizedSales = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const data = yield (0, sale_service_1.SgetCategorizedSales)(query);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Categorized Sales retrieved successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetCategorizedSalesV2 = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { meta, data } = yield (0, sale_service_1.SgetCategorizedSalesV2)(query);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Categorized Sales retrieved successfully',
        meta,
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
