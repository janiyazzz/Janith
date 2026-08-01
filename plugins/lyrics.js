const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "lyrics",
    alias: ["songlyrics", "lyrics"],
    desc: "Search song lyrics",
    category: "search",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර සින්දුවේ නම ඇතුළත් කරන්න!* (Ex: .lyrics Imagine Dragons Believer)");
        await reply(`*🔎 "${q}" සින්දුවේ පද පේළි සොයමින් පවතියි...*`);

        const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(q)}`);
        
        if (!res.data || !res.data.lyrics) return reply("*❌ මෙම සින්දුවේ පද පේළි සොයාගැනීමට නොහැකි විය!*");

        const msg = `╭─── « *SONG LYRICS* » ───⟡
│
│ 🎶 *Title:* ${res.data.title}
│ 👤 *Artist:* ${res.data.artist}
│
╰───────────────⟡

${res.data.lyrics}

> © JANIYAZZZ MD V1`;

        if (res.data.image) {
            await conn.sendMessage(from, { image: { url: res.data.image }, caption: msg }, { quoted: mek });
        } else {
            await reply(msg);
        }

    } catch (e) {
        console.error(e);
        reply("*❌ Lyrics සොයාගැනීමට නොහැකි විය!*");
    }
});
