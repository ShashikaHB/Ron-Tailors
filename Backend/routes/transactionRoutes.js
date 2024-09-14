import express from 'express';
import {
  getAllTransactions,
  addCustomTransaction,
  getTransactionsByTimePeriod,
  editCustomTransaction,
  deleteCustomTransaction,
  getSingleCustomTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addCustomTransaction);
router.get('/:transactionId', getSingleCustomTransaction);
router.patch('/:transactionId', editCustomTransaction);
router.delete('/:transactionId', deleteCustomTransaction);
router.get('/filterByTime/:timePeriod', getTransactionsByTimePeriod)

export default router;