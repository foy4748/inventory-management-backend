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
exports.CgetCategories = exports.CcategoryCreate = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
exports.CcategoryCreate = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, decoded } = req;
    body.createdBy = decoded._id;
    const data = yield (0, category_service_1.ScreateCategory)(body);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Category created successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetCategories = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, category_service_1.SgetCategories)();
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Categories retrieved successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
