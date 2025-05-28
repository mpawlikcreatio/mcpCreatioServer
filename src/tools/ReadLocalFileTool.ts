import { ToolHandler } from "../types/index.js";
import fs from "fs/promises";
import path from "path";

const LOCAL_SUPPORTED_TYPES: Record<string, string> = {
  txt: "text",
  text: "text",
};

export class ReadLocalFileTool implements ToolHandler {
  name = "read_local_file";

  describe() {
    return {
      name: this.name,
      description: "Reads the content of a local file (text or image)",
      inputSchema: {
        type: "object",
        properties: {
          fileName: {
            type: "string",
            description:
              "Name of the local file (relative to the working directory)",
          },
        },
        required: ["fileName"],
      },
    };
  }

  async onCall(args: { fileName: string }) {
    const { fileName } = args;

    const isPrompt = fileName.startsWith("prompt_");
    const basePath = isPrompt
      ? process.env.PROMPT_DIR || path.resolve(process.cwd(), "prompts")
      : process.env.GUIDE_FILES_DIR || process.cwd();

    const resolvedPath = path.resolve(basePath, fileName);
    const ext = path.extname(fileName).slice(1).toLowerCase();
    const fileType = LOCAL_SUPPORTED_TYPES[ext];

    if (!fileType) {
      throw new Error(
        `Unsupported file type '${ext}'. Supported types: ${Object.keys(
          LOCAL_SUPPORTED_TYPES
        ).join(", ")}`
      );
    }

    try {
      if (fileType === "text") {
        return await this.readTextFile(resolvedPath);
      } else {
        throw new Error(
          `File type '${fileType}' is recognized but not supported for reading.`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to read file '${fileName}': ${error.message}`);
      } else {
        throw new Error(`Unable to read file '${fileName}': Unknown error`);
      }
    }
  }

  private async readTextFile(filePath: string) {
    const content = await fs.readFile(filePath, "utf-8");
    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }
}
