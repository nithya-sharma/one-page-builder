export const dynamic = "force-dynamic"; // This disables static optimization, forces dynamic rendering

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  try {
    // Parse the JSON body from the POST request
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Load Gemini Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the system prompt for Gemini
    const systemPrompt = `You are an expert web developer. Create a complete, beautiful, and responsive single-page website based on the user's prompt.

REQUIREMENTS:
- Generate ONLY the HTML code with embedded Tailwind CSS (CDN link)
- Responsive and mobile-friendly
- Use Tailwind classes for layout, spacing, typography, etc.
- Modern design (gradients, shadows, transitions, animations)
- Semantic HTML5 tags
- Proper <head> with title, meta tags
- Interactive UI (hover effects, scroll effects if appropriate)
- Color scheme should suit the content
- Return ONLY HTML. No markdown, explanations, or comments.

User prompt: ${prompt}`;

    // Generate website HTML from the LLM
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let generatedHTML = response.text().trim();

    // Cleanup: remove any accidental markdown formatting
    let cleanHTML = generatedHTML
      .replace(/```html\s*/gi, "")
      .replace(/```/g, "")
      .trim();

    // Ensure the output starts with a valid doctype
    if (!cleanHTML.toLowerCase().startsWith("<!doctype html>")) {
      cleanHTML = "<!DOCTYPE html>\n" + cleanHTML;
    }

    // Return JSON with the HTML
    return NextResponse.json({
      html: cleanHTML,
      success: true,
    });
  } catch (error) {
    console.error("Error generating website:", error);
    return NextResponse.json(
      {
        error:
          "Failed to generate website. Please check your API key and try again.",
      },
      { status: 500 }
    );
  }
}
