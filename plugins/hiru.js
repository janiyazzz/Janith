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

        const res = await axios.get('https://news-api-virid.vercel.app/hiru');
        
        if (!res.data || !res.data.result) {
            return reply("*❌ පුවත් ලබාගැනීමට නොහැකි විය!*");
        }

        const news = res.data.result;
        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${news.title}*
│
│ 📝 ${news.news || news.description || 'විස්තර නොමැත.'}
│
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (news.image) {
            await conn.sendMessage(from, { image: { url: news.image }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error(e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
