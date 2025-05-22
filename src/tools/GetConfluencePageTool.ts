import axios from "axios";
import { ToolHandler } from "../types/index.js";

const CONFLUENCE_DOMAIN = "https://creatio.atlassian.net/wiki";

export class GetConfluencePageTool implements ToolHandler {
  name = "get_page";
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: CONFLUENCE_DOMAIN,
      timeout: 20000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  describe() {
    return {
      name: this.name,
      description: "Fetches a Confluence page by ID",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The Confluence page ID",
          },
          cookie: {
            type: "string",
            description: "Authentication cookie for accessing Confluence",
          },
        },
        required: ["id", "cookie"],
      },
    };
  }

  async onCall(args: { id: string; cookie: string }) {
    const { id, cookie } = args;

    const response = await this.axiosInstance.get(
      `/rest/api/content/${id}?expand=body.view`,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    const title = response.data.title;
    const content =
      response.data.body?.view?.value || "<i>No content found</i>";

    return {
      content: [
        {
          type: "text",
          text: `# ${title}\n\n${content}`,
        },
      ],
    };
  }
}
