"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequests_1 = __importDefault(require("../../middlewares/validateRequests"));
const review_validation_1 = __importDefault(require("./review.validation"));
const review_controller_1 = require("./review.controller");
const validateRole_1 = __importDefault(require("../../middlewares/validateRole"));
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const router = express_1.default.Router();
router.post('/', (0, authentication_1.default)(), (0, validateRole_1.default)('user'), (0, validateRequests_1.default)(review_validation_1.default), review_controller_1.CreviewCreate);
exports.default = router;
