import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import saleValidationSchema from './sale.validation';
import {
  CgetCategorizedSales,
  CgetCategorizedSalesCount,
  CgetSales,
  CsaleCreate,
} from './sale.controller';
import authentication from '../../middlewares/authentication';
const router = express.Router();

router.post(
  '/',
  authentication(),
  validateRequest(saleValidationSchema),
  CsaleCreate,
);

router.get('/', CgetSales);
router.get('/categorized-count', CgetCategorizedSalesCount);
router.get('/categorized', CgetCategorizedSales);

export default router;
