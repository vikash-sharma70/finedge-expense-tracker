const transactionService = require("../services/transactionService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/responseHandler");

// 1. Create a new transaction (Income/Expense)
exports.createTransaction = asyncHandler(async (req, res) => {
  // Use req.user._id based on your teammate's getProfile implementation
  const transaction = await transactionService.createTransaction(
    req.body,
    req.user._id,
  );

  sendSuccess(res, 201, "Transaction added successfully", { transaction });
});

// 2. Fetch all transactions for the logged-in user
exports.getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getAllTransactions(
    req.user._id,
    req.query,
  );

  sendSuccess(res, 200, "Transactions fetched successfully", {
    count: transactions.length,
    transactions,
  });
});

// 3. View a single transaction
exports.getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(
    req.params.id,
    req.user._id,
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found"); // Caught by your global errorHandler
  }

  sendSuccess(res, 200, "Transaction details fetched", { transaction });
});

// 4. Update an existing transaction
exports.updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(
    req.params.id,
    req.user._id,
    req.body,
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found or unauthorized");
  }

  sendSuccess(res, 200, "Transaction updated successfully", { transaction });
});

// 5. Permanently delete a transaction
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.deleteTransaction(
    req.params.id,
    req.user._id,
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found or unauthorized");
  }

  sendSuccess(res, 200, "Transaction permanently deleted");
});

// 6. Fetch income-expense summary (Bonus A)
exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await transactionService.getTransactionSummary(req.user._id);

  sendSuccess(res, 200, "Financial summary fetched successfully", { summary });
});
