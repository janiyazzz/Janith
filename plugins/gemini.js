const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gemini",
    alias: ["ai", "chat", "gemini"],
    desc: "Chat with Gemini AI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න!* (Ex: .gemini ශ්‍රී ලංකාව ගැන විස්තර කරන්න)");
        
        await reply("*⏳ Gemini AI සිතමින් පවතියි...*");

        // Fast & Working Gemini Endpoint
        const res = await axios.get(`https://api.vishwa.store/ai/gemini?text=${encodeURIComponent(q)}`, {
            timeout: 10000
        });

        if (!res.data || !res.data.result) {
            return reply("*❌ පිළිතුරක් ලබාගැනීමට නොහැකි විය!*");
        }

        const caption = `╭─── « *GEMINI AI* » ───⟡
│
${res.data.result.trim()}
│
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        await reply(caption);

    } catch (e) {
        console.error("Gemini Error:", e);
        reply("*❌ Gemini AI සම්බන්ධතාවයේ දෝෂයක් සිදු විය!*");
    }
});
