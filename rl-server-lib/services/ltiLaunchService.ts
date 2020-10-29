import path from "path";
import url from "url";

import { inspect } from "util";
import { rlProcessOIDCRequest } from "../util/auth";

import { getConnection } from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import { getToolConsumerFromList } from "../services/ToolConsumerService";
import { generateUniqueString } from "../util/generateUniqueString";
import processRequest from "../util/processRequest";
import { OIDC_LOGIN_INIT_ROUTE,
 LTI_ADVANTAGE_LAUNCH_ROUTE,
 LTI_DEEPLINK_REDIRECT,
 LTI_INSTRUCTOR_REDIRECT,
 LTI_ASSIGNMENT_REDIRECT,
 LTI_STUDENT_REDIRECT} from "../../rl-shared/util/environment";

 import { logger } from "../../rl-shared/util/LogService";

const getToolConsumers = async (): Promise<ToolConsumer[]> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumers = await toolConsumerRepository.find();
  return toolConsumers;
};


const initOidcGet = async (req: any, res: any): Promise<void> => {
  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  //This resposne will be save in session or DB and will be used in validating the nonce and other properties
  const response: any = rlProcessOIDCRequest(req, state, nonce);

  const platformDetails = getToolConsumerFromList({
    name: "",
    client_id: response.client_id,
    iss: response.iss,
    deployment_id: ""
  });
  if (platformDetails == undefined) {
    return;
  }
  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;
    logger.debug(
      `request for GET OIDC_LOGIN_INIT_ROUTE{ ${OIDC_LOGIN_INIT_ROUTE} : ${inspect(
        req
      )}`
    );
    await req.session.save(() => {
      logger.debug("session data saved");
    });
  } else {
    throw new Error("no session detected, something is wrong");
  }

  res.redirect(
    url.format({
      pathname: platformDetails.platformOIDCAuthEndPoint,
      query: response
    })
  );
};

const initOidcPost = async (req: any, res: any): Promise<void> => {
  // OIDC POST initiation

  const nonce = generateUniqueString(25, false);
  const state = generateUniqueString(30, false);
  const response: any = rlProcessOIDCRequest(req, state, nonce);
  logger.debug(
    `request for POST OIDC_LOGIN_INIT_ROUTE:${OIDC_LOGIN_INIT_ROUTE} : ${inspect(
      req.body
    )}`
  );

  const platformDetails = await getToolConsumerFromList({
    name: "",
    client_id: response.client_id,
    iss: response.iss,
    deployment_id: ""
  });
  logger.debug(
    "initOidcPost - platformDetails-" + JSON.stringify(platformDetails)
  );

  if (platformDetails == undefined) {
    return;
  }
  logger.debug("initOidcPost - req.session-" + JSON.stringify(req.session));
  if (req.session) {
    req.session.nonce = nonce;
    req.session.state = state;

    await req.session.save(() => {
      logger.debug("session data saved");
    });
  } else {
    throw new Error("no session detected, something is wrong");
  }
  logger.debug(
    `Redirection from OIDC_LOGIN_INIT_ROUTE: ${OIDC_LOGIN_INIT_ROUTE} to :${
      platformDetails.platformOIDCAuthEndPoint
    } with platform details: ${JSON.stringify(platformDetails)}`
  );

  res.redirect(
    url.format({
      pathname: platformDetails.platformOIDCAuthEndPoint,
      query: response
    })
  );
};
const ltiLaunchPost = async (request: any, response: any): Promise<void> => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }
  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }

  request.session.platform = processedRequest.rlPlatform;

  await request.session.save(() => {
    logger.debug("session data saved");
  });
  if (processedRequest.rlPlatform.isStudent)
    response.redirect(LTI_STUDENT_REDIRECT);
  else response.redirect(LTI_INSTRUCTOR_REDIRECT);

  await request.session.save(() => {
    logger.debug("session data saved");
  });
};

const assignmentRedirectPost = async (
  request: any,
  response: any
): Promise<void> => {
  /* if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }*/
  const reqQueryString = request.query;
  const reqBody = request.body;
  logger.debug(
    "LTI_ASSIGNMENT_REDIRECT -  req.query" + JSON.stringify(reqQueryString)
  );

  logger.debug("LTI_ASSIGNMENT_REDIRECT -  req.body" + JSON.stringify(reqBody));

  logger.debug(
    "LTI_ASSIGNMENT_REDIRECT -  req.session" + JSON.stringify(request.session)
  );

  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }
  processedRequest.session.platform = processedRequest.rlPlatform;
  await request.session.save(() => {
    logger.debug("req.session- " + JSON.stringify(request.session));
  });
  response.redirect(
    LTI_ASSIGNMENT_REDIRECT + "?resourceId=" + reqQueryString.resourceId
  );
};

const deepLinkRedirect = async (request: any, response: any): Promise<void> => {
  if (!request.session) {
    throw new Error("no session detected, something is wrong");
  }
  logger.debug("req.session-LTI_DEEPLINK_REDIRECT");
  const processedRequest = await processRequest(request);
  if (!processedRequest) {
    throw new Error("Unable to process request");
  }

  request.session.platform = processedRequest.rlPlatform;
  logger.debug(
    "req.session.platform - " + JSON.stringify(processedRequest.rlPlatform)
  );
  await request.session.save(() => {
    logger.debug("session data saved");
  });
  response.redirect(LTI_DEEPLINK_REDIRECT);
};

const toolInfoGet = async (
  req: any,
  res: any,
  applicationURL: any
): Promise<void> => {
  const integrationInfo = {
    "OpenID Connect Initiation Url": `${path.join(
      applicationURL,
      OIDC_LOGIN_INIT_ROUTE
    )} `,
    "Target Link URI": `${path.join(
      applicationURL,
      LTI_ADVANTAGE_LAUNCH_ROUTE
    )} `,
    "Redirect URIS:": [
      `${path.join(applicationURL, LTI_INSTRUCTOR_REDIRECT)} `,
      `${path.join(applicationURL, LTI_STUDENT_REDIRECT)} `
    ]
  };

  const toolConsumers = await getToolConsumers();
  const sanitizedToolConsumers = toolConsumers.map(
    ({ name, public_key_jwk, client_id }) => {
      return {
        name,
        public_key_jwk: JSON.parse(public_key_jwk), // a string that needs to be parsed
        client_id
      };
    }
  );

  const data = JSON.stringify(
    {
      integrationInfo,
      toolConsumers: sanitizedToolConsumers
    },
    null,
    2
  );

  res.send(`< pre > ${data} </pre>`);
};

export {
  initOidcGet,
  initOidcPost,
  toolInfoGet,
  assignmentRedirectPost,
  ltiLaunchPost,
  deepLinkRedirect
};
