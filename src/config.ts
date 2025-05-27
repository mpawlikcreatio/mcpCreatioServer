import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

type Config = {
  GUIDE_FILES_DIR: string;
  PROMPT_DIR:string
};

function loadConfig(): Config {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.join(__dirname, ".env") });

  const GUIDE_FILES_DIR = process.env.GUIDE_FILES_DIR;

  const PROMPT_DIR = process.env.PROMPT_DIR;

  if (!GUIDE_FILES_DIR) {
    throw new Error("GUIDE_FILES_DIR environment variable is not set.");
  }
    if (!PROMPT_DIR) {
    throw new Error("PROMPT_DIR environment variable is not set.");
  }

  return { GUIDE_FILES_DIR, PROMPT_DIR };
}

export { loadConfig, Config };