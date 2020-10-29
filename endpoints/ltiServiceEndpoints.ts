import { Express } from "express";


import rlLtiServiceExpressEndpoints from "../rl-server-lib/endpoints/rlLtiServiceExpressEndpoints";


const ltiServiceEndpoints = (app: Express): void => {
  rlLtiServiceExpressEndpoints(app);
};

export default ltiServiceEndpoints;
