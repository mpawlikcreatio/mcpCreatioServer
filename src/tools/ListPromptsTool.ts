import { ToolHandler } from "../types/index.js";
import fs from "fs/promises";
import path from "path";

export class ListPromptsTool implements ToolHandler {
  name = "list_prompts";

  describe() {
    return {
      name: this.name,
      description: "Lists all available prompt files in the PROMPT_DIR",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    };
  }

  async onCall() {
    const promptDir =
      process.env.PROMPT_DIR || path.resolve(process.cwd(), "prompts");

    try {
      const files = await fs.readdir(promptDir);
      const promptFiles = files.filter(
        (file) => file.endsWith(".txt") || file.endsWith(".md")
      );

      if (promptFiles.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No prompt files found.",
            },
          ],
        };
      }

      const fileList = promptFiles.map((file) => `- ${file}`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Available prompt files:\n${fileList}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error reading prompts: ${error.message}`);
      } else {
        throw new Error("Unknown error while listing prompts");
      }
    }
  }
}
