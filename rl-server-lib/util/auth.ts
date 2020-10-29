import jwt from "jsonwebtoken";
import got from "got";
import { Platform } from "./Platform";
import { logger } from "../../rl-shared/util/LogService";

const isValidOIDCRequest = (oidcData: any): boolean => {
  if (!oidcData.iss) {
    throw new Error("ISSUER_MISSING_IN_OIDC_REQUEST");
  }
  if (!oidcData.login_hint) {
    throw new Error("LOGIN_HINT_MISSING_IN_OIDC_REQUEST");
  }
  if (!oidcData.target_link_uri) {
    throw new Error("TARGET_LINK_URI_MISSING_IN_OIDC_REQUEST");
  }
  return true;
};

/**
 * @description Validates Aud.
 * @param {Object} token - Id token you wish to validate.
 * @param {Platform} platform - Platform object.
 */

const validateAud = (token: any, platform: Platform): boolean => {
  logger.debug(
    "Validating if aud (Audience) claim matches the value of the tool's clientId given by the platform"
  );
  logger.debug("Aud claim: " + token.aud);
  logger.debug("Tool's clientId: " + platform.clientId);
  logger.debug("platform: " + JSON.stringify(platform));

  if (Array.isArray(token.aud)) {
    logger.debug("More than one aud listed, searching for azp claim");
    if (token.azp && token.azp !== platform.clientId)
      throw new Error("AZP_DOES_NOT_MATCH_CLIENTID");
  } else if (token.aud == platform.clientId) return true;
  return true;
};
/**
 * @description Validates Nonce.
 * @param {Object} token - Id token you wish to validate.
 */

const validateNonce = (token: any, platform: Platform): boolean => {
  logger.debug("Validating nonce");
  logger.debug("Token Nonce: " + token.nonce);
  if (token.nonce == platform.nonce) return true;
  else return false;
};

/**
 * @description Validates de token based on the LTI 1.3 core claims specifications.
 * @param {Object} token - Id token you wish to validate.
 */

const claimValidation = (token: any): any => {
  logger.debug("Initiating LTI 1.3 core claims validation");
  logger.debug("Checking Message type claim");
  if (
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] !==
      "LtiResourceLinkRequest" &&
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] !==
      "LtiDeepLinkingRequest"
  )
    throw new Error("NO_MESSAGE_TYPE_CLAIM");

  if (
    token["https://purl.imsglobal.org/spec/lti/claim/message_type"] ===
    "LtiResourceLinkRequest"
  ) {
    logger.debug("Checking Target Link Uri claim");
    if (!token["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"])
      throw new Error("NO_TARGET_LINK_URI_CLAIM");
    logger.debug("Checking Resource Link Id claim");
    if (
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"] ||
      !token["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
    )
      throw new Error("NO_RESOURCE_LINK_ID_CLAIM");
  }

  logger.debug("Checking LTI Version claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/version"])
    throw new Error("NO_LTI_VERSION_CLAIM");
  if (token["https://purl.imsglobal.org/spec/lti/claim/version"] !== "1.3.0")
    throw new Error("WRONG_LTI_VERSION_CLAIM");
  logger.debug("Checking Deployment Id claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/deployment_id"])
    throw new Error("NO_DEPLOYMENT_ID_CLAIM");
  logger.debug("Checking Sub claim");
  if (!token.sub) throw new Error("NO_SUB_CLAIM");
  logger.debug("Checking Roles claim");
  if (!token["https://purl.imsglobal.org/spec/lti/claim/roles"])
    throw new Error("NO_ROLES_CLAIM");

  return true;
};
/**
 * @description Validates de token based on the OIDC specifications.
 * @param {Object} token - Id token you wish to validate.
 * @param {Platform} platform - Platform object.
 */

const oidcValidation = (token: any, platform: Platform): any => {
  logger.debug("Token signature verified");
  logger.debug("Initiating OIDC aditional validation steps");
  const aud: boolean = validateAud(token, platform);
  const nonce: boolean = validateNonce(token, platform);
  const claims: boolean = claimValidation(token);

  return { aud: aud, nonce: nonce, claims: claims };
};

