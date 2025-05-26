import { loadConfig } from "./config.js";
import { LocalMcpServer } from "./api/localMcpServer.js";


 loadConfig();

const server = new LocalMcpServer();
server.run().catch(console.error);
