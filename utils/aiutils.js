const axios = require("axios");

exports.getAIResponse = async (question) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const response = await axios.post(url, {
      contents: [{ 
        parts: [{ text: question }] 
      }],
      generationConfig: {
          // maxOutputTokens: 10, // Removed limit on output tokens
        temperature: 0.7
      }
    });

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!raw) {
      throw new Error("No response from Gemini API");
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
      // Normalize whitespace
      t = t.replace(/\s+/g, " ").trim();

      // Patterns to extract concise answer
      let m = t.match(/(?:Answer|A)[:\-]\s*(.+?)(?:[.\n]|$)/i);
      if (m && m[1]) return m[1].trim().replace(/[.\n\r]+$/g, "");

      m = t.match(/\b(?:is|are)\s+([^\.\n]+)/i);
      if (m && m[1]) return m[1].trim().replace(/[.\n\r]+$/g, "");

      // Return first sentence
      m = t.match(/^([^\.\n]+)[\.\n]?/);
      if (m && m[1]) return m[1].trim();

      return t;
    };

    const cleaned = normalize(raw);
    return cleaned;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
};
