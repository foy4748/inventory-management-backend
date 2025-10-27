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
exports.SgetCategorizedSalesCount = exports.SgetCategorizedSalesV2 = exports.SgetCategorizedSales = exports.SgetSales = exports.ScreateSale = void 0;
const sale_model_1 = __importDefault(require("./sale.model"));
const product_constant_1 = require("../product/product.constant");
const product_model_1 = __importDefault(require("../product/product.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const month_to_weeks_1 = __importDefault(require("../../utils/month_to_weeks"));
// Create a New Sale
const ScreateSale = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity: saleQuantity } = payload;
    const toBeSalingProduct = yield product_model_1.default.findById(product_id);
    const updatedStock = Number(toBeSalingProduct === null || toBeSalingProduct === void 0 ? void 0 : toBeSalingProduct.quantity) - saleQuantity;
    console.log(updatedStock);
    // Checking whether sale is allowed or not
    if (updatedStock < 0) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Can't sale exceeding stock");
    }
    yield product_model_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(product_id) }, { $set: { quantity: updatedStock } });
    const response = yield sale_model_1.default.create(payload);
    return response;
});
exports.ScreateSale = ScreateSale;
// Get Sales
const SgetSales = () => __awaiter(void 0, void 0, void 0, function* () {
    //const { sortBy, sortOrder } = query;
    //const sortRule: any = {};
    const paginationRule = {
        page: product_constant_1.defaultPage,
        limit: product_constant_1.defaultLimit,
    };
    const { page, limit } = paginationRule;
    const response = yield sale_model_1.default.find({})
        .skip((page - 1) * limit)
        .limit(limit);
    paginationRule['total'] = yield sale_model_1.default.find({
        quantity: { $nin: [0] },
    }).countDocuments();
    return {
        meta: paginationRule,
        data: response,
    };
});
exports.SgetSales = SgetSales;
// Get Yearly, Monthly, Weekly Categorized Sales Data
const SgetCategorizedSales = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedFields = {
        product_id: '$product_id',
        name: '$name',
        brand: '$brand',
        modelNo: '$modelNo',
        saleDate: '$sale_date',
        quantity: '$quantity',
    };
    const sortLogic = { _id: -1 };
    const queries = {
        // Yearly Data
        yearly: (years) => {
            const first = Number(years[0]);
            return [
                {
                    $bucket: {
                        groupBy: { $year: '$sale_date' },
                        boundaries: years,
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
        monthly: (year, months) => [
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
        weekly: (year, month) => [
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
                    boundaries: (0, month_to_weeks_1.default)(year, month),
                    default: ((0, month_to_weeks_1.default)(year, month)[0] - 1 + 53) % 53,
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
    if (!(query === null || query === void 0 ? void 0 : query.categorizeBy) || (query === null || query === void 0 ? void 0 : query.categorizeBy) == 'yearly') {
        return yield sale_model_1.default.aggregate(queries['yearly'](query === null || query === void 0 ? void 0 : query.years.split(',').map((itm) => parseInt(itm))));
    }
    else if ((query === null || query === void 0 ? void 0 : query.categorizeBy) == 'monthly') {
        if ((query === null || query === void 0 ? void 0 : query.year) && (query === null || query === void 0 ? void 0 : query.months)) {
            const months = query === null || query === void 0 ? void 0 : query.months.split(',').map((itm) => parseInt(itm));
            return yield sale_model_1.default.aggregate(queries['monthly'](Number(query === null || query === void 0 ? void 0 : query.year), months));
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Provide Year and Months to categorize by Month');
        }
    }
    else if ((query === null || query === void 0 ? void 0 : query.categorizeBy) == 'weekly') {
        if ((query === null || query === void 0 ? void 0 : query.year) && (query === null || query === void 0 ? void 0 : query.month)) {
            return yield sale_model_1.default.aggregate(queries['weekly'](Number(query === null || query === void 0 ? void 0 : query.year), Number(query === null || query === void 0 ? void 0 : query.month)));
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Provide Year & Month to categorize by Week');
        }
    }
    else {
        return yield sale_model_1.default.aggregate(queries['yearly'](query === null || query === void 0 ? void 0 : query.years.split(',').map((itm) => parseInt(itm))));
    }
});
exports.SgetCategorizedSales = SgetCategorizedSales;
// ============================
const SgetCategorizedSalesV2 = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filterRule = [];
    const paginationRule = {
        page: product_constant_1.defaultPage,
        limit: product_constant_1.defaultLimit,
        total: 0,
    };
    for (const field in query) {
        if (field == 'year') {
            filterRule.push({ $eq: [{ $year: '$sale_date' }, Number(query === null || query === void 0 ? void 0 : query.year)] });
        }
        if (field == 'month' && !isNaN(Number(query['month']))) {
            filterRule.push({
                $eq: [{ $month: '$sale_date' }, Number(query === null || query === void 0 ? void 0 : query.month)],
            });
        }
        if (field == 'page')
            paginationRule.page = Number(query === null || query === void 0 ? void 0 : query.page);
        if (field == 'limit')
            paginationRule.limit = Number(query === null || query === void 0 ? void 0 : query.limit);
    }
    if (!filterRule.length)
        filterRule.push({
            $eq: [{ $year: '$sale_date' }, Number(new Date().getFullYear())],
        });
    paginationRule['total'] = yield sale_model_1.default.find({
        $expr: {
            $and: filterRule,
        },
    }).countDocuments();
    const data = yield sale_model_1.default.find({
        $expr: {
            $and: filterRule,
        },
    })
        .skip((paginationRule.page - 1) * paginationRule.limit)
        .limit(paginationRule.limit)
        .sort({ sale_date: -1 });
    return { meta: paginationRule, data };
});
exports.SgetCategorizedSalesV2 = SgetCategorizedSalesV2;
// ============================
// Get Yearly, Monthly, Weekly Categorized Sales Count
const SgetCategorizedSalesCount = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // https://stackoverflow.com/questions/74986463/how-to-filter-data-between-year-and-month-in-mongodb
    // Tested in NoSQL Booster
    const queries = {
        // Yearly Query
        yearly: () => [
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
        monthly: (year) => [
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
        weekly: (year, month) => [
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
    if (!(query === null || query === void 0 ? void 0 : query.categorizeBy) || (query === null || query === void 0 ? void 0 : query.categorizeBy) == 'yearly') {
        return yield sale_model_1.default.aggregate(queries['yearly']());
    }
    else if ((query === null || query === void 0 ? void 0 : query.categorizeBy) == 'monthly') {
        if (query === null || query === void 0 ? void 0 : query.year) {
            return yield sale_model_1.default.aggregate(queries['monthly'](Number(query === null || query === void 0 ? void 0 : query.year)));
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Provide Year to categorize by Month');
        }
    }
    else if ((query === null || query === void 0 ? void 0 : query.categorizeBy) == 'weekly') {
        if ((query === null || query === void 0 ? void 0 : query.year) && (query === null || query === void 0 ? void 0 : query.month)) {
            return yield sale_model_1.default.aggregate(queries['weekly'](Number(query === null || query === void 0 ? void 0 : query.year), Number(query === null || query === void 0 ? void 0 : query.month)));
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Provide Year & Month to categorize by Week');
        }
    }
    else {
        return yield sale_model_1.default.aggregate(queries['yearly']());
    }
});
exports.SgetCategorizedSalesCount = SgetCategorizedSalesCount;
