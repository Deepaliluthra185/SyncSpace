const url = "https://app.banani.co/api/mcp/mcp";
const token = "bnni_A5b3cLJVdVH1PbsWQ4GAEZEzyhim1x5M";
const fs = require('fs');

async function main() {
  const callRes = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json, text/event-stream",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: "banani_get_selected_designs", arguments: {} }
    })
  });
  
  const reader = callRes.body.getReader();
  const decoder = new TextDecoder();
  let resultText = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    resultText += decoder.decode(value);
  }
  fs.writeFileSync("banani_ui.json", resultText);
  console.log("Saved UI response to banani_ui.json");
}
main();
