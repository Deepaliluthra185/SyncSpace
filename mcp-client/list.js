const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");
const EventSource = require("eventsource");

// Make EventSource available globally so SSEClientTransport can use it in Node.js
global.EventSource = EventSource;

async function run() {
  const url = "https://app.banani.co/api/mcp/mcp";
  const headers = {
    "Authorization": "Bearer bnni_A5b3cLJVdVH1PbsWQ4GAEZEzyhim1x5M"
  };

  const transport = new SSEClientTransport(new URL(url), { headers });
  
  const client = new Client({
    name: "syncspace-fetcher",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  await client.connect(transport);
  console.log("Connected to MCP server.");

  const tools = await client.listTools();
  console.log("Tools available:", JSON.stringify(tools.tools, null, 2));

  // If there's only one tool, let's call it just in case!
  if (tools.tools.length > 0) {
    const toolName = tools.tools[0].name;
    console.log(`Calling tool: ${toolName}`);
    try {
      const result = await client.callTool({
        name: toolName,
        arguments: {}
      });
      console.log("Tool result:", JSON.stringify(result, null, 2));
    } catch(err) {
      console.error("Error calling tool:", err);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
