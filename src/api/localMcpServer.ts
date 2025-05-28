import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolHandler } from "../types/index.js";
import { ReadLocalFileTool } from "../tools/ReadLocalFileTool.js";
import { ListAvailableFilesTool } from "../tools/ListAvailableFilesTool.js";
import { ListPromptsTool } from "../tools/ListPromptsTool.js";

export class LocalMcpServer {
  private server: Server;
  private tools: Map<string, ToolHandler>;

  constructor() {
    console.error("[Setup] Initializing Local MCP server...");

    this.server = new Server(
      {
        name: "local-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tools = new Map();
    this.registerTool(new ReadLocalFileTool());
    this.registerTool(new ListAvailableFilesTool());
    this.registerTool(new ListPromptsTool());

    this.setupHandlers();

    this.server.onerror = (error) => console.error("[Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private registerTool(tool: ToolHandler) {
    this.tools.set(tool.name, tool);
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Array.from(this.tools.values()).map((tool) => tool.describe()),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool '${request.params.name}' not found.`
        );
      }

      try {
        return await tool.onCall(request.params.arguments);
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool '${tool.name}' failed: ${error?.message || "Unknown error"}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("✅ Local MCP server running on stdio");
  }
}
