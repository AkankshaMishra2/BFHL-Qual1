const axios = require("axios");

exports.getAIResponse = async (question) => {
  if (!process.env.GROK_API_KEY) {
    throw new Error("GROK_API_KEY not set in environment");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";
  const promptText = `Answer with a single word (the name only), no explanation: ${question}`;

  try {
    const response = await axios.post(
      url,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: promptText }
        ],
        max_tokens: 32,
        temperature: 0.0
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content || "";

    if (!raw) {
      throw new Error("No response from Grok/OpenAI API");
    }

    const normalize = (s) => {
      let t = String(s || "");
      // Remove code fences
      t = t.replace(/```[\s\S]*?```/g, "");
      // Unwrap markdown bold/italic
      t = t.replace(/\*\*(.*?)\*\*/g, "$1");
      t = t.replace(/\*(.*?)\*/g, "$1");
      // Remove HTML tags
      t = t.replace(/<[^>]+>/g, "");
      // Normalize whitespace and trim punctuation
      t = t.replace(/\s+/g, " ").trim();
      t = t.replace(/^[:\-\s]+|[.\n\r]+$/g, "");

      // Extract single-word / concise answers if possible
      // 1) If line contains just a word or short phrase, return it
      const single = t.match(/^([A-Za-z0-9\s'\-,&]+)$/);
      if (single) return single[1].trim();

      // 2) Look for patterns like "Answer: X"
      let m = t.match(/(?:Answer|A)[:\-]\s*(.+?)(?:$)/i);
      if (m && m[1]) return m[1].trim();

      // 3) Look for "is <Answer>"
      m = t.match(/\b(?:is|are)\s+([^\.\n]+)/i);
      if (m && m[1]) return m[1].trim();

      // 4) Otherwise return first token/word
      m = t.match(/^(\S+)/);
      if (m && m[1]) return m[1].trim();

      return t;
    };

    return normalize(raw);
  } catch (error) {
    console.error("Grok/OpenAI API Error:", error.response?.data || error.message);
    throw error;
  }
};