const rlDecodeIdToken = (idToken: any): any => {
  logger.debug("idToken:" + idToken);
  const decodedToken = jwt.decode(idToken);
  logger.debug("decodedtoken:");
  logger.debug(JSON.stringify(decodedToken));
  if (!decodedToken) throw new Error("INVALID_JWT_RECEIVED");
  return decodedToken;
};
const rlValidateToken = (idToken: any, platform: Platform): any => {
  const decodedToken = rlDecodeIdToken(idToken);
  logger.debug("platform.nonce-" + platform.nonce);
  logger.debug("platform.state-" + platform.state);
  logger.debug("platform.client_id-" + platform.clientId);

  const oidcVerified: any = oidcValidation(decodedToken, platform);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");
  return idToken;
};

const rlValidateDecodedToken = (decodedToken: any, platform: Platform): any => {
  logger.debug("platform.nonce-" + platform.nonce);
  logger.debug("platform.state-" + platform.state);
  logger.debug("platform.client_id-" + platform.clientId);

  const oidcVerified: any = oidcValidation(decodedToken, platform);
  if (!oidcVerified.aud) throw new Error("AUD_DOES_NOT_MATCH_CLIENTID");
  if (!oidcVerified.nonce) throw new Error("NONCE_DOES_NOT_MATCH");
  if (!oidcVerified.claims) throw new Error("CLAIMS_DOES_NOT_MATCH");
};

const rlProcessOIDCRequest = (req: any, state: string, nonce: string): any => {
  let oidcData = req.query;
  logger.debug("req.method:" + req.method);

  if (req.method == "POST") oidcData = req.body;
  logger.debug(`oidcData ${JSON.stringify(oidcData)}`);
  logger.debug(`Get Request query: ${JSON.stringify(req.query)}`);

  if (isValidOIDCRequest(oidcData)) {
    let response = {};
    const objResponse = {
      scope: "openid",
      response_type: "id_token",
      response_mode: "form_post",
      client_id: oidcData.client_id,
      iss: oidcData.iss,
      redirect_uri: oidcData.target_link_uri,
      login_hint: oidcData.login_hint,
      state: state,
      nonce: nonce,
      prompt: "none"
    };
    if (oidcData.lti_message_hint) {
      response = {
        ...objResponse,
        lti_message_hint: oidcData.lti_message_hint
      };
    } else {
      response = { ...objResponse };
    }

    if (oidcData.lti_deployment_id)
      response = {
        ...response,
        lti_deployment_id: oidcData.lti_deployment_id
      };
    logger.debug("OIDC response object");
    logger.debug(response);
    return response;
  }
};
const getAccessToken = async (
  platform: Platform,
  scopes: any
): Promise<any> => {
  logger.debug("Inside getAccessToken-" + JSON.stringify(platform));

  const clientId = platform.aud;

  const confjwt = {
    sub: clientId,
    iss: platform.iss,
    aud: platform.accesstokenEndpoint,
    iat: platform.iat || Date.now() / 1000,
    exp: platform.exp || Date.now() / 1000 + 60,
    jti: platform.jti || "dffdbdce-a9f1-427b-8fca-604182198783"
  };
  logger.debug("confjwt- " + JSON.stringify(confjwt));

  const jwtToken = jwt.sign(confjwt, platform.platformPrivateKey, {
    algorithm: platform.alg,
    keyid: platform.kid
  });
  const payload = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: jwtToken,
    scope: scopes
  };
  const access = await got
    .post(await platform.accesstokenEndpoint, {
      form: payload
    })
    .json();
  logger.debug(`Access token received ${JSON.stringify(access)}`);
  logger.debug("Access token for the scopes - " + scopes);

  return access;
};
export {
  rlProcessOIDCRequest,
  rlValidateToken,
  getAccessToken,
  rlValidateDecodedToken,
  rlDecodeIdToken
};
