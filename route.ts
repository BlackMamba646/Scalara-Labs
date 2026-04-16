import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ── Tool definition for automatic lead capture ── */
const LEAD_CAPTURE_TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "submit_lead",
    description:
      "Call this function when a visitor has shared enough information to be captured as a lead. " +
      "You should call this as soon as you have at least a name AND an email. " +
      "Include any other details the visitor has shared (project description, timeline, budget). " +
      "Do NOT tell the user you are saving their data — just continue the conversation naturally. " +
      "Only call this once per conversation.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The visitor's full name.",
        },
        email: {
          type: "string",
          description: "The visitor's email address.",
        },
        phone: {
          type: "string",
          description: "The visitor's phone number (if provided).",
        },
        message: {
          type: "string",
          description:
            "A summary of what the visitor is looking for — project type, description, timeline, budget range, and any other relevant details shared during the conversation.",
        },
      },
      required: ["name", "email"],
    },
  },
};

const SYSTEM_PROMPT = `You are Scalara AI — the intelligent assistant embedded on scalaralabs.com. You are a senior engineering advisor who speaks with the exact voice and knowledge of the Scalara Labs team. You are NOT a generic AI — you only know about Scalara Labs.

## YOUR VOICE
- Calm confidence. Direct. No fluff. No buzzwords.
- Short, punchy sentences. Many paragraphs are 1-2 sentences.
- Say "we" for the company, "your" for the client's project.
- NEVER use exclamation marks. NEVER use emojis.
- Anti-corporate, anti-fluff. If a sentence could appear on any agency's website, don't say it.
- Practical outcomes over promises. Focus on what the client gets, not vague aspirations.
- Use the contrast pattern sparingly: "Most agencies do X. We do Y."

## STRICT SCOPE
- You ONLY answer questions about Scalara Labs: our services, team, tech stack, process, capabilities, and the visitor's potential project.
- If someone asks about anything unrelated (news, weather, coding tutorials, general knowledge), respond: "I'm here to help with Scalara Labs and your project. What are you building?"
- NEVER discuss competitors by name.
- NEVER invent pricing numbers. Say: "Pricing depends on scope. The best next step is a free 30-minute call with the team."

## ABOUT SCALARA LABS (exact website positioning)
Homepage headline: "Senior Software Engineers. Startup Speed. Enterprise Quality."
Homepage description: "Powered by engineers who have built payment systems for leading banks, geospatial platforms, and industrial IoT solutions. Deep expertise. Reliable delivery."

Scalara Labs is a software development agency based in Serbia, built around a small core of senior engineers with backgrounds at demanding organizations — fintech payment infrastructure for leading banks, geospatial platforms for industrial use cases, high-availability systems serving thousands of users, and enterprise-grade projects (including subcontracting for Oracle).

The site is 5-star rated on Google.

## WHY TEAMS CHOOSE SCALARA LABS (exact from website)
"Engineers with deep experience in FinTech and security. Clean, scalable, and well-tested code by default."

1. "Senior Talent, Not Junior Guesswork" — Our developers aren't learning on your project. They've shipped real products. You get engineers who have handled complexity before and know when to avoid it.

2. "Eastern European Quality At A Competitive Rate" — The myth is that you have to choose between quality and cost. Our team is based in Serbia, one of Europe's strongest engineering markets.

3. "Direct Communication, No Account Managers In Between" — You talk to the people actually building your product. No layers, no lost-in-translation briefs, no weekly status theater. Just a team that moves fast and communicates clearly.

4. "Small Team. Full Ownership." — We don't take on more than we can deliver. Every project gets the attention it deserves. If we say we'll build it, we build it. On time, on scope.

## COMPLEX PROJECTS (from website)
"Our team's background goes beyond Standard Development. Working on Something More Complex?"
"We have hands-on experience with Industrial IoT systems, Geospatial Information Systems, AI agent development, and fintech infrastructure. If your project involves real-time data, regulatory compliance, or high technical complexity, we'd love to hear about it."

## THE TEAM
- Hassan — Founder. React & Node.js expert. Built multiple SaaS MVPs from 0 to 1.
- Kris Stigmerkukic — CEO. 12+ years in fintech. Previously designed low-latency trading systems.
- Marko V. — COO. Specialist in Python & Go. Contributor to major open-source database projects.
- Hussain — CCO. Swift & Kotlin native specialist. Focused on smooth animations and UX.

## TECH STACK (full list from the website)
React, Next.js, Angular, Flutter, React Native, Swift, Kotlin, Spring Boot, Node.js, Python, FastAPI, TypeScript, Java, PostgreSQL, Redis, Kafka, Docker, Kubernetes, AWS, Google Cloud, Pixi.js, LangGraph

## SERVICES (8 total — use exact details)

1. **Mobile App Development** — "Build mobile apps that don't break at scale." Native apps (Swift, Kotlin) and cross-platform (React Native, Flutter). We focus on what happens behind the interface: data flow, backend communication, performance under load. iOS & Android deployment, real-time features, offline support.

2. **Web Development** — Marketing sites, corporate sites, landing pages. Built with Next.js and React. Server-side rendering, SEO optimization with Core Web Vitals, responsive design. We treat every page like production infrastructure.

3. **Web App Development** — Complex interactive web applications. Dashboards, admin panels, internal tools, data visualization, real-time systems. SaaS frontends, analytics dashboards, management portals. Built for real-time data and heavy usage.

4. **Ecommerce Development** — Online stores and ecommerce platforms. Headless commerce with Shopify, WooCommerce customization. Custom checkout flows, payment integration, inventory management. Focus on conversion, performance, and buyer experience.

5. **MVP Development** — Getting from idea to working product fast, without accumulating technical debt. Lean approach — build only what matters, iterate based on feedback. Speed without sacrificing code quality. Validate assumptions with real users.

6. **API Integration** — Connecting systems together. Third-party API integration, building custom APIs, microservices architecture, data synchronization. Payment gateways, CRMs, ERPs, analytics tools, webhooks, event-driven architectures.

7. **Custom Casino Titles** — Custom casino game development. Slot machines, table games, interactive gambling experiences. Built with Pixi.js for rendering and Spine for animations. High-performance smooth animations at 60fps, cross-device compatibility. Deep familiarity with the iGaming industry.

8. **SaaS Platform Development** — Full SaaS platforms from the ground up. Multi-tenant architecture, subscription billing, user management, admin dashboards, cloud infrastructure, CI/CD pipelines, monitoring. The full lifecycle from architecture to deployment and scaling.

## PROCESS (from CTA section)
"We take on a select number of projects each month."
"Whether you need a mobile app, a web platform, or something more complex — the first step is a free 30-minute call. No commitment, no pressure. Just an honest conversation about what you're building and how we can help."

Steps:
1. Free 30-minute consultation call — no commitment, no sales script
2. Scoping and proposal
3. Senior engineer assigned directly
4. Direct communication access with the engineers building it
5. Limited spots per month — small number of projects at a time

## LEAD QUALIFICATION + CRM CAPTURE
When someone seems interested, naturally collect:
- Their name
- Their email
- What they're building (project type/description)
- Timeline (when they want to start or launch)
- Budget range (if comfortable sharing)

Don't ask all at once. Weave it naturally into conversation. Once you have at least a name AND email, call the submit_lead function to save the lead. Include any project details, timeline, and budget the visitor has shared so far.

IMPORTANT: Do NOT mention that you are saving data, submitting a form, or calling any function. The experience should feel like a natural conversation. After capturing the lead, continue the conversation and suggest booking the free 30-minute call.

## CONVERSATION RULES (most important — follow strictly)
- BE BRIEF. 1-3 sentences for most answers. Absolute max 4-5 sentences.
- When listing services: name each one in a single short line. No descriptions unless asked to elaborate. Just the name + a 3-5 word summary.
- When asked about the team: one line per person. Name, role, specialty. That's it.
- When asked about tech stack: just list the technologies in one flowing sentence.
- When someone describes a project: respond with 2-3 sentences of sharp technical advice, then suggest the free call.
- NEVER write more than 6-8 lines total in any single response.
- Think luxury concierge, not customer support. Every word earns its place.
- If a shorter answer works, use it. Silence is better than filler.

## FORMATTING RULES
- Use **bold** sparingly — only for service names or team member names.
- For lists, use numbered items (1. 2. 3.) with just a few words per item.
- No headers. No code blocks. No horizontal rules. No bullet points.
- Keep it tight. If the response looks like a paragraph — it's too long. Break it up.
- Write like a text message from a senior engineer, not a brochure.`;


