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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchangeUserPassword = exports.SloginUser = exports.ScreateUser = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const moment_1 = __importDefault(require("moment"));
const ScreateUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //payload.passwordHistory = [String(payload.password)];
    const response = yield user_model_1.default.create(payload);
    return response.toObject();
});
exports.ScreateUser = ScreateUser;
const SloginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = payload;
    const currentUser = yield user_model_1.default.findOne({ username });
    if (!currentUser) {
        throw new AppError_1.default(404, `User doesn't exists with username ${username}`);
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(String(password), String(currentUser === null || currentUser === void 0 ? void 0 : currentUser.password));
    if (!isPasswordMatched) {
        throw new AppError_1.default(403, `Invalid Access`);
    }
    return currentUser.toObject();
});
exports.SloginUser = SloginUser;
const SchangeUserPassword = (payload, passwordReplacement) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { _id: userId } = payload;
    const currentUser = yield user_model_1.default.findById(userId);
    //console.log(currentUser);
    const isPasswordMatched = yield bcrypt_1.default.compare(String(passwordReplacement.currentPassword), String(currentUser === null || currentUser === void 0 ? void 0 : currentUser.password));
    const errorString = `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${(0, moment_1.default)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.updatedAt).format('YYYY-MM-DD')} at ${(0, moment_1.default)(currentUser === null || currentUser === void 0 ? void 0 : currentUser.updatedAt).format('hh:mm A')}.`;
    if (!isPasswordMatched) {
        throw new Error(errorString);
    }
    if (passwordReplacement.currentPassword == passwordReplacement.newPassword) {
        throw new Error(errorString);
    }
    for (const oldPassword of currentUser === null || currentUser === void 0 ? void 0 : currentUser.passwordHistory) {
        const isPasswordMatched = yield bcrypt_1.default.compare(String(passwordReplacement.newPassword), String(oldPassword));
        if (isPasswordMatched) {
            throw new Error(errorString);
        }
    }
    const newPassword = yield bcrypt_1.default.hash(passwordReplacement.newPassword, Number(config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.bcrypt_salt_rounds));
    (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.passwordHistory) === null || _a === void 0 ? void 0 : _a.push(String(currentUser === null || currentUser === void 0 ? void 0 : currentUser.password));
    if (Number((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.passwordHistory) === null || _b === void 0 ? void 0 : _b.length) > 2) {
        (_c = currentUser === null || currentUser === void 0 ? void 0 : currentUser.passwordHistory) === null || _c === void 0 ? void 0 : _c.shift();
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, {
        //$addToSet: { passwordHistory: currentUser?.password },
        $set: {
            password: newPassword,
            passwordHistory: currentUser === null || currentUser === void 0 ? void 0 : currentUser.passwordHistory,
        },
    }, { new: true });
    return updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.toObject();
});
exports.SchangeUserPassword = SchangeUserPassword;
