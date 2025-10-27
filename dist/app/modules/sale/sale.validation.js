"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const saleValidationSchema = zod_1.z.object({
    price: zod_1.z.number().min(1),
    quantity: zod_1.z.number().min(1),
    sale_date: zod_1.z.string(),
    product_id: zod_1.z.string(),
    name: zod_1.z.string(),
    brand: zod_1.z.string(),
    modelNo: zod_1.z.string(),
    buyer_name: zod_1.z.string(),
});
exports.default = saleValidationSchema;
