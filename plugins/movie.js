const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "movie",
    alias: ["film", "mv", "sinhalasub"],
    desc: "Search details and download options for movies",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, pushname }) => {
    try {
        if (!q) {
            return reply(
                "⚠️ *MOVIE NAME IS MISSING!*\n\n" +
                "📌 *Usage:* `.movie <movie name>`\n" +
                "💡 *Example:* `.movie Inception`"
            );
        }

        // Loading reaction
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // Fetching Movie Details
        const apiKey = "76cb82e7"; 
        const apiUrl = `https://api.zanta-mini.store/api/ytdl?apiKey=zan_bcBMA3Yv_3o4jw0eny7&url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D0geqOYqwL0s&type=mp4&quality=360${encodeURIComponent(q)}&plot=full&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        const movie = response.data;

        if (movie.Response === "False") {
            return reply("❌ *Movie එක හොයාගන්න ලැබුණේ නැත! නම නැවත පරීක්ෂා කරන්න.*");
        }

        // Clean & Beautiful Layout with Header and Footer
        let caption = 
`╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 🎬 *JANIYAZZZ MD MOVIE DOWNLOADER* 🎬
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Title:* ${movie.Title} (${movie.Year})

⭐ *IMDb Rating:* ${movie.imdbRating} / 10

🎭 *Genre:* ${movie.Genre}

⏱️ *Runtime:* ${movie.Runtime}

🎬 *Director:* ${movie.Director}

👥 *Cast:* ${movie.Actors}

🌍 *Language:* ${movie.Language}

📅 *Released:* ${movie.Released}


📖 *STORYLINE / PLOT:*
─────────────────────────────
${movie.Plot}


📥 *DOWNLOAD OPTIONS:*
─────────────────────────────
 1️⃣  │  360p SD Quality   *(Standard)*

 2️⃣  │  480p SD Quality   *(Medium)*

 3️⃣  │  720p HD Quality   *(High)*

 4️⃣  │  1080p Full HD     *(Ultra)*


─────────────────────────────
👉 *Reply with the quality number (1-4) to download.*

👤 *Requested By:* ${pushname}

> *Powered by ᴊᴀɴɪʏᴀᴢᴢᴢ ᴍᴅ*`;

        // Check Poster Image
        let posterUrl = (movie.Poster && movie.Poster !== "N/A") 
            ? movie.Poster 
            : "https://i.ibb.co/RcdImage.jpg";

        // Send Poster with Caption
        await conn.sendMessage(from, {
            image: { url: posterUrl },
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message || e}`);
    }
});
