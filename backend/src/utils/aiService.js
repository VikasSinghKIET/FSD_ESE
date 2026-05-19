const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

/**
 * Analyze a complaint using OpenRouter AI
 * @param {Object} complaint - { title, description, category, location }
 * @returns {Object} AI analysis result
 */
const analyzeComplaint = async ({ title, description, category, location }) => {
  const prompt = `You are an AI complaint analyzer for a government complaint management system.

Analyze the complaint carefully and determine:

1. Priority:
- High
- Medium
- Low

Rules:
- HIGH = danger, emergency, public safety, electricity/fire/gas
- MEDIUM = operational issues affecting daily life
- LOW = cosmetic issues, suggestions, minor inconveniences

2. Responsible Department

3. Short Summary

4. Auto-generated response message

Return STRICT JSON only with these exact keys:
{
  "priority": "High" | "Medium" | "Low",
  "department": "Name of Department",
  "summary": "Short Summary",
  "autoResponse": "Auto-generated response message",
  "confidenceScore": 95
}

Complaint:
Title: ${title}
Category: ${category}
Location: ${location}
Description: ${description}`;

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 512,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "AI Complaint Management System",
      },
      timeout: 30000,
    }
  );

  const rawContent = response.data.choices[0].message.content.trim();

  // Strip markdown code fences if present
  const jsonStr = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    // Fallback if AI returns malformed JSON
    parsed = {
      priority: "Medium",
      department: "General Administration",
      summary: "Your complaint has been received and is under review.",
      autoResponse:
        "Thank you for submitting your complaint. Our team will review it and take necessary action within 3-5 business days.",
      confidenceScore: 50,
    };
  }

  return {
    priority: parsed.priority || "Medium",
    department: parsed.department || "General Administration",
    summary: parsed.summary || "",
    autoResponse: parsed.autoResponse || "",
    confidenceScore: Number(parsed.confidenceScore) || 50,
    analyzedAt: new Date(),
  };
};

module.exports = { analyzeComplaint };
