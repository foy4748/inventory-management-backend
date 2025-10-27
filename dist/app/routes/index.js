"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import userRoutes from '../modules/user/user.route';
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const product_route_1 = __importDefault(require("../modules/product/product.route"));
const sale_route_1 = __importDefault(require("../modules/sale/sale.route"));
const test_route_1 = __importDefault(require("../modules/test/test.route"));
const globalRoutes = express_1.default.Router();
const routes = [
    {
        path: '/products',
        element: product_route_1.default,
    },
    {
        path: '/sales',
        element: sale_route_1.default,
    },
    {
        path: '/auth',
        element: user_route_1.default,
    },
    // Test Routes
    {
        path: '/test',
        element: test_route_1.default,
    },
];
routes.forEach((route) => globalRoutes.use(route.path, route.element));
exports.default = globalRoutes;
