const Transaction = require("../models/transactionModel");
const AppError = require("../utils/AppError"); // Using the same error utility
const mongoose = require("mongoose");

// ─── CREATE TRANSACTION ────────────────────────────────
const createTransaction = async (transactionData, userId) => {
  // Directly spread data and attach the userId
  const transaction = await Transaction.create({
    ...transactionData,
    userId,
  });

  return transaction;
};

// ─── GET ALL TRANSACTIONS ──────────────────────────────
const getAllTransactions = async (userId, query) => {
  // Filter by userId to ensure data privacy
  const filter = { userId };

  if (query.category) {
    filter.category = query.category;
  }
  if (query.type) {
    filter.type = query.type;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }
  const transactions = await Transaction.find(filter).sort({ date: -1 });
  return transactions;
};

// ─── GET SINGLE TRANSACTION ───────────────────────────
const getTransactionById = async (id, userId) => {
  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Transaction not found or access denied", 404); // Matches User logic[cite: 1]
  }

  return transaction;
};

// ─── UPDATE TRANSACTION ───────────────────────────────
const updateTransaction = async (id, userId, updateData) => {
  // Prevent changing the ownership of the transaction[cite: 1]
  delete updateData.userId;

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!transaction) {
    throw new AppError("Transaction not found or access denied", 404);
  }

  return transaction;
};

// ─── DELETE TRANSACTION (PERMANENT) ────────────────────
const deleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Transaction not found or access denied", 404);
  }

  return transaction;
};

// ─── GET SUMMARY (AGGREGATION) ─────────────────────────
const getTransactionSummary = async (userId) => {
  const stats = await Transaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  // Transform the array into a clean object for the responseHandler[cite: 1]
  const summary = {
    income: 0,
    expense: 0,
    balance: 0,
  };

  stats.forEach((item) => {
    if (item._id === "income") summary.income = item.total;
    if (item._id === "expense") summary.expense = item.total;
  });

  summary.balance = summary.income - summary.expense;

  return summary;
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
