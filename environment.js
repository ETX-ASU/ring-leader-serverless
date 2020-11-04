"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INTERFACE_ROOT = exports.APPLICATION_URL = exports.PORT = void 0;
const path_1 = __importDefault(require("path"));
console.log(`config: ${JSON.stringify(process.env)}`);
const environment = process.env.environment;
console.log(`environment loaded: ${environment}`);
process.env.toolConsumers = JSON.stringify(require(`./environments/${environment}/.tool_consumers.${environment}.json`));
process.env.USER_INTERFACE_ROOT = path_1.default.join(__dirname +'/browser-client/build/');