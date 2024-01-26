import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import courseValidationSchema from './course.validation';
import { CcourseCreate, CgetCourses, CupdateCourse } from './course.controller';
import validateRole from '../../middlewares/validateRole';
import authentication from '../../middlewares/authentication';
const router = express.Router();

router.post(
  '/courses',
  authentication(),
  validateRole('admin'),
  validateRequest(courseValidationSchema),
  CcourseCreate,
);
router.get('/courses', CgetCourses);
router.put(
  '/courses/:courseId',
  authentication(),
  validateRole('admin'),
  CupdateCourse,
);

export default router;
