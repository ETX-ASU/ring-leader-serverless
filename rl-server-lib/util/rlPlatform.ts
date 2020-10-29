import jwt from "jsonwebtoken";
import { Platform } from "./Platform";
import { logger } from "../../rl-shared/util/LogService";

const DEEP_LINKING_SETTINGS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings";
const ROLES_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/roles";
const INSTRUCTOR_ROLE_CLAIM = "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor";
const LEARNER_ROLE_CLAIM = "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner";
const DEPLOYMENT_ID_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/deployment_id";
const CONTEXT_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/context";
const ASSIGNMENT_GRADE_CLAIM = "https://purl.imsglobal.org/spec/lti-ags/claim/endpoint";
const RESOURCE_LINK_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/resource_link";

const setDefaultValues = (token: any): any => {
  logger.debug("setDefaultValues - " + JSON.stringify(token));
  logger.debug(
    DEEP_LINKING_SETTINGS_CLAIM + token[DEEP_LINKING_SETTINGS_CLAIM]
  );
  let isStudent = false;
  let isInstructor = false;
  if (token[ROLES_CLAIM]) {
    if (token[ROLES_CLAIM].includes(LEARNER_ROLE_CLAIM)) {
      isStudent = true;
    } else if (token[ROLES_CLAIM].includes(INSTRUCTOR_ROLE_CLAIM)) {
      isInstructor = true;
    }
  }

  const assignmentGradeClaim = token[ASSIGNMENT_GRADE_CLAIM];
  const resourceLinkClaim = token[RESOURCE_LINK_CLAIM];
  const deepLinkSettingsClaim = token[DEEP_LINKING_SETTINGS_CLAIM];

  const tokenData = {
    jti: encodeURIComponent(
      [...Array(25)]
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map((_) => ((Math.random() * 36) | 0).toString(36))
        .join("-")
    ),
    iss: token.iss,
    aud: token.aud,
    iat: token.iat,
    sub: token.sub,
    exp: token.exp,
    nonce: token.nonce,
    clientId: token.aud,
    userId: token.sub,
    deploymentId: token[DEPLOYMENT_ID_CLAIM] || null,
    roles: [
      {
        role: "Learner",
        claim: LEARNER_ROLE_CLAIM
      },
      {
        role: "Instructor",
        claim: INSTRUCTOR_ROLE_CLAIM
      }
    ],
    isStudent: isStudent,
    isInstructor: isInstructor,
    context: token[CONTEXT_CLAIM],
    lineitems: assignmentGradeClaim ? assignmentGradeClaim.lineitems : null,
    lineitem: assignmentGradeClaim ? assignmentGradeClaim.lineitem : null,
    resourceLinkId: resourceLinkClaim ? resourceLinkClaim.id : null,
    resource: resourceLinkClaim,
    deepLinkingSettings: deepLinkSettingsClaim
      ? {
        deep_link_return_url: deepLinkSettingsClaim.deep_link_return_url || null,
        data: token.data || null,
        accept_types: deepLinkSettingsClaim.accept_types
      }
      : null
  };
  logger.debug("setDefaultValues - tokenData - " + JSON.stringify(tokenData));
  return tokenData;
};
const rlPlatform = (
  platformPrivateKey: string,
  authenticationEndpoint: string,
  accesstokenEndpoint: string,
  kid: string,
  alg: string,
  idToken: string
): Platform => {
  const token = jwt.decode(idToken);
  logger.debug(
    `rlPlatform - received - idTokenDecoded: ${JSON.stringify(token)}`
  );
  const tokenData = setDefaultValues(token);
  const platform: Platform = {
    jti: tokenData.jti,
    iss: tokenData.iss,
    aud: tokenData.aud,
    iat: tokenData.iat,
    sub: tokenData.sub,
    exp: tokenData.exp,
    state: tokenData.exp || null,
    nonce: tokenData.nonce,
    context_id: tokenData.context.id,
    clientId: tokenData.clientId,
    lineitems: tokenData.lineitems,
    lineitem: tokenData.lineitem,
    resourceLinkId: tokenData.resourceLinkId,
    resource: tokenData.resource,
    accesstokenEndpoint: accesstokenEndpoint,
    authOIDCRedirectEndpoint: authenticationEndpoint,
    kid: kid,
    platformPrivateKey: platformPrivateKey,
    idToken: idToken,
    alg: alg,
    deepLinkingSettings: tokenData.deepLinkingSettings,
    userId: tokenData.userId,
    roles: tokenData.roles,
    isInstructor: tokenData.isInstructor,
    isStudent: tokenData.isStudent,
    deploymentId: tokenData.deploymentId
  };
  logger.debug("rlPlatformplatform - " + JSON.stringify(platform));

  return platform;
};
export { rlPlatform };
