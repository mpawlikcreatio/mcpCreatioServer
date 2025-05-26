import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

type Config = {
  LOCAL_FILE_PATH: string;
  LOCAL_FILE_TYPE: string;
};

function loadConfig(): Config {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.join(__dirname, ".env") });

  const LOCAL_FILE_PATH = process.env.LOCAL_FILE_PATH;
  const LOCAL_FILE_TYPE = process.env.LOCAL_FILE_TYPE;

  if (!LOCAL_FILE_PATH) {
    throw new Error("LOCAL_FILE_PATH environment variable is not set.");
  }

  if (!LOCAL_FILE_TYPE) {
    throw new Error("LOCAL_FILE_TYPE environment variable is not set.");
  }

  return { LOCAL_FILE_PATH, LOCAL_FILE_TYPE };
}

export { loadConfig, Config };