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
exports.ScreateReview = void 0;
const review_model_1 = __importDefault(require("./review.model"));
// Create a New Review
const ScreateReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield review_model_1.default.create(payload)
        .then((t) => t.populate('createdBy'))
        .then((t) => t);
    return response;
});
exports.ScreateReview = ScreateReview;
// // Get Reviews
// export const SgetReviews = async (): Promise<IReview[]> => {
//   const response = await Review.find({});
//   return response;
// };
