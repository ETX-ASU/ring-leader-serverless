import { isExpressionStatement } from "typescript";
import app from "./app-express"
import { logger } from "./rl-shared/util/LogService";
import { dbInit } from "./rl-server-lib/";
import { PORT, TOOL_CONSUMERS } from "./environment";
/*========================== SERVER STARTUP ==========================*/

async function start(): Promise<any> {
  logger.debug("Starting server...");

  // Make sure we have our test activities
  await dbInit(TOOL_CONSUMERS, null);
  logger.debug("TOOL_CONSUMERS", `${JSON.stringify(TOOL_CONSUMERS)}`);
  // Start the app
  app.listen(PORT, "0.0.0.0", () => {
    logger.debug("App is running at", `0.0.0.0:${PORT}`);
  });
}

start();