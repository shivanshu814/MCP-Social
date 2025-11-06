import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import dotenv from "dotenv";
import path from "path";
import { buildPrompt } from "./prompt";
import { generate } from "./llm";
import { OutputSchema, ChatInSchema } from "./schema";
import { isNewsRequest, fetchLatestCryptoNews } from "./news";

dotenv.config();

const port = Number(process.env.PORT || 8000);
const app = Fastify({ logger: true });

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/'
});

app.post("/chat", {
  schema: {
    body: ChatInSchema
  }
}, async (request, reply) => {
  const body = request.body as { input: string; useRag?: boolean };
  
  let userInput = body.input;
  let newsSource: string | null = null;
  
  if (await isNewsRequest(userInput)) {
    request.log.info("Fetching latest crypto news via MCP...");
    const newsData = await fetchLatestCryptoNews();
    userInput = newsData.news;
    newsSource = newsData.sourceUrl || null;
    request.log.info({ fetchedNews: userInput, source: newsSource }, "Fetched crypto news via MCP");
  }
  
  const prompt = buildPrompt(userInput, []);
  const raw = await generate(prompt);
  
  request.log.info({ raw }, "Raw LLM response");
  
  try {
    const parsed = JSON.parse(raw);
    const validated = OutputSchema.parse(parsed);
    
    if (newsSource) {
      validated.source = newsSource;
    }
    
    return validated;
  } catch (err) {
    request.log.error({ err, raw }, "Failed to parse/validate model output");
    return reply.code(200).send({ answer: "Mujhe iski jankari nahi hai", source: null });
  }
});

app.get("/health", async () => ({ status: "ok" }));

app.listen({ port, host: "0.0.0.0" }).then(() => {
  app.log.info(`Server listening on ${port}`);
});