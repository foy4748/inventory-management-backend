"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const test_controller_1 = require("./test.controller");
router.delete('/flush-db', test_controller_1.CflushDb);
router.post('/post-fake-sale-data', test_controller_1.CPostSaleDataBrutally);
exports.default = router;
