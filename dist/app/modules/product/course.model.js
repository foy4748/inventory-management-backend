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
const moment_1 = __importDefault(require("moment"));
const tagSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    _id: false,
});
// Many many thanks to this StackOverflow page
// https://stackoverflow.com/questions/26069640/mongo-addtoset-still-inserting-despite-item-in-array-existing
//
const detailsSchema = new mongoose_1.Schema({
    level: { type: String, required: true },
    description: { type: String, required: true },
}, {
    _id: false,
});
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    instructor: { type: String, required: true },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: { type: Number, required: true },
    tags: [tagSchema],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number },
    details: detailsSchema,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, {
    versionKey: false,
    timestamps: true,
    // Throwing out virtuals
    // id: false,
    // toJSON: {
    //   virtuals: true,
    // },
});
courseSchema.statics.isIdExists = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundCourse = yield this.findById(_id);
        if (foundCourse) {
            return true;
        }
        else {
            return false;
        }
    });
};
// Pre Won't work nice
// if startDate and endDate, these
// are updated
// But If I query using	durationInWeeks
// Pre/Post hook is the way
courseSchema.pre('save', function (next) {
    const startDate = (0, moment_1.default)(this.startDate);
    const endDate = (0, moment_1.default)(this.endDate);
    const diff = endDate.diff(startDate, 'days');
    const weeks = Math.ceil(diff / 7);
    this.durationInWeeks = weeks;
    next();
});
// Virtual is not working
// If I query using durationInWeeks query
// 😔
/*
courseSchema.virtual('durationInWeeks').get(function () {
  const startDate = moment(this?.startDate);
  const endDate = moment(this?.endDate);
  const diff = endDate.diff(startDate, 'days');
  const weeks = Math.ceil(diff / 7);
  return weeks;
});
*/
const Course = (0, mongoose_1.model)('Course', courseSchema);
exports.default = Course;
