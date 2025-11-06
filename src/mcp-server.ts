#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// MCP Server for fetching crypto news
const server = new Server(
  {
    name: "crypto-news-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the crypto news fetching tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "fetch_crypto_news",
        description: "Fetches the latest trending cryptocurrency news from CryptoPanic API. Returns news title, source, and URL.",
        inputSchema: {
          type: "object",
          properties: {
            filter: {
              type: "string",
              description: "Filter type: 'rising', 'hot', or 'bullish'",
              enum: ["rising", "hot", "bullish"],
              default: "rising"
            },
            limit: {
              type: "number",
              description: "Number of news items to fetch (1-20)",
              minimum: 1,
              maximum: 20,
              default: 1
            }
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "fetch_crypto_news") {
    const args = request.params.arguments as any;
    const filter = args?.filter || "rising";
    const limit = Math.min(Number(args?.limit) || 1, 20);

    try {
      const apiUrl = `https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true&kind=news&filter=${filter}`;
      const response = await fetch(apiUrl);
      const data: any = await response.json();

      if (data.results && data.results.length > 0) {
        const newsItems = data.results.slice(0, limit).map((item: any) => ({
          title: item.title,
          source: item.domain || item.source?.title || "crypto news",
          url: item.url || "",
          published_at: item.published_at || "",
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(newsItems, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify([{
              title: "Latest crypto news: DeFi protocols seeing increased adoption and institutional interest continues to grow.",
              source: "fallback",
              url: "",
              published_at: new Date().toISOString()
            }], null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Failed to fetch crypto news",
              message: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Crypto News MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
