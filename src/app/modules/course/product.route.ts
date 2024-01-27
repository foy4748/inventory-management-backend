import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import productValidationSchema, { bulkDeleteIds } from './product.validation';
import {
  CdeleteProducts,
  CgetProducts,
  CproductCreate,
} from './product.controller';
import authentication from '../../middlewares/authentication';
const router = express.Router();

router.post(
  '/',
  authentication(),
  validateRequest(productValidationSchema),
  CproductCreate,
);

router.get('/', CgetProducts);
// router.put(
//   '/products/:productId',
//   authentication(),
//   CupdateCourse,
// );

router.delete(
  '/',
  authentication(),
  validateRequest(bulkDeleteIds),
  CdeleteProducts,
);

export default router;
