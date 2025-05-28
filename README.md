# Project Description

This project is a Node.js application called **MCP Server**. It serves as a local middleware for seamless communication between LLM-based tools (e.g., Copilot Agents). The server is designed to be run locally, ideally alongside an IDE like Visual Studio Code or Visual Studio.

MCP Server uses the third-party library [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk), which allows you to run and test it in a web browser using the Inspector tool.

The project includes a predefined `./data` directory that contains documentation and guide files used to assist with coding in the Creatio environment. Additionally, a `./data/prompts` subfolder contains prompt files used by Copilot Agents to guide their behavior and output.

## Configuration

Set the following environment variables:

- `GUIDE_FILES_DIR`: Path to the directory containing your local guide files (e.g., `./data`).
- `PROMPT_DIR`: Path to your prompt directory (e.g., `./data/prompts`). Prompt files must be `.txt` files and start with the prefix `prompt_`.

You can set these variables in a `.env` file or pass them directly in the terminal when running the app.

**Example `.env` file:**

```env
GUIDE_FILES_DIR=C:\pathToYourProject\mcpCreatioServer\data\
PROMPT_DIR=C:\pathToYourProject\mcpCreatioServer\data\prompts
```

> 💡 The paths should directly point to the folders where your guide and prompt files are located. It’s recommended to create a `prompts` subfolder under `data`.

## Features

- **`ListAvailableFilesTool`** – Lists all `.txt` files located in the `data` directory.
- **`ListPromptsTool`** – Lists all prompt files located in the `data/prompts` directory.
- **`ReadLocalFileTool`** – Reads and returns the content of a file from either `data` or `data/prompts`, depending on the file prefix.

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables using a `.env` file or directly in the terminal.

3. Build the project:
   ```bash
   npm run build
   ```

4. Run the server for browser testing:
   ```bash
   npx @modelcontextprotocol/inspector build/index.js
   ```

5. Use the MCP-compatible client (like Copilot for Visual Studio Code) to interact with the server.

## Usage with Visual Studio Code

To integrate with Copilot:

1. Create a `.vscode` directory in your project.
2. Add a `mcp.json` file with the following content:

```json
{
  "inputs": [],
  "servers": {
    "local": {
      "command": "node",
      "args": [
        "C:\pathToMcpServerProject\mcpCreatioServer\build\index.js"
      ]
    }
  }
}
```

3. Follow the instructions from the [official documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) to enable MCP support in VS Code.

> ⚠️ Make sure you're using the latest or pre-release version of Visual Studio Code that supports Agents.

**Example prompt using guide files and custom prompts:**

```
Use the local MCP server. Load the prompt file "prompt_js_code_style.txt" using the "read_local_file" tool and the `fileName` argument.
Your task is to create a `.ts` file with a class called `House`, which includes `Windows` and `Doors`, and has methods to build them.
Refer to the style guidelines in "prompt_js_code_style.txt" for implementation details.
```

## Customization

You can extend this project by adding your own guide or prompt files:

- **Add a guide file**: Create a `.txt` file with the prefix `guide_` and place it in the folder defined by `GUIDE_FILES_DIR`.
- **Add a prompt file**: Create a `.txt` file with the prefix `prompt_` and place it in the folder defined by `PROMPT_DIR`.

You can also develop custom tools:

1. Create a new `YourTool.ts` file in the `src/tools` directory.
2. Register the tool in `localMcpServer.ts`.
3. Rebuild the project before running tests.

## License

This project is licensed under the **MIT License**.