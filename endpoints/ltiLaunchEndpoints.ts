import { Express } from "express";


import rlLtiLaunchExpressEndpoints from "../rl-server-lib/endpoints/rlLtiLaunchExpressEndpoints";


const ltiLaunchEndpoints = (app: Express): void => {
  rlLtiLaunchExpressEndpoints(app);
};

export default ltiLaunchEndpoints;
