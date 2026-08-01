const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "novel",
    alias: ["book", "novel"],
    desc: "Search internet for books and novel details",
    category: "download",
    react: "📚",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*❌ කරුණාකර Novel එකේ හෝ පොතේ නම ලබාදෙන්න!*");
        await reply(`*📚 "${q}" පිළිබඳ තොරතුරු සොයමින් පවතී...*`);

        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`);
        
        if (!res.data.items || res.data.items.length === 0) {
            return reply("*❌ කිසිදු Novel/Book එකක් සොයාගැනීමට නොහැකි විය!*");
        }

        const book = res.data.items[0].volumeInfo;
        const title = book.title || 'No Title';
        const authors = book.authors ? book.authors.join(', ') : 'Unknown Author';
        const description = book.description ? book.description.slice(0, 300) + '...' : 'No description available.';
        const link = book.infoLink || '';

        const text = `╭─── « *NOVEL / BOOK INFO* » ───⟡
│
│ 📖 *නම:* ${title}
│ ✍️ *කර්තෘ:* ${authors}
│ 📅 *නිකුත් වූ දිනය:* ${book.publishedDate || 'N/A'}
│
│ 📝 *විස්තරය:* │ ${description}
│
│ 🔗 *වැඩිදුර විස්තර:* ${link}
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        const img = book.imageLinks?.thumbnail || null;
        if (img) {
            await conn.sendMessage(from, { image: { url: img }, caption: text }, { quoted: mek });
        } else {
            await reply(text);
        }

    } catch (e) {
        console.error(e);
        reply("*❌ Novel තොරතුරු ලබාගැනීමට නොහැකි විය!*");
    }
});
