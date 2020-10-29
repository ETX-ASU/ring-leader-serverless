import { getConnection, createConnectionFromConfig } from "./db";
import ToolConsumer from "./entities/ToolConsumer";
import { createToolConsumer } from "../services/ToolConsumerService";
import { logger } from "../../rl-shared/util/LogService";

const ensureToolConsumer = async (toolConsumer: ToolConsumer): Promise<any> => {
  const connection = await getConnection();
  const toolConsumerRepository = connection.getRepository(ToolConsumer);
  const matchingConsumer = await toolConsumerRepository.findOne({
    name: toolConsumer.name
  });
  if (matchingConsumer === undefined) {
    await toolConsumerRepository.save(toolConsumer);
  }
};

// because this is an in-memory database we don't have to clear the table
// assume it is empty and simply iterate through each tool consumer and add it
const initToolConsumers = async (toolConsumers: ToolConsumer[]): Promise<any> => {
  logger.debug("sticking these tool consumers in the DB:", toolConsumers);

  toolConsumers.forEach(async (toolConsumerData: ToolConsumer) => {
    toolConsumerData.public_key_jwk = JSON.stringify(toolConsumerData.public_key_jwk) || "";
    await createToolConsumer(toolConsumerData);
  });
};

const dbInit = async (toolConsumers: ToolConsumer[], options: any): Promise<any> => {
  // Init DB
  /*logger.debug("Initializing the DB");
  const connection = await getConnection();
  await connection.synchronize(); // this creates the tables based on our entity definitions
  await createConnectionFromConfig(options);
  //initToolConsumers(toolConsumers);*/
}

export { dbInit };
