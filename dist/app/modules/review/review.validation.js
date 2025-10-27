"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const reviewValidationSchema = zod_1.z.object({
    courseId: zod_1.z.string(),
    rating: zod_1.z.number().min(1).max(5),
    review: zod_1.z.string(),
});
exports.default = reviewValidationSchema;
