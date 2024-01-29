import express from 'express';
import validateRequest from '../../middlewares/validateRequests';
import productValidationSchema from './product.validation';
import {
  CdeleteProducts,
  CgetProducts,
  CgetSingleProduct,
  CproductCreate,
  CupdateProduct,
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
router.get('/:id', CgetSingleProduct);
router.put('/', authentication(), CupdateProduct);

router.delete('/', authentication(), CdeleteProducts);

export default router;
