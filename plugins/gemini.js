const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gemini",
    alias: ["ai", "chat", "gemini"],
    desc: "Chat with Gemini AI (Official & Fast)",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර ප්‍රශ්නයක් හෝ යමක් ඇතුළත් කරන්න!*\n\n*උදාහරණ:* `.gemini ශ්‍රී ලංකාව ගැන කෙටි විස්තරයක් දෙන්න`");
        
        await reply("*⏳ Gemini AI සිතමින් පවතියි...*");

        // Free Official API Key (You can change this with your own Key from Google AI Studio)
        const apiKey = "AIzaSyD-TEST-KEY-REPLACE-IF-NEEDED";

        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: q }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        ).catch(err => null);

        // Fallback API if the primary fails
        let aiResult = "";
        if (res && res.data && res.data.candidates && res.data.candidates[0].content.parts[0].text) {
            aiResult = res.data.candidates[0].content.parts[0].text;
        } else {
            const fallback = await axios.get(`https://api.vishwa.store/ai/gemini?text=${encodeURIComponent(q)}`).catch(() => null);
            if (fallback && fallback.data && fallback.data.result) {
                aiResult = fallback.data.result;
            }
        }

        if (!aiResult) {
            return reply("*❌ Gemini AI පිළිතුර ලබාදීමට අපොහොසත් විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.*");
        }

        const text = `╭─── « *GEMINI AI ULTRA* » ───⟡
│
${aiResult.trim()}
│
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        await reply(text);

    } catch (e) {
        console.error("Gemini Error:", e);
        reply("*❌ Gemini AI සම්බන්ධතාවයේ දෝෂයක් සිදු විය!*");
    }
});
