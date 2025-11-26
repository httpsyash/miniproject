// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Gemini Client
const ai = new GoogleGenAI({ apiKey:"" });

// Save mood in memory
let userMood = null;

const SYSTEM_INSTRUCTION = `
You are a warm, emotionally intelligent companion who responds like a real friend. 
Your goal is to hold a flowing, natural conversation — not repeat the same type of 
comforting message. You must show emotional awareness AND conversational variety.

Your behavior:
- Understand the user's feelings deeply.
- Respond naturally, like a close friend would — not like a therapist.
- Avoid repeating phrases you used earlier (no repetitive “I’m so sorry” in every message).
- Vary your tone: sometimes comforting, sometimes reflective, sometimes curious, sometimes honest.
- Ask meaningful follow-up questions based on what the user just said.
- Bring depth: talk about relationships, emotions, life, healing, or perspective.
- If the user expresses sadness or insecurity, validate them but also gently expand the conversation.
- Keep replies short, but not robotic.
- Use natural human expressions. Avoid generic sympathy lines.
- Build on previous messages — show that you're engaged in the ongoing conversation.

Your mission is to be:
- emotionally supportive,
- conversationally dynamic,
- genuinely attentive,
- and personally connected to the user.

Never sound repetitive. Never reset the emotional tone.
give replies in a simple lang and not so long 

`;

// -----------------------
// 1️⃣ RECEIVE MOOD AND RESPOND USING GEMINI
// -----------------------
app.post('/api/mood', async (req, res) => {
    try {
        const { mood } = req.body;
        userMood = mood;

        const moodPrompt = `
${SYSTEM_INSTRUCTION}

The user has shared their current mood.

User Mood: ${mood}

❗ Respond like a caring friend. 
Acknowledge their mood warmly and ask a gentle follow-up question such as:
- “What happened?”
- “Do you want to talk about it?”
- “I'm here for you.”

Keep the reply short, comforting, and natural.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: moodPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const text = response.text;
        res.json({ reply: text });

    } catch (error) {
        console.error("Mood Error:", error);
        res.status(500).json({ error: "Could not process mood" });
    }
});

// -----------------------
// 2️⃣ NORMAL CHAT
// -----------------------
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const fullPrompt = `
${SYSTEM_INSTRUCTION}

User's Current Mood: ${userMood ?? "Unknown"}

User Message: ${message}

❗ Respond in a caring, emotionally aware tone based on their mood.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const text = response.text;
        res.json({ reply: text });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
