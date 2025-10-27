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
exports.SdeleteProducts = exports.SgetProducts = exports.ScreateProduct = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const product_constant_1 = require("./product.constant");
//import AppError from '../../error/AppError';
// Create a New Product
const ScreateProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield product_model_1.default.create(payload);
    return response;
});
exports.ScreateProduct = ScreateProduct;
// Get Products
const SgetProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    //const { sortBy, sortOrder } = query;
    //const sortRule: any = {};
    const filterRule = {};
    const paginationRule = {
        page: product_constant_1.defaultPage,
        limit: product_constant_1.defaultLimit,
    };
    // Creating filter Rules
    product_constant_1.filterableFields.forEach((field) => {
        if (field in query) {
            if (field == 'releaseDate') {
                filterRule[field] = { $gte: query[field] };
            }
            // For Pagination
            if (field == 'page') {
                paginationRule[field] = Number(query[field]);
                return;
            }
            // For Pagination
            if (field == 'limit') {
                paginationRule[field] = Number(query[field]);
                return;
            }
            filterRule[field] = query[field];
        }
    });
    // ===================================================
    if ('minPrice' in query && 'maxPrice' in query) {
        filterRule['price'] = {
            $gte: Number(query['minPrice']),
            $lte: Number(query['maxPrice']),
        };
    }
    const { page, limit } = paginationRule;
    const response = yield product_model_1.default.find(filterRule)
        .skip((page - 1) * limit)
        .limit(limit);
    paginationRule['total'] = yield product_model_1.default.find(filterRule).countDocuments();
    return {
        meta: paginationRule,
        data: response,
    };
});
exports.SgetProducts = SgetProducts;
// Delete Products
const SdeleteProducts = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResponse = yield product_model_1.default.deleteMany({ _id: { $in: payload } });
    return deleteResponse;
});
exports.SdeleteProducts = SdeleteProducts;
