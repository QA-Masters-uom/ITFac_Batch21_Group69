import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "./custom-world";
import { config } from "./config";

setDefaultTimeout(config.defaultTimeOut);

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.close();
});
