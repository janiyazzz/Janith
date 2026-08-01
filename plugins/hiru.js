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
        await reply("*⏳ නවතම Hiru News ලබාගනිමින් පවතී...*");

        // Direct Public News API
        const res = await axios.get('https://dark-yasiya-news-api.vercel.app/hiru');

        if (!res.data || !res.data.status || !res.data.result) {
            return reply("*❌ මේ මොහොතේ පුවත් ලබාගැනීමට නොහැකි විය!*");
        }

        const news = res.data.result;

        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${news.title || 'Hiru News'}*
│
│ 📝 ${news.desc || news.news || 'විස්තර ලබාගත නොහැක.'}
│
│ 🔗 *Read More:* ${news.url || news.link || ''}
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (news.image) {
            await conn.sendMessage(from, { image: { url: news.image }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error("Hiru API Error:", e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
