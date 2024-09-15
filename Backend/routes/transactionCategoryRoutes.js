import express from 'express';
import {
  getAllTransactionCategories,
  addTransactionCategory,
  getSingleTransactionCategory,
  editTransactionCategory,
  deleteTransactionCategory,
} from '../controllers/transactionCategoryController.js';

const router = express.Router();

router.get('/', getAllTransactionCategories);
router.post('/', addTransactionCategory);
router.get('/:transactionCategory', getSingleTransactionCategory);
router.patch('/:transactionCategory', editTransactionCategory);
router.delete('/', deleteTransactionCategory);

export default router;