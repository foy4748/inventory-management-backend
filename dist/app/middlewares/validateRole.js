"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const validateRole = (role) => {
    return (0, catchAsyncError_1.default)((req, _, next) => {
        var _a;
        if (String((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.role) == role) {
            next();
        }
        else {
            // Not Authorized User: The user does not possess the required permissions for the requested action or resource.
            // Access Denied: The user is attempting to access a resource without the necessary authorization.
            throw new Error('Unauthorized Access');
        }
    });
};
exports.default = validateRole;
