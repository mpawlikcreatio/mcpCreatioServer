import dotenv from "dotenv";
import { LocalMcpServer } from "./api/localMcpServer.js";

dotenv.config();

const server = new LocalMcpServer();
server.run().catch(console.error);
