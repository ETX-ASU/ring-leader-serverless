//import ToolConsumer from "./entities/ToolConsumer";
//import Assignment from "./entities/Assignment";
import { logger } from "../../rl-shared/util/LogService";
import {
  //createConnection,
  getConnection as getTypeOrmConnection,
  Connection
} from "typeorm";

let connectionCreationPromise: any = false;

const getConnection = async (): Promise<Connection> => {
  if (connectionCreationPromise === false) {
    logger.debug("creating connection")
    /*connectionCreationPromise = createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      entities: [ToolConsumer, Assignment],
      logging: true
    });*/
  }

  return connectionCreationPromise.then(() => {
    return getTypeOrmConnection();
  });
}
const createConnectionFromConfig = async (options: any): Promise<Connection> => {
  if (options == null || options == undefined) {
    return getConnection();
  }
  return getConnection();
}

export { getConnection, createConnectionFromConfig };