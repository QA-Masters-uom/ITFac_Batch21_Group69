# ITFac_Batch21_Group69

This project contains the automated test suite for the QA Training App, focusing on Dashboard functionalities . It uses **Playwright** for browser interaction and **Cucumber** for BDD scenarios.

## Project Structure

```text
Group_Assignment_Automation/
├── app/                        # Application Binaries (JAR, properties)
├── database/                   # Database Infrastructure (Docker Compose)
├── src/                        # Source Code
│   ├── features/               # BDD Feature Files (User Stories)
│   │   ├── dashboard_ui.feature
│   │   └── dashboard_api.feature
│   ├── steps/                  # Step Definitions (Code Implementation)
│   ├── pages/                  # Page Objects (UI Abstraction)
│   └── support/                # Configuration & Hooks
└── package.json                # Project Scripts & Dependencies
```

## Prerequisites

- Node.js (v16+)
- Docker Desktop
- Java 21+

## Setup & Execution

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Start Database**:

    ```bash
    npm run server
    ```

3.  **Run Tests**:

    ```bash
    npm test
    ```

4.  **Open Frontend Application**:

    Access the QA Training App at: `http://localhost:8081/ui/login`

5.  **Open Swagger UI**:

    Access the API documentation at: `http://localhost:8081/swagger-ui.html`

6.  **Open Test Reports**:

    After test execution, open the HTML report located at `./reports/html/index.html` for detailed results.

## Scope (Tester 204188P)

- **Dashboard UI**: Verifying module visibility and navigation for Admin and Normal users.
- **Dashboard API**: Verifying access control for dashboard-related endpoints.
