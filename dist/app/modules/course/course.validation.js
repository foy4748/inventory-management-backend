"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagValidationSchema = exports.detailsValidationSchema = void 0;
const zod_1 = require("zod");
exports.detailsValidationSchema = zod_1.z.object({
    //https://stackoverflow.com/questions/75317224/how-to-validate-a-string-literal-type-using-zod
    level: zod_1.z.union([
        zod_1.z.literal('Beginner'),
        zod_1.z.literal('Intermediate'),
        zod_1.z.literal('Advanced'),
    ]),
    description: zod_1.z.string(),
});
exports.tagValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    isDeleted: zod_1.z.boolean(),
});
const courseValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    instructor: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    price: zod_1.z.number(),
    tags: zod_1.z.array(exports.tagValidationSchema),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    language: zod_1.z.string(),
    provider: zod_1.z.string(),
    details: exports.detailsValidationSchema,
});
exports.default = courseValidationSchema;
