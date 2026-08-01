const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "hiru",
    alias: ["hiru", "news"],
    desc: "Get latest Hiru News",
    category: "search",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await reply("*⏳ නවතම පුවත් ලබාගනිමින් පවතී...*");

        // Stable Public News Endpoint
        const response = await axios.get('https://hirunews.vercel.app/api/latest-news?limit=1');
        
        if (!response.data || !response.data.articles || response.data.articles.length === 0) {
            return reply("*❌ මේ මොහොතේ පුවත් ලබාගැනීමට නොහැකි විය. පසුව නැවත උත්සාහ කරන්න.*");
        }

        const news = response.data.articles[0];
        
        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${news.title || 'Hiru News'}*
│
│ 📝 ${news.summary || news.description || news.full_text || 'විස්තර ලබාගත නොහැක.'}
│
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        const imageUrl = news.thumbnail || news.image;

        if (imageUrl) {
            await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error("Hiru Error:", e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
