"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequests_1 = __importDefault(require("../../middlewares/validateRequests"));
const product_validation_1 = __importDefault(require("./product.validation"));
const product_controller_1 = require("./product.controller");
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const router = express_1.default.Router();
router.post('/', (0, authentication_1.default)(), (0, validateRequests_1.default)(product_validation_1.default), product_controller_1.CproductCreate);
router.get('/', product_controller_1.CgetProducts);
// router.put(
//   '/products/:productId',
//   authentication(),
//   CupdateCourse,
// );
router.delete('/', (0, authentication_1.default)(), product_controller_1.CdeleteProducts);
exports.default = router;
