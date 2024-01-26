import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import userValidationSchema, {
  userLoginValidationSchema,
  userPasswordUpdateValidationSchema,
} from './user.validation';

import {
  CchangeUserPassword,
  CcreateUser,
  CloginUser,
} from './user.controller';
import authentication from '../../middlewares/authentication';

const router = express.Router();

router.post('/register', validateRequest(userValidationSchema), CcreateUser);
router.post('/login', validateRequest(userLoginValidationSchema), CloginUser);
router.post(
  '/change-password',
  authentication(),
  validateRequest(userPasswordUpdateValidationSchema),
  CchangeUserPassword,
);

export default router;
