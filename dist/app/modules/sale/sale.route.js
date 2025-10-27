"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequests_1 = __importDefault(require("../../middlewares/validateRequests"));
const sale_validation_1 = __importDefault(require("./sale.validation"));
const sale_controller_1 = require("./sale.controller");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const router = express_1.default.Router();
router.post('/', (0, authentication_1.default)(), (0, validateRequests_1.default)(sale_validation_1.default), sale_controller_1.CsaleCreate);
router.get('/', sale_controller_1.CgetSales);
router.get('/categorized-count', sale_controller_1.CgetCategorizedSalesCount);
router.get('/categorized', sale_controller_1.CgetCategorizedSalesV2);
exports.default = router;
