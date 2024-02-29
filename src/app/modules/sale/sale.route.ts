import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import saleValidationSchema from './sale.validation';
import {
  CgetCategorizedSales,
  CgetCategorizedSalesCount,
  CgetCategorizedSalesV2,
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
router.get('/categorized', CgetCategorizedSalesV2);

export default router;
