import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
  // Base URLs
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8081",
  uiBaseUrl: process.env.UI_BASE_URL || "http://localhost:8081",

  // API Endpoints
  apiAuthLogin: process.env.API_AUTH_LOGIN || "/api/auth/login",
  apiCategories: process.env.API_CATEGORIES || "/api/categories",
  apiPlants: process.env.API_PLANTS || "/api/plants",
  apiSales: process.env.API_SALES || "/api/sales",

  // UI Routes
  uiLogin: process.env.UI_LOGIN || "/ui/login",
  uiDashboard: process.env.UI_DASHBOARD || "/ui/dashboard",
  uiCategories: process.env.UI_CATEGORIES || "/ui/categories",
  uiPlants: process.env.UI_PLANTS || "/ui/plants",
  uiSales: process.env.UI_SALES || "/ui/sales",

  // Configuration
  defaultTimeOut: process.env.DEFAULT_TIMEOUT
    ? parseInt(process.env.DEFAULT_TIMEOUT)
    : 600000,
};
