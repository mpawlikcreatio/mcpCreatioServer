import { ToolHandler } from "../types/index.js";
import fs from "fs/promises";
import path from "path";

export class GetPromptTool implements ToolHandler {
  name = "get_prompt";

  describe() {
    return {
      name: this.name,
      description: "Returns a stored prompt by name",
      inputSchema: {
        type: "object",
        properties: {
          promptName: {
            type: "string",
            description: "Name of the prompt file (without extension)"
          }
        },
        required: ["promptName"]
      }
    };
  }

  async onCall(args: { promptName: string }) {
    const { promptName } = args;

    const baseDir = process.env.PROMPT_DIR || path.resolve(process.cwd(), "prompts");
    const filePath = path.resolve(baseDir, `${promptName}.txt`);

    try {
      const promptContent = await fs.readFile(filePath, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: promptContent
          }
        ]
      };
    } catch (err) {
      throw new Error(`Prompt '${promptName}' not found or could not be read.`);
    }
  }
}
