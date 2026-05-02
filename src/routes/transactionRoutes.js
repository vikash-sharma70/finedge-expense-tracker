const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware"); // Using same middleware
const { validateTransaction } = require("../middleware/validator");

// Apply protection to all transaction routes automatically
router.use(protect); //[cite: 1]

// ─── CORE ENDPOINTS ──────────────────────────────────────

// POST   /transactions     -> Add income/expense
router.post("/", validateTransaction, transactionController.createTransaction);

// GET    /transactions     -> Fetch all transactions
router.get("/", transactionController.getAllTransactions);

// GET    /transactions/summary -> Fetch income-expense summary
// NOTE: Place this ABOVE the /:id route so "summary" isn't treated as an ID
router.get("/summary", transactionController.getSummary);

// GET    /transactions/:id -> View single transaction
router.get("/:id", transactionController.getTransactionById);

// PATCH  /transactions/:id -> Update transaction
router.patch(
  "/:id",
  validateTransaction,
  transactionController.updateTransaction,
);

// DELETE /transactions/:id -> Delete transaction[cite: 1]
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
