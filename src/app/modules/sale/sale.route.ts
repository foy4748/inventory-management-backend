import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import saleValidationSchema from './sale.validation';
import { CgetSales, CsaleCreate } from './sale.controller';
import authentication from '../../middlewares/authentication';
const router = express.Router();

router.post(
  '/',
  authentication(),
  validateRequest(saleValidationSchema),
  CsaleCreate,
);

router.get('/', CgetSales);

export default router;
