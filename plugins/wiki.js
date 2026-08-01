const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "wiki",
    alias: ["wikipedia","paper"],
    desc: "Search Wikipedia",
    category: "search",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර සෙවීමට අවශ්‍ය මාතෘකාව ලබාදෙන්න!* (Ex: .wiki Albert Einstein)");
        await reply(`*🔍 Wikipedia හි "${q}" පිළිබඳව සොයමින් පවතියි...*`);

        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);

        if (!res.data || res.data.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
            return reply("*❌ තොරතුරු සොයාගැනීමට නොහැකි විය!*");
        }

        const text = `╭─── « *WIKIPEDIA SEARCH* » ───⟡
│
│ 📖 *Title:* ${res.data.title}
│
│ 📝 *Extract:* │ ${res.data.extract}
│
│ 🔗 *Read More:* ${res.data.content_urls.desktop.page}
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (res.data.thumbnail && res.data.thumbnail.source) {
            await conn.sendMessage(from, { image: { url: res.data.thumbnail.source }, caption: text }, { quoted: mek });
        } else {
            await reply(text);
        }

    } catch (e) {
        console.error(e);
        reply("*❌ තොරතුරු සොයාගැනීමට නොහැකි විය!*");
    }
});
