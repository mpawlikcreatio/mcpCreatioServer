import { ToolHandler } from "../types/index.js";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export class ReadLocalFileTool implements ToolHandler {
  name = "read_local_file";

  describe() {
    return {
      name: this.name,
      description: "Reads the content of a local text file",
      inputSchema: {
        type: "object",
        properties: {
          fileName: {
            type: "string",
            description: "Name of the local file (relative to the working directory)",
          },
        },
        required: ["fileName"],
      },
    };
  }

  async onCall(args: { fileName: string }) {
    const { fileName } = args;

    const basePath = process.env.LOCAL_FILE_PATH || process.cwd();
    const resolvedPath = path.resolve(basePath, fileName);

    try {
      const content = await fs.readFile(resolvedPath, "utf-8");

      return {
        content: [
          {
            type: process.env.LOCAL_FILE_TYPE || "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to read file '${fileName}': ${error.message}`);
      } else {
        throw new Error(`Unable to read file '${fileName}': Unknown error`);
      }
    }
  }
}
