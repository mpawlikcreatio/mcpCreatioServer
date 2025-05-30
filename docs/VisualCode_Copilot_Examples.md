Ready-to-Use Prompts

Here are some prompts you can paste directly into Copilot. The agent will connect to your local MCP server and handle the rest.
When Agent calls Tool, you must give him permission to do that. You will see consent prompt.

---

Description: 🔍 List Available Prompts
Prompt text:
Use local MCP server. List me all available prompts by calling the "list_prompts" tool.

---

Description: 💻 Create JavaScript Code (Creatio Style)

Prompt text:
Use the local MCP server.

Step 1: Read the prompt file "prompt_js_code_style.txt" using the "read_local_file" tool.

Step 2: Then execute the instructions defined inside that file. If those instructions require additional tool calls (e.g., to load other guide files), execute them accordingly.

Step 3: Once all guide files are processed, generate a .ts file with a class called House. This class includes Windows and Doors, and has methods to build them. Apply all extracted style rules strictly.

---

Description: 💾 Create C# Class (Creatio Style)
Prompt text:
Use the local MCP server.

Step 1: Load the prompt file named "prompt_csharp_class_authoring.txt" using the "read_local_file" tool with the argument "fileName".

Step 2: Once the file is loaded, execute all instructions defined in that file. If those instructions require using additional tools, follow them accordingly.

Step 3: After completing all steps from the prompt file, generate a C# (.cs) file with a class named House. The class should contain Windows and Doors properties, and include methods to build them.

Ensure that the implementation follows all guidelines and conventions from the loaded prompt file.

---

Description: ✅ Create C# Unit Tests (Best Practices)
Prompt text:
Use the local MCP server.

Step 1: Load the prompt file named "prompt_csharp_unit_tests.txt" using the "read_local_file" tool with the argument "fileName".

Step 2: Once the file is loaded, execute all instructions defined in that file. If the instructions require using additional tools or loading other files, follow those steps accordingly.

Step 3: Then generate a C# (.cs) file containing Unit Tests for the class named House. The tests should follow the practices and standards described in the loaded prompt file.

Ensure full compliance with the conventions and recommendations from the prompt.

---
