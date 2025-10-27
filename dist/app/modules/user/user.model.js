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
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    passwordHistory: { type: [String] },
}, {
    versionKey: false,
    timestamps: true,
});
// ----------------------------------- Defining Mongoose Middlewares -----------------------------------
// Hashing Password | During User CREATION
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.bcrypt_salt_rounds));
        //this.passwordHistory = [this.password];
        next();
    });
});
// Discarding Password and unnecessary fields | During User FIND
userSchema.pre('find', function (next) {
    this.projection({
        password: 0,
        passwordHistory: 0,
        createdAt: 0,
        updatedAt: 0,
    });
    next();
});
// -----------------------------
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
