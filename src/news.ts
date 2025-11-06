import fetch from "node-fetch";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
}

interface NewsResponse {
  news: string;
  sourceUrl: string;
}

let mcpClient: Client | null = null;
let isInitializing = false;

async function getMCPClient(): Promise<Client | null> {
  if (mcpClient) {
    return mcpClient;
  }

  if (isInitializing) {
    // Wait for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    return mcpClient;
  }

  try {
    isInitializing = true;
    const serverPath = path.resolve(process.cwd(), 'dist/mcp-server.js');
    
    const transport = new StdioClientTransport({
      command: "node",
      args: [serverPath],
    });

    mcpClient = new Client(
      {
        name: "dapplink-news-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await mcpClient.connect(transport);
    console.log("✅ MCP Client connected successfully");
    isInitializing = false;
    return mcpClient;
  } catch (error) {
    console.error("❌ Failed to initialize MCP client:", error);
    isInitializing = false;
    mcpClient = null;
    return null;
  }
}

export async function fetchLatestCryptoNews(): Promise<NewsResponse> {
  try {
    const client = await getMCPClient();
    
    if (!client) {
      throw new Error("MCP client not available");
    }

    const result: any = await client.callTool({
      name: "fetch_crypto_news",
      arguments: {
        filter: "rising",
        limit: 1,
      },
    });

    if (result.content && result.content[0]?.type === "text") {
      const newsArray = JSON.parse(result.content[0].text);
      if (newsArray && newsArray.length > 0) {
        const newsItem = newsArray[0];
        return {
          news: `${newsItem.title}\nsource: ${newsItem.source}`,
          sourceUrl: newsItem.url || ''
        };
      }
    }

    throw new Error("No news data received");
  } catch (error) {
    console.error("❌ Error fetching news via MCP:", error);
    
    // Fallback: direct API call
    try {
      const apiUrl = "https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true&kind=news&filter=rising";
      const response = await fetch(apiUrl);
      const data: any = await response.json();
      
      if (data.results && data.results.length > 0) {
        const topNews = data.results[0];
        return {
          news: `${topNews.title}\nsource: ${topNews.domain || topNews.source?.title || 'crypto news'}`,
          sourceUrl: topNews.url || ''
        };
      }
    } catch (fallbackError) {
      console.error("❌ Fallback API also failed:", fallbackError);
    }

    return {
      news: "Web3 ecosystem continues expansion with new Layer2 solutions and cross-chain protocols gaining traction across multiple blockchains.",
      sourceUrl: ''
    };
  }
}

export async function isNewsRequest(input: string): Promise<boolean> {
  const lowerInput = input.toLowerCase().trim();
  const triggers = [
    "today's post",
    "todays post",
    "today post",
    "latest news",
    "current news",
    "give me today",
    "generate today",
    "today's tweet",
    "todays tweet"
  ];
  
  return triggers.some(trigger => lowerInput.includes(trigger));
}
