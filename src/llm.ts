import fetch from "node-fetch";

const OPENAI_API = "https://api.openai.com/v1/chat/completions";

export async function generate(prompt: string): Promise<string> {
  const tgiUrl = process.env.TGI_URL;
  if (tgiUrl) {
    const url = `${tgiUrl}/generate`;
    const body = { inputs: prompt, parameters: { temperature: 0.0, max_new_tokens: 512 } };
    const headers: any = { "Content-Type": "application/json" };
    if (process.env.TGI_API_KEY) headers["Authorization"] = `Bearer ${process.env.TGI_API_KEY}`;
    const r = await fetch(url, { method: "POST", body: JSON.stringify(body), headers });
    const js: any = await r.json();
    if (js && js.generated_text) return js.generated_text;
    if (Array.isArray(js) && js[0]?.generated_text) return js[0].generated_text;
    return JSON.stringify({ answer: "Mujhe iski jankari nahi hai", source: null });
  }

  if (!process.env.OPENAI_API_KEY) throw new Error("No OPENAI_API_KEY or TGI_URL configured");
  const model = process.env.MODEL || "gpt-4o-mini";
  const res = await fetch(OPENAI_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 512,
      response_format: { type: "json_object" }
    })
  });
  const j: any = await res.json();
  
  // Check for API errors
  if (j.error) {
    console.error("OpenAI API Error:", j.error);
    throw new Error(`OpenAI API Error: ${j.error.message || JSON.stringify(j.error)}`);
  }
  
  const text = j?.choices?.[0]?.message?.content;
  return typeof text === "string" ? text : JSON.stringify({ answer: "Mujhe iski jankari nahi hai", source: null });
}