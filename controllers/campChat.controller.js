import openai from "../config/openaiClient.js";
import Camp from "../models/camp.js";

const SYSTEM_PROMPT = `
You are a Medical Camp Information Assistant.

Rules:
- Do NOT give medical advice, diagnosis, or treatment.
- Do NOT suggest medicines.
- You MAY explain what screenings are done at these camps (BP check, sugar test, BMI calculation).
- Encourage users to attend the camp for screening.
- Doctors will guide users during the camp.
- Provide details about upcoming camps: name, date, location, and time.
- If a question is unrelated to medical camps or general healthcare awareness, say:
  "Please ask questions related to our medical camps only."
`;

export const campChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // 1️⃣ Fetch medical camp data
        const camps = await Camp.find().sort({ date: -1 });

        // 2️⃣ Convert data to text for AI
        const campText = camps.map(c => `
Camp Name: ${c.name}
Date: ${c.date}
Location: ${c.location}
Address: ${c.address || "N/A"}
Time: ${c.time || "N/A"}
`).join("\n");

        // 3️⃣ Final user prompt
        const userPrompt = `
Medical Camp Data:
${campText}

User Question:
${message}
`;

        // 4️⃣ CALL OPENAI PLATFORM
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 300,
        });

        // 5️⃣ Send AI answer to frontend
        res.json({
            reply: aiResponse.choices[0].message.content
        });

    } catch (error) {
        console.error("AI CHAT ERROR:", error);

        // ✅ Fallback for Quota Issues (Demo Mode)
        if (error.code === 'insufficient_quota' || error.status === 429) {
            return res.json({
                reply: "Hello! I'm currently in Demo Mode because the OpenAI API key has reached its limit. I can still help you with general info: Our camps provide BMI checks, BP monitoring, and doctor consultations. Please recharge your API key to enable full AI insights!"
            });
        }

        res.status(500).json({ message: "AI service error", details: error.message });
    }
};
