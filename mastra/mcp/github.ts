import { MCPConfiguration } from '@mastra/mcp';

export const githubMCP = new MCPConfiguration({
  servers: {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": process.env.GITHUB_TOKEN!
      }
    }
  },
});