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
exports.SupdateCourse = exports.SgetCourses = exports.ScreateCourse = void 0;
const course_model_1 = __importDefault(require("./course.model"));
const course_constant_1 = require("./course.constant");
const moment_1 = __importDefault(require("moment"));
const AppError_1 = __importDefault(require("../../error/AppError"));
// Create a New Course
const ScreateCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield course_model_1.default.create(payload);
    return response;
});
exports.ScreateCourse = ScreateCourse;
// Get Courses
const SgetCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, sortOrder } = query;
    const sortRule = {};
    const filterRule = {};
    const paginationRule = {
        page: course_constant_1.defaultPage,
        limit: course_constant_1.defaultLimit,
    };
    // Creating filter Rules
    course_constant_1.filterableFields.forEach((field) => {
        if (field in query) {
            if (field == 'tags') {
                filterRule['tags.name'] = query[field];
                return;
            }
            if (field == 'level') {
                filterRule['details.level'] = query[field];
                return;
            }
            // For Ranged Date
            if (field == 'startDate') {
                filterRule[field] = { $gte: query[field] };
                return;
            }
            if (field == 'endDate') {
                filterRule[field] = { $lte: query[field] };
                return;
            }
            // Gotta fix this ============================VVVVV
            /*
            // For Ranged Price
            if (field == 'minPrice') {
              filterRule['price'] = { $gte: query[field] };
              return;
            }
      
            if (field == 'maxPrice') {
              filterRule['price'] = { $lte: query[field] };
              return;
            }
            */
            // Gotta fix this ============================AAAAA
            // For Pagination
            if (field == 'page') {
                paginationRule[field] = Number(query[field]);
                return;
            }
            // For Pagination
            if (field == 'limit') {
                paginationRule[field] = Number(query[field]);
                return;
            }
            filterRule[field] = query[field];
        }
    });
    // ===================================================
    if ('minPrice' in query && 'maxPrice' in query) {
        filterRule['price'] = {
            $gte: Number(query['minPrice']),
            $lte: Number(query['maxPrice']),
        };
    }
    if (sortBy && course_constant_1.sortableFields.includes(sortBy)) {
        sortRule[sortBy] = (sortOrder == 'desc' && -1) || 1;
    }
    const { page, limit } = paginationRule;
    const response = yield course_model_1.default.find(filterRule)
        .sort(sortRule)
        .populate('createdBy')
        .skip((page - 1) * limit)
        .limit(limit);
    paginationRule['total'] = yield course_model_1.default.find(filterRule).countDocuments();
    return {
        meta: paginationRule,
        data: response,
    };
});
exports.SgetCourses = SgetCourses;
const SupdateCourse = (courseId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isPresent = yield course_model_1.default.isIdExists(courseId);
    if (!isPresent) {
        throw new AppError_1.default(404, `Course by provided Id ${courseId} is not found`);
    }
    const { tags, details } = query, primitiveFieldsObj = __rest(query, ["tags", "details"]);
    if (details) {
        for (const key in details) {
            const field = `details.${key}`;
            primitiveFieldsObj[field] = details[key];
        }
    }
    let isDeletedFalse = [];
    let isDeletedTrue = [];
    if (tags) {
        isDeletedFalse = tags.filter((itm) => !itm.isDeleted);
        isDeletedTrue = tags.reduce((acc, itm) => {
            if (itm.isDeleted) {
                delete itm['isDeleted'];
                acc.push(itm);
                return acc;
            }
            return acc;
        }, []);
    }
    yield course_model_1.default.findByIdAndUpdate(courseId, {
        $set: primitiveFieldsObj,
        $addToSet: { tags: { $each: isDeletedFalse } },
    });
    const updatedDoc = yield course_model_1.default.findByIdAndUpdate(courseId, {
        $pullAll: { tags: isDeletedTrue },
    });
    // Calculating durationInWeeks
    const startDate = (0, moment_1.default)((_a = updatedDoc === null || updatedDoc === void 0 ? void 0 : updatedDoc.toObject()) === null || _a === void 0 ? void 0 : _a.startDate);
    const endDate = (0, moment_1.default)((_b = updatedDoc === null || updatedDoc === void 0 ? void 0 : updatedDoc.toObject()) === null || _b === void 0 ? void 0 : _b.endDate);
    const diff = endDate.diff(startDate, 'days');
    const weeks = Math.ceil(diff / 7);
    const updatedDurationInWeeks = yield course_model_1.default.findByIdAndUpdate(courseId, {
        $set: {
            durationInWeeks: weeks,
        },
    }, { new: true })
        .then((t) => t && t.populate('createdBy'))
        .then((t) => t && t);
    return updatedDurationInWeeks;
});
exports.SupdateCourse = SupdateCourse;
