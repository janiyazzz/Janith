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

        // Mobile version for fast HTML response
        const res = await axios.get('https://www.hirunews.lk/sinhala/local-news.php', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
            },
            timeout: 10000
        });

        const html = res.data;

        // Regex parsing for News Title
        const titleMatch = html.match(/class="title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) || 
                           html.match(/<div class="news-title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                           html.match(/<a[^>]*href="[^"]*hirunews\.lk\/sinhala\/\d+[^"]*"[^>]*>([\s\S]*?)<\/a>/i);

        // Regex parsing for Image
        const imgMatch = html.match(/src="(https:\/\/cdn\.hirunews\.lk\/[^\"]+)"/i) || 
                         html.match(/src="(https:\/\/[^\"]*hirunews[^\"]*\.(?:jpg|png|jpeg))"/i);

        // Regex parsing for News Link
        const linkMatch = html.match(/href="(https:\/\/www\.hirunews\.lk\/sinhala\/\d+\/[^\"]+)"/i) ||
                          html.match(/href="(\/sinhala\/\d+\/[^\"]+)"/i);

        if (!titleMatch) {
            return reply("*❌ මේ මොහොතේ Hiru News වෙබ් අඩවියෙන් පුවත් ගැනීමට නොහැක. පසුව උත්සාහ කරන්න.*");
        }

        const title = titleMatch[1].replace(/<[^>]*>?/gm, '').trim();
        const imgUrl = imgMatch ? imgMatch[1] : null;
        let link = linkMatch ? linkMatch[1] : '';

        if (link && !link.startsWith('http')) {
            link = 'https://www.hirunews.lk' + link;
        }

        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${title}*
│
${link ? `│ 🔗 *Read More:* ${link}\n` : ''}╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (imgUrl) {
            await conn.sendMessage(from, { image: { url: imgUrl }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error("Hiru Error:", e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
