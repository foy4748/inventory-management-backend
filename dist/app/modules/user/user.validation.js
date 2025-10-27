"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPasswordUpdateValidationSchema = exports.userLoginValidationSchema = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty('Username cannot be empty'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .min(8, 'Minimum 8 character long password is required')
        .max(16, 'Maximum 16 character is allowed for password.'),
    role: zod_1.z.enum(['user', 'admin']),
});
exports.userLoginValidationSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty('Username cannot be empty'),
    password: zod_1.z
        .string()
        .min(8, 'Minimum 8 character long password is required')
        .max(16, 'Maximum 16 character is allowed for password.'),
});
exports.userPasswordUpdateValidationSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string()
        .max(16, 'Maximum 16 character is allowed for password.'),
    newPassword: zod_1.z
        .string()
        .max(16, 'Maximum 16 character is allowed for password.'),
});
exports.default = userValidationSchema;
