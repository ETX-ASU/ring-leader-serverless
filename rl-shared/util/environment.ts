// heroku
const ENV_VARS = process.env;

export const PORT: number = parseInt(ENV_VARS.PORT ? ENV_VARS.PORT : "8080");

// this is set by the yarn run heroku-update-configs script
export const APPLICATION_URL: string = ENV_VARS.APPLICATION_URL || "";

const URL_PREFIX: string =
ENV_VARS.URL_PREFIX || "";

const URL_REDIRECT_PREFIX: string =
ENV_VARS.URL_REDIRECT_PREFIX || "/dev";

// ENDPOINTS
export const DEEP_LINK_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.DEEP_LINK_ASSIGNMENT_ENDPOINT || `${URL_PREFIX}/lti-service/deeplink`;
export const DEEP_LINK_RESOURCELINKS_ENDPOINT: string =
  ENV_VARS.DEEP_LINK_RESOURCELINKS_ENDPOINT ||
  `${URL_PREFIX}/lti-service/getDeepLinkAssignments`;
export const ROSTER_ENDPOINT: string =
  ENV_VARS.ROSTER_ENDPOINT || `${URL_PREFIX}/lti-service/roster`;
export const CREATE_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.CREATE_ASSIGNMENT_ENDPOINT || `${URL_PREFIX}/lti-service/createassignment`;
export const GET_ASSIGNMENT_ENDPOINT: string =
  ENV_VARS.GET_ASSIGNMENT_ENDPOINT || `${URL_PREFIX}/lti-service/getassignment`;
export const GET_UNASSIGNED_STUDENTS_ENDPOINT: string =
  ENV_VARS.GET_UNASSIGNED_STUDENTS_ENDPOINT ||
  `${URL_PREFIX}/lti-service/unassignedstudents`;
export const GET_ASSIGNED_STUDENTS_ENDPOINT: string =
  ENV_VARS.GET_ASSIGNED_STUDENTS_ENDPOINT ||
  `${URL_PREFIX}/lti-service/assignedstudents`;
export const PUT_STUDENT_GRADE_VIEW: string =
  ENV_VARS.PUT_STUDENT_GRADE_VIEW || `${URL_PREFIX}/lti-service/putGradeStudentView`;
export const PUT_STUDENT_GRADE: string =
  ENV_VARS.PUT_STUDENT_GRADE || `${URL_PREFIX}/lti-service/putGrade`;
export const DELETE_LINE_ITEM: string =
  ENV_VARS.DELETE_LINE_ITEM || `${URL_PREFIX}/lti-service/deleteLineItem`;
export const GET_GRADES: string = ENV_VARS.GET_GRADES || `${URL_PREFIX}/lti-service/grades`;

export const OIDC_LOGIN_INIT_ROUTE =
  ENV_VARS.OIDC_LOGIN_INIT_ROUTE ||  `${URL_PREFIX}/init-oidc`;
export const LTI_ADVANTAGE_LAUNCH_ROUTE =
  ENV_VARS.LTI_ADVANTAGE_LAUNCH_ROUTE ||  `${URL_PREFIX}/lti-advantage-launch`;
export const LTI_ASSIGNMENT_REDIRECT =
  ENV_VARS.LTI_ASSIGNMENT_REDIRECT ||  `${URL_REDIRECT_PREFIX}/assignment`;
export const LTI_DEEPLINK_REDIRECT =
  ENV_VARS.LTI_DEEPLINK_REDIRECT ||  `${URL_REDIRECT_PREFIX}/deeplink`;
export const TOOL_INFO = ENV_VARS.TOOL_INFO ||  `${URL_PREFIX}/tool-info`;
export const GET_JWKS_ENDPOINT = ENV_VARS.GET_JWKS_ENDPOINT ||  `${URL_PREFIX}/jwks`;

export const LTI_STUDENT_REDIRECT = ENV_VARS.STUDENT_REDIRECT ||  `${URL_REDIRECT_PREFIX}/student`;
export const LTI_STUDENT = ENV_VARS.LTI_STUDENT ||  `${URL_PREFIX}/student`;
//`${URL_REDIRECT_PREFIX}/instructor`
export const LTI_INSTRUCTOR_REDIRECT =
  ENV_VARS.INSTRUCTOR_REDIRECT ||  "https://www.google.com";

export const LTI_INSTRUCTOR =
  ENV_VARS.LTI_INSTRUCTOR ||  `${URL_PREFIX}/instructor`;

export const LOGGING_LEVEL = ENV_VARS.LOGGING_LEVEL || "debug";

