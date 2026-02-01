# Dashboard Test Cases

| Test Case ID | Title | Description | Precondition | Steps | Expected Result | Type | Owner |
|-------------|------|------------|-------------|------|----------------|------|------|
| TC_UI_USER_DASH_01 | Verify Normal User Login | Verify that a normal user can log in to access the dashboard. | User is on login page. | 1. Enter `testuser` / `test123`.<br>2. Click Login. | Redirected to `/ui/dashboard`. | UI | 204188P |
| TC_UI_USER_DASH_02 | Verify Dashboard Load | Verify the dashboard loads with all main sections. | User is logged in. | 1. Observe the main content area. | "Categories", "Plants", "Sales", and "Inventory" cards are visible. | UI | 204188P |
| TC_UI_USER_DASH_03 | Verify Access Categories from Dashboard | Verify user can navigate to Categories from the dashboard card. | User is on dashboard. | 1. Click "Manage Categories" on Categories card. | Navigates to Categories list page. | UI | 204188P |
| TC_UI_USER_DASH_04 | Verify Access Plants from Dashboard | Verify user can navigate to Plants from the dashboard card. | User is on dashboard. | 1. Click "Manage Plants" on Plants card. | Navigates to Plants list page. | UI | 204188P |
| TC_UI_USER_DASH_05 | Verify Access Inventory from Dashboard | Verify user can navigate to Inventory from the dashboard. | User is on dashboard. | 1. Click "Open Inventory" on Inventory card. | Navigates to Inventory page. | UI | 204188P |
| TC_API_USER_DASH_01 | Verify Auth Token Retrieval | Verify API provides token on login. | API is running. | 1. POST `/api/auth/login` with `testuser`. | 200 OK; JWT Token returned. | API | 204188P |
| TC_API_USER_DASH_02 | Verify Dashboard Access (Auth Check) | Verify dashboard page is protected. | No auth token. | 1. GET `/ui/dashboard` without login. | Redirects to Login or 401 Unauthorized. | API | 204188P |
| TC_API_USER_DASH_03 | Verify Load Category Stats | Verify API allows fetching category summary for dashboard. | Valid User Token. | 1. GET `/api/categories/summary`. | 200 OK; Returns count of categories. | API | 204188P |
| TC_API_USER_DASH_04 | Verify Load Plant Stats | Verify API allows fetching plant summary for dashboard. | Valid User Token. | 1. GET `/api/plants/summary`. | 200 OK; Returns count of plants. | API | 204188P |
| TC_API_USER_DASH_05 | Verify Load Sales Stats (Access Control) | Verify if user can fetch sales stats. | Valid User Token. | 1. GET `/api/sales/summary` or `/api/sales`. | 403 Forbidden (Normal user restriction). | API | 204188P |
| TC_UI_ADMIN_DASH_01 | Verify Admin Login | Verify admin can log in to the dashboard. | Login page open. | 1. Enter `admin` / `admin123`.<br>2. Click Login. | Redirected to Dashboard. | UI | 204188P |
| TC_UI_ADMIN_DASH_02 | Verify Dashboard Statistics | Verify Admin sees accurate statistics in cards. | Admin logged in; Data exists. | 1. Compare Card count with actual DB count. | Counts match (e.g. Total Plants). | UI | 204188P |
| TC_UI_ADMIN_DASH_03 | Verify "Manage Categories" Button | Verify button works for Admin. | Admin on Dashboard. | 1. Click "Manage Categories". | Navigates to Categories Management page. | UI | 204188P |
| TC_UI_ADMIN_DASH_04 | Verify "Manage Plants" Button | Verify button works for Admin. | Admin on Dashboard. | 1. Click "Manage Plants". | Navigates to Plant Management page. | UI | 204188P |
| TC_UI_ADMIN_DASH_05 | Verify "View Sales" Button | Verify button works for Admin. | Admin on Dashboard. | 1. Click "View Sales". | Navigates to Sales page. | UI | 204188P |
| TC_API_ADMIN_DASH_01 | Verify Admin Auth | Verify Admin login API. | API Running. | 1. POST `/api/auth/login` with Admin creds. | 200 OK; Admin Token returned. | API | 204188P |
| TC_API_ADMIN_DASH_02 | Verify Category Stats API | Verify fetching category counts. | Admin Token. | 1. GET `/api/categories/summary`. | 200 OK; Main/Sub counts returned. | API | 204188P |
| TC_API_ADMIN_DASH_03 | Verify Plant Stats API | Verify fetching plant counts. | Admin Token. | 1. GET `/api/plants/summary`. | 200 OK; Total/Low Stock counts returned. | API | 204188P |
| TC_API_ADMIN_DASH_04 | Verify Sales Stats API | Verify fetching sales revenue/count. | Admin Token. | 1. GET `/api/sales/summary` or `/api/sales`. | 200 OK; Revenue/Count data returned. | API | 204188P |
| TC_API_ADMIN_DASH_05 | Verify Inventory API Access | Verify fetching inventory status. | Admin Token. | 1. GET `/api/inventory`. | 200 OK; Inventory data returned. | API | 204188P |
