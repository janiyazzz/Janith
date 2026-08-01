const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "genimg",
    alias: ["imagine", "genimg"],
    desc: "Generate AI images from text prompt",
    category: "ai",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර සාදන්න අවශ්‍ය රූපයේ විස්තරය (Prompt) ලබාදෙන්න!*");
        await reply("*⏳ AI Image එක සෑදෙමින් පවතී...*");

        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(q)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;

        await conn.sendMessage(from, { 
            image: { url: imgUrl }, 
            caption: `*✨ Prompt:* ${q}\n\n> © JANIYAZZZ MD V1` 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("*❌ Image එක generate කිරීමට නොහැකි විය!*");
    }
});
