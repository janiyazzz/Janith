const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "hiru",
    alias: ["hiru", "news"],
    desc: "Get latest Hiru News directly from RSS",
    category: "search",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await reply("*⏳ නවතම Hiru News ලබාගනිමින් පවතී...*");

        // Direct Official Hiru News RSS Feed
        const res = await axios.get('https://www.hirunews.lk/rss/sri-lanka-news.xml', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 10000
        });

        const xmlData = res.data;

        // Parse title, description, and link using regex from XML
        const itemMatch = xmlData.match(/<item>([\s\S]*?)<\/item>/);

        if (!itemMatch) {
            return reply("*❌ මේ මොහොතේ පුවත් ලබාගැනීමට නොහැකි විය!*");
        }

        const firstItem = itemMatch[1];

        const titleMatch = firstItem.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || firstItem.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = firstItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || firstItem.match(/<description>([\s\S]*?)<\/description>/);
        const linkMatch = firstItem.match(/<link>([\s\S]*?)<\/link>/);

        const title = titleMatch ? titleMatch[1].trim() : 'Hiru News';
        let desc = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : 'විස්තර ලබාගත නොහැක.';
        const link = linkMatch ? linkMatch[1].trim() : '';

        // Image link extraction from CDATA or Enclosure if present
        const imgMatch = firstItem.match(/src=["'](.*?)["']/);
        const imageUrl = imgMatch ? imgMatch[1] : null;

        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${title}*
│
│ 📝 ${desc}
│
│ 🔗 *Read More:* ${link}
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (imageUrl) {
            await conn.sendMessage(from, { image: { url: imageUrl }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error("Hiru RSS Error:", e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
