"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rl_server_lib_1 = require("@asu-etx/rl-server-lib");
const ltiLaunchEndpoints = (app) => {
    rl_server_lib_1.rlLtiLaunchExpressEndpoints(app);
};
exports.default = ltiLaunchEndpoints;
