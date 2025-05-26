import { ToolHandler } from "../types/index.js";

export class ListAvailableFilesTool implements ToolHandler {
  name = "list_available_files";

  describe() {
    return {
      name: this.name,
      description: "Returns a list of available file names",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      }
    };
  }

async onCall() {
  try {
    const availableFiles = [{ name: "CSharp_Style_Guide.txt" }];
    const fileListString = availableFiles.map(f => `- ${f.name}`).join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Dostępne pliki:\n${fileListString}`
        }
      ]
    };
  } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error in ListAvailableFilesTool: ${error.message}`);
      } else {
        throw new Error(`Error in ListAvailableFilesTool: Unknown error`);
      }
    }
}
}
