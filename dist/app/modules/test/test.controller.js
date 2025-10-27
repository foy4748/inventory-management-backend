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
exports.CPostSaleDataBrutally = exports.CflushDb = void 0;
//import Product from '../product/product.model';
const sale_model_1 = __importDefault(require("../sale/sale.model"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const config_1 = __importDefault(require("../../config"));
const test_service_1 = require("./test.service");
exports.CflushDb = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.secret == config_1.default.flash_db_secret) {
        yield sale_model_1.default.deleteMany();
        return res.send({ error: false, message: 'Flushed DB successfully' });
    }
    else {
        return res.send({ error: true, message: 'Secret was not provided' });
    }
}));
exports.CPostSaleDataBrutally = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.secret == config_1.default.flash_db_secret) {
        yield (0, test_service_1.ScreateSaleTEST)(req.body);
        return res.send({
            error: false,
            message: 'Posted Fake Test Sale Data DB successfully',
        });
    }
    else {
        return res.send({ error: true, message: 'Secret was not provided' });
    }
}));
