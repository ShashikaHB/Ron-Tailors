import express from 'express';
import {
  getAllTransactions,
  addCustomTransaction,
  getTransactionsByTimePeriod,
  editCustomTransaction,
  deleteCustomTransaction,
  getSingleCustomTransaction,
  getDayEndRecord,
  updateCashInHand,
  getFilteredTransactions,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/filteredTransactions', getFilteredTransactions)
router.post('/', addCustomTransaction);
router.get('/:transactionId', getSingleCustomTransaction);
router.patch('/:transactionId', editCustomTransaction);
router.delete('/:transactionId', deleteCustomTransaction);
router.get('/filterByTime/:timePeriod', getTransactionsByTimePeriod);
router.get('/dayend', getDayEndRecord);
router.post('/dayend', updateCashInHand)

export default router;