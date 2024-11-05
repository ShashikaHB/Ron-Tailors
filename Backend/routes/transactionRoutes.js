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
  getAllDayEndRecords,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/filteredTransactions', getFilteredTransactions)
router.post('/', addCustomTransaction);
router.get('/filterByTime/:timePeriod', getTransactionsByTimePeriod);
router.get('/dayend', getAllDayEndRecords)
router.post('/dayend', getDayEndRecord);
router.post('/dayend/update', updateCashInHand)
router.get('/:transactionId', getSingleCustomTransaction);
router.patch('/:transactionId', editCustomTransaction);
router.delete('/:transactionId', deleteCustomTransaction);

export default router;