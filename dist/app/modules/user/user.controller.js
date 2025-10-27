"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CchangeUserPassword = exports.CloginUser = exports.CcreateUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../config"));
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production'
        ? 'none'
        : 'strict'),
};
exports.CcreateUser = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const data = yield (0, user_service_1.ScreateUser)(body);
    const { _id, email, role } = data;
    const token = jsonwebtoken_1.default.sign({
        _id,
        email,
        role,
    }, String(config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.jwt_access_token), { expiresIn: 60 * 60 });
    const { password, passwordHistory } = data, exceptPassword = __rest(data, ["password", "passwordHistory"]);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'User registered successfully',
        data: {
            user: exceptPassword,
            token,
        },
    };
    res.cookie('token', token, cookieOptions);
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CloginUser = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: loginCredentials } = req;
    const currentUser = yield (0, user_service_1.SloginUser)(loginCredentials);
    const { _id, email, role } = currentUser;
    delete currentUser['password'];
    delete currentUser['passwordHistory'];
    const token = jsonwebtoken_1.default.sign({
        _id,
        email,
        role,
    }, String(config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.jwt_access_token), { expiresIn: 60 * 60 });
    const responseload = { user: currentUser, token };
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User login successful',
        data: responseload,
    };
    res.cookie('token', token, cookieOptions);
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CchangeUserPassword = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { decoded, body } = req;
    const data = yield (0, user_service_1.SchangeUserPassword)(decoded, body);
    const _a = data, { password, passwordHistory } = _a, updatedUser = __rest(_a, ["password", "passwordHistory"]);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Password changed successfully',
        data: updatedUser,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
