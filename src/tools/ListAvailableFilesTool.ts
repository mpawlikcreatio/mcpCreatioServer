import { z } from "zod";
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
      },
    };
  }

  async onCall() {
    const availableFiles = [
      "CSharp_Style_Guide.txt",
    ];

    return { files: availableFiles };
  }
}
