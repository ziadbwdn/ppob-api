const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');
const { validate, topupSchema, transactionSchema } = require('../middleware/validation');

// GET /balance
router.get('/balance', 
  authenticateToken,
  transactionController.getBalance
);

// POST /topup
router.post('/topup', 
  authenticateToken,
  validate(topupSchema),
  transactionController.topup
);

// POST /transaction
router.post('/transaction', 
  authenticateToken,
  validate(transactionSchema),
  transactionController.makeTransaction
);

// GET /transaction/history
router.get('/transaction/history', 
  authenticateToken,
  transactionController.getTransactionHistory
);

module.exports = router;