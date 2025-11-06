import { z } from "zod";

export const OutputSchema = z.object({
  answer: z.string(),
  source: z.string().nullable()
});

export const ChatInSchema = {
  type: "object",
  required: ["input"],
  properties: {
    input: { type: "string" },
    useRag: { type: "boolean" }
  }
};