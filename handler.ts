import { dbInit } from "./rl-server-lib/database/init";
import { TOOL_CONSUMERS } from "./environment";
import app from "./app-express"
import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import 'source-map-support/register';

async function start(): Promise<any> {
    console.log("Starting server...");
  
    await dbInit(TOOL_CONSUMERS, null);
    console.debug("TOOL_CONSUMERS", `${JSON.stringify(TOOL_CONSUMERS)}`);
  }
  
start();
export const ringleader: APIGatewayProxyHandler = serverless(app);
