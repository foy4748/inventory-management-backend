import express from 'express';
const router = express.Router();
import { CPostSaleDataBrutally, CflushDb } from './test.controller';

router.delete('/flush-db', CflushDb);
router.post('/post-fake-sale-data', CPostSaleDataBrutally);

export default router;
