

import path from "path";
import globalRequestLog from "global-request-logger";
import express from "express";
import expressSession from "express-session";
import bodyParser from "body-parser";
import ltiLaunchEndpoints from "./endpoints/ltiLaunchEndpoints";
import ltiServiceEndpoints from "./endpoints/ltiServiceEndpoints";
import { logger } from "./rl-shared/util/LogService";
import { LTI_STUDENT, LTI_INSTRUCTOR, LTI_ASSIGNMENT_REDIRECT, LTI_DEEPLINK_REDIRECT } from "./rl-shared/util/environment";

import { USER_INTERFACE_ROOT } from "./environment";

const USER_INTERFACE_PLAYER_PAGE = path.join(USER_INTERFACE_ROOT, "index.html");

/*========================== LOG ALL REQUESTS =========================*/

globalRequestLog.initialize();
globalRequestLog.on("success", (request: any, response: any) => {
  logger.info({ request: request });
  logger.info({ response: response });
});
globalRequestLog.on("error", (request: any, response: any) => {
  logger.info({ request: request });
  logger.info({ response: response });
});


/*========================== INITIAL SERVER CONFIG ==========================*/

// generate an express instance, the start of our http(s) request handler
const app = express();

// avoid signature failure for LTI https://github.com/omsmith/ims-lti/issues/4
app.enable("trust proxy");

/*========================== GLOBAL MIDDLEWARE ==========================*/

// make req.body access easier for all request handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// In Memory Sessions ( not recommended for production servers )
app.use(
  expressSession({
    secret: "demo-secret",
    resave: true,
    saveUninitialized: true, // don't create cookie or session unless we actually set the user through authentication
    cookie: {
      sameSite: "none",
      secure: true, // set this to true when served from https
      httpOnly: false // ideally set this to true so the client window can't access the cookie
    }
  })
);

// UI static asset server ( CSS, JS, etc...)
// This points the root to the built create react app in rl-tool-example-client
app.use("/", express.static(USER_INTERFACE_ROOT));

/*========================== REGISTER REST ENDPOINTS ==========================*/

// lti 1.3 launch with context and establish session
ltiLaunchEndpoints(app);

// lti 1.3 advantage service endpoints. NOTE: If we decide to only make calls client side with the idToken
// then these endpoints will not be needed. They could be completed to show what a server side flow might look like
ltiServiceEndpoints(app);

/*========================== UI ENDPOINTS ==========================*/

// Instructor
app.route(LTI_INSTRUCTOR).get(async (req: any, res: any) => {
  logger.debug(`hitting instructor response:${JSON.stringify(res.session)}`);
  logger.debug(`hitting instructor request:${JSON.stringify(req.session)}`);
  res.sendFile(USER_INTERFACE_PLAYER_PAGE);
});

// Student
app.route(LTI_STUDENT).get(async (req, res) => {
  res.sendFile(USER_INTERFACE_PLAYER_PAGE);
});

// Student Assignment
app.route(LTI_ASSIGNMENT_REDIRECT).get(async (req, res) => {
  res.sendFile(USER_INTERFACE_PLAYER_PAGE);
});

// Deep Link
app.route(LTI_DEEPLINK_REDIRECT).get(async (req, res) => {
  res.sendFile(USER_INTERFACE_PLAYER_PAGE);
});

export default app;
