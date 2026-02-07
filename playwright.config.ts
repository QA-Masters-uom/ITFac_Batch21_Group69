import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: "on-first-retry",
    screenshot: "only-on-failure",
  },
  timeout: 120000,
  reporter: [["html", { open: "never" }]],
};

export default config;
