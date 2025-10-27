"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteIds = void 0;
const zod_1 = require("zod");
const productValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    brand: zod_1.z.string(),
    modelNo: zod_1.z.string(),
    category: zod_1.z.string(),
    operatingSystem: zod_1.z.string(),
    connectivity: zod_1.z.array(zod_1.z.string()),
    powerSource: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number().min(1),
    releaseDate: zod_1.z.string(),
    // Features
    storage: zod_1.z.number(),
    ram: zod_1.z.number(),
    camera: zod_1.z.number(),
});
exports.bulkDeleteIds = zod_1.z.array(zod_1.z.string().length(12));
exports.default = productValidationSchema;
