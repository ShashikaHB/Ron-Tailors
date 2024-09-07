import express from 'express';
import {
  getAllTransactions,
  addCustomTransaction,
  getTransactionsByTimePeriod,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.get('/:timePeriod', getTransactionsByTimePeriod)
router.post('/', addCustomTransaction);

export default router;