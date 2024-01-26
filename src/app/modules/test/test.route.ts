import express from 'express';
const router = express.Router();
import { CflushDb } from './test.controller';

router.delete('/', CflushDb);

export default router;
