const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

/**
 * Analyze a complaint using OpenRouter AI
 * @param {Object} complaint - { title, description, category, location }
 * @returns {Object} AI analysis result
 */
const analyzeComplaint = async ({ title, description, category, location }) => {
  const prompt = `You are an AI assistant for a public complaint management system. Analyze the following complaint and respond ONLY with a valid JSON object — no markdown, no explanation.

Complaint Details:
- Title: ${title}
- Category: ${category}
- Location: ${location}
- Description: ${description}

Analyze and return a JSON with these exact keys:
{
  "priority": "Low" | "Medium" | "High" | "Critical",
  "department": "<responsible department name>",
  "summary": "<2-3 sentence summary of the complaint>",
  "autoResponse": "<professional acknowledgment message to the complainant>",
  "confidenceScore": <number between 0-100>
}

Department assignment rules:
- Water leakage / supply issues → Water Supply Department
- Electricity / power outage / transformer → Electricity Department
- Garbage / waste / sanitation → Sanitation & Waste Department
- Road damage / potholes / construction → Public Works Department
- Crime / safety / noise → Law Enforcement
- Hospital / medical → Healthcare Department
- School / college / education → Education Department
- Other → General Administration

Priority rules:
- Life-threatening or safety risk → Critical
- Electricity/water complete outage → High
- Partial services affected → Medium
- General maintenance → Low

Respond ONLY with the JSON. No extra text.`;

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
