const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "hiru",
    alias: ["hirunews", "news"],
    desc: "Get latest Hiru News",
    category: "search",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await reply("*⏳ නවතම පුවත් ලබාගනිමින් පවතී...*");
        
        // Public Sri Lankan News API
        const res = await axios.get('https://news-api-virid.vercel.app/hiru');
        if (!res.data || !res.data.result) return reply("*❌ පුවත් සොයාගැනීමට නොහැකි විය!*");

        const news = res.data.result;
        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${news.title || 'Hiru News'}*
│
│ 📝 ${news.news || news.description || 'විස්තර ලබාගත නොහැක.'}
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
