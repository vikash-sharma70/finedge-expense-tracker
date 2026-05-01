const AppError = require("../utils/AppError");

const validateTransaction = (req, res, next) => {
  const { type, category, amount } = req.body;

  // 1. Check for required fields
  if (!type || !category || amount === undefined) {
    throw new AppError("Type, category, and amount are required fields", 400);
  }

  // 2. Validate Transaction Type
  const validTypes = ["income", "expense"];
  if (!validTypes.includes(type)) {
    throw new AppError(
      "Invalid transaction type. Must be 'income' or 'expense'",
      400,
    );
  }

  // 3. Validate Amount
  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("Amount must be a positive number", 400);
  }

  // 4. Validate Category
  if (typeof category !== "string" || category.trim().length === 0) {
    throw new AppError("Category must be a non-empty string", 400);
  }

  next(); // Data is valid, proceed to the controller
};

module.exports = { validateTransaction };
