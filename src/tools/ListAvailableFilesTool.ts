import { ToolHandler } from "../types/index.js";
import fs from "fs/promises";

export class ListAvailableFilesTool implements ToolHandler {
  name = "list_available_files";

  describe() {
    return {
      name: this.name,
      description:
        "Returns a list of available file names starting with 'guide'",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    };
  }

  async onCall() {
    try {
      const basePath = process.env.GUIDE_FILES_DIR || process.cwd();
      const files = await fs.readdir(basePath);

      const availableFiles = files
        .filter((f) => f.toLowerCase().startsWith("guide"))
        .map((name) => ({ name }));

      if (availableFiles.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No files starting with 'guide' found.",
            },
          ],
        };
      }

      const fileListString = availableFiles
        .map((f) => `- ${f.name}`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Available files starting with 'guide':\n${fileListString}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error in ListAvailableFilesTool: ${error.message}`);
      } else {
        throw new Error("Error in ListAvailableFilesTool: Unknown error");
      }
    }
  }
}
