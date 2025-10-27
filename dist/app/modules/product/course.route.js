"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequests_1 = __importDefault(require("../../middlewares/validateRequests"));
const course_validation_1 = __importDefault(require("./course.validation"));
const course_controller_1 = require("./course.controller");
const validateRole_1 = __importDefault(require("../../middlewares/validateRole"));
const authentication_1 = __importDefault(require("../../middlewares/authentication"));
const router = express_1.default.Router();
router.post('/courses', (0, authentication_1.default)(), (0, validateRole_1.default)('admin'), (0, validateRequests_1.default)(course_validation_1.default), course_controller_1.CcourseCreate);
router.get('/courses', course_controller_1.CgetCourses);
router.put('/courses/:courseId', (0, authentication_1.default)(), (0, validateRole_1.default)('admin'), course_controller_1.CupdateCourse);
exports.default = router;
