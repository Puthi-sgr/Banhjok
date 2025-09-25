export const getFoodStock = (food) => {
  if (!food) {
    return 0;
  }

  const candidates = [
    food.stock,
    food.stock_count,
    food.stockCount,
    food.available_stock,
    food.availableStock,
    food.inventory,
    food.quantity_available,
    food.quantityAvailable,
  ];

  for (const value of candidates) {
    if (value === null || value === undefined) {
      continue;
    }

    const numericValue =
      typeof value === "string" ? Number.parseFloat(value) : value;

    if (Number.isFinite(numericValue)) {
      return Math.max(0, Math.floor(numericValue));
    }
  }

  return 0;
};
