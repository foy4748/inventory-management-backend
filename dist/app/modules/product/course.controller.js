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
exports.CupdateCourse = exports.CgetCourses = exports.CcourseCreate = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course.service");
exports.CcourseCreate = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, decoded } = req;
    body.createdBy = decoded._id;
    const data = yield (0, course_service_1.ScreateCourse)(body);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Course created successfully',
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CgetCourses = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const { data, meta } = yield (0, course_service_1.SgetCourses)(query);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Courses retrieved successfully',
        meta,
        data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
exports.CupdateCourse = (0, catchAsyncError_1.default)((req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const query = req.body;
    const data = yield (0, course_service_1.SupdateCourse)(String(courseId), query);
    const responseObj = {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Course updated successfully',
        data: data,
    };
    (0, sendResponse_1.default)(res, responseObj);
}));
