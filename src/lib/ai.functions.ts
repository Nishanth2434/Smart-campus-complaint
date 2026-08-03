import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(5).max(2000),
  categories: z.array(z.string()).min(1).max(30),
});

export const classifyComplaint = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { category: null as string | null, priority: null as string | null };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You triage campus facility complaints. Reply with JSON only: " +
              '{"category":"<one of the allowed categories>","priority":"Low|Medium|High"}. ' +
              "High = safety risk or many people blocked; Low = cosmetic or minor.",
          },
          {
            role: "user",
            content: `Allowed categories: ${data.categories.join(", ")}\nTitle: ${data.title}\nDescription: ${data.description}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { category: null as string | null, priority: null as string | null };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { category: null as string | null, priority: null as string | null };

    try {
      const parsed = JSON.parse(match[0]) as { category?: string; priority?: string };
      const category = data.categories.find(
        (c) => c.toLowerCase() === String(parsed.category ?? "").toLowerCase(),
      );
      const priority = ["Low", "Medium", "High"].find(
        (p) => p.toLowerCase() === String(parsed.priority ?? "").toLowerCase(),
      );
      return { category: category ?? null, priority: priority ?? null };
    } catch {
      return { category: null as string | null, priority: null as string | null };
    }
  });
