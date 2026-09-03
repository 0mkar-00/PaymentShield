import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payment, documents, localExplanation, score, level } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        explanation: localExplanation,
        source: "local-deterministic",
      });
    }

    // Call Gemini API server-side
    const prompt = `You are PaymentShield's AI Readiness Assistant for freelancers.
Summarize the payment readiness for this transaction in 2-3 professional, helpful sentences.
Strict guidelines:
- Do NOT predict payment-provider decisions or claim to know internal Razorpay risk rules.
- Do NOT guarantee approval or claim to prevent suspension.
- Use phrases like "PaymentShield identified...", "This may warrant additional preparation...", "Supporting evidence is recommended...".
- Ground your response ONLY in these details:
Client: ${payment?.clientName || "Unknown"}
Amount: ${payment?.amount || "Unknown"}
Service: ${payment?.serviceType || "Unknown"}
Purpose: ${payment?.purpose || "Unknown"}
Uploaded Documents: ${JSON.stringify(documents || {})}
Readiness Score: ${score}/100 (${level})

Provide ONLY the concise 2-3 sentence readiness summary.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 180,
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({
        explanation: localExplanation,
        source: "local-deterministic",
      });
    }

    const data = await res.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return NextResponse.json({
      explanation: candidateText || localExplanation,
      source: "gemini-api",
    });
  } catch {
    return NextResponse.json({
      explanation:
        "PaymentShield evaluated this transaction and identified the core details. Please keep supporting evidence ready before requesting payment.",
      source: "local-deterministic",
    });
  }
}
