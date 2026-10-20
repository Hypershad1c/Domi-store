const parsedThreshold = Number(process.env.LOW_STOCK_THRESHOLD || 3);

export const lowStockThreshold = Number.isInteger(parsedThreshold) && parsedThreshold >= 0 ? parsedThreshold : 3;