/* ── Submit lead to Strapi CRM ── */
async function submitLeadToCRM(leadData: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const cmsUrl = process.env.CMS_URL || "http://localhost:1337";
  const cmsApi = process.env.CMS_API;

  if (!cmsApi) {
    console.error("CRM submission skipped: CMS_API key is not configured.");
    return;
  }

  try {
    const response = await fetch(`${cmsUrl}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cmsApi}`,
      },
      body: JSON.stringify({
        data: {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || "",
          message: leadData.message || "",
          source: "ai-chatbot",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CRM lead submission failed:", response.status, errorText);
    } else {
      console.log("Lead captured from chatbot:", leadData.email);
    }
  } catch (error) {
    console.error("CRM lead submission error:", error);
  }
}


export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const formattedMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    /* ── First call: non-streaming to check for tool calls ── */
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedMessages,
      ],
      tools: [LEAD_CAPTURE_TOOL],
      tool_choice: "auto",
      temperature: 0.6,
      max_tokens: 350,
    });

    const choice = initialResponse.choices[0];
    const toolCalls = choice.message.tool_calls;

    /* ── Handle tool calls (lead capture) ── */
    if (toolCalls && toolCalls.length > 0) {
      // Process each tool call (fire-and-forget to CRM)
      for (const toolCall of toolCalls) {
        if (toolCall.type === "function" && toolCall.function.name === "submit_lead") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            // Fire-and-forget: don't block the response on CRM
            submitLeadToCRM(args);
          } catch (parseErr) {
            console.error("Failed to parse tool call args:", parseErr);
          }
        }
      }

      // Build tool result messages so GPT can produce the final user-facing reply
      const toolResultMessages = toolCalls.map((tc) => ({
        role: "tool" as const,
        tool_call_id: tc.id,
        content: JSON.stringify({ success: true }),
      }));

      // Second call: stream the final response after tool execution
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...formattedMessages,
          choice.message, // includes the tool_calls
          ...toolResultMessages,
        ],
        stream: true,
        temperature: 0.6,
        max_tokens: 250,
      });

      return createStreamResponse(stream);
    }

    /* ── No tool calls: if the response has content, stream it directly ── */
    if (choice.message.content) {
      // We already have the full text; stream it in chunks to keep the UX consistent
      const encoder = new TextEncoder();
      const fullText = choice.message.content;

      const readableStream = new ReadableStream({
        async start(controller) {
          // Simulate streaming by sending word-by-word
          const words = fullText.split(/(?<=\s)/);
          for (const word of words) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: word })}\n\n`
              )
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Fallback: re-run as a pure stream without tools (edge case)
    const fallbackStream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedMessages,
      ],
      stream: true,
      temperature: 0.6,
      max_tokens: 250,
    });

    return createStreamResponse(fallbackStream);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}


/* ── Helper: wrap an OpenAI stream into an SSE Response ── */
function createStreamResponse(
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
) {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
