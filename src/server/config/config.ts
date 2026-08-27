// FALCON Backend Configuration & Environment Constants

export const BACKEND_CONFIG = {
  ENV: 'development',
  JWT_SECRET: 'falcon_atelier_jwt_secret_key_production_ready_2026',
  TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  AI_QUOTA: {
    FREE: {
      DAILY_LIMIT: 3,
      MONTHLY_LIMIT: 50,
    },
    PRO: {
      DAILY_LIMIT: -1, // Unlimited
      MONTHLY_LIMIT: -1, // Unlimited
    },
  },
  INVENTORY: {
    LOW_STOCK_THRESHOLD: 10,
  },
  SHIPPING: {
    FREE_THRESHOLD: 1500,
    STANDARD_PRICE: 25,
  },
};
