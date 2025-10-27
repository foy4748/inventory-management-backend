"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
function getWeeksInMonth(month, year) {
    const startDate = (0, moment_1.default)([year]).add(month - 1, 'months');
    const endDate = (0, moment_1.default)(startDate).endOf('month');
    const weeks = [];
    while (startDate <= endDate) {
        weeks.push(startDate.isoWeek());
        startDate.add(1, 'week');
    }
    return weeks;
}
exports.default = getWeeksInMonth;
