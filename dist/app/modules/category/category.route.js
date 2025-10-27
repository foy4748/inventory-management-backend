"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequests_1 = __importDefault(require("../../middlewares/validateRequests"));
const category_validation_1 = __importDefault(require("./category.validation"));
const category_controller_1 = require("./category.controller");
const validateRole_1 = __importDefault(require("../../middlewares/validateRole"));
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const router = express_1.default.Router();
router.post('/', (0, authentication_1.default)(), (0, validateRole_1.default)('admin'), (0, validateRequests_1.default)(category_validation_1.default), category_controller_1.CcategoryCreate);
router.get('/', category_controller_1.CgetCategories);
exports.default = router;
