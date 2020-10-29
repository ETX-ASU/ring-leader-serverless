import { getConnection } from "../database/db";
import ToolConsumer from "../database/entities/ToolConsumer";
import ToolConsumerRequest from "../database/entities/ToolConsumerRequest";
import { logger } from "../../rl-shared/util/LogService";

import { TOOL_CONSUMERS } from "./../../environment";
import * as ts from "typescript";

const createToolConsumer = async (
  consumer: ToolConsumer
): Promise<ToolConsumer> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  return toolConsumerRepository.save(consumer);
};

const getDeploymentConsumer = async (
  request: ToolConsumerRequest
): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const consumerDeployment = await toolConsumerRepository.findOne({
    where: {
      iss: request.iss,
      client_id: request.client_id,
      deployment_id: request.deployment_id
    }
  });
  if (consumerDeployment == undefined) {
    const toolConsumer: ToolConsumer | undefined = await getToolConsumer(
      request
    );
    if (toolConsumer != undefined) {
      toolConsumer.id = 0;
      toolConsumer.deployment_id = request.deployment_id;
      toolConsumer.name = `toolConsumer.name - ${request.deployment_id}`;
      return createToolConsumer(toolConsumer);
    }
  }
  return consumerDeployment;
};

const getToolConsumer = async (
  request: ToolConsumerRequest
): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  logger.debug(
    `toolConsumerRepository -request : ${JSON.stringify(request)} )}`
  );
  let toolConsumer:
    | ToolConsumer
    | undefined = await toolConsumerRepository.findOne({
      where: {
        iss: request.iss,
        client_id: request.client_id,
        deployment_id: request.deployment_id
      }
    });

  if (!toolConsumer) {
    toolConsumer = await toolConsumerRepository.findOne({
      where: {
        iss: request.iss,
        client_id: request.client_id
      }
    });
  }

  if (!toolConsumer) {
    toolConsumer = await toolConsumerRepository.findOne({
      where: {
        iss: request.iss,
      }
    });
  }

  logger.debug(
    `toolConsumerRepository -toolConsumer : ${JSON.stringify(toolConsumer)} )}`
  );
  logger.debug(
    `found tool consumer: ${request.name} : ${request.iss} : ${request.client_id} : ${request.client_id})}`
  );
  return toolConsumer;
};

const getToolConsumerByName = async (
  name: String
): Promise<ToolConsumer | undefined> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const toolConsumer = await toolConsumerRepository.findOne({
    where: {
      name: name
    }
  });
  return toolConsumer;
};

const getToolConsumerByNameFromList = (name:String) => {
  let found: ToolConsumer = undefined;
  TOOL_CONSUMERS.forEach(async (tc: ToolConsumer) => {
    if(tc.name === name) {
      found = tc;
    }
  });
  return found;
}

const getToolConsumerFromList = (
  request: ToolConsumerRequest
): ToolConsumer | undefined => {
  logger.debug(
    `toolConsumerRepository -request : ${JSON.stringify(request)} )}`
  );
  let toolConsumer = undefined;

    TOOL_CONSUMERS.forEach(async (tc: ToolConsumer) => {
      if(tc.iss === request.iss && tc.client_id == request.client_id && tc.deployment_id == request.deployment_id) {
        toolConsumer = tc;
      }
    });

  if (!toolConsumer) {
    TOOL_CONSUMERS.forEach(async (tc: ToolConsumer) => {
      if(tc.iss === request.iss && tc.client_id == request.client_id) {
        toolConsumer = tc;
      }
    });
  }

  if (!toolConsumer) {
    TOOL_CONSUMERS.forEach(async (tc: ToolConsumer) => {
      if(tc.iss === request.iss) {
        toolConsumer = tc;
      }
    });
  }

  logger.debug(
    `toolConsumerRepository -toolConsumer : ${JSON.stringify(toolConsumer)} )}`
  );
  logger.debug(
    `found tool consumer: ${request.name} : ${request.iss} : ${request.client_id} : ${request.client_id})}`
  );
  return toolConsumer;
};

export {
  createToolConsumer,
  getDeploymentConsumer,
  getToolConsumer,
  getToolConsumerByName,
  getToolConsumerByNameFromList,
  getToolConsumerFromList
};
