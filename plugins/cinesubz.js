const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "cinesubz",
    alias: ["cinesub", "sinhalasubz", "baiscope", "sublk", "anime", "k drama", "cartoon"],
    desc: "Search movies and series from Sinhala sub sites",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, pushname, command }) => {
    try {
        if (!q) {
            return reply(
                "⚠️ *MOVIE OR TV SHOW NAME IS MISSING!*\n\n" +
                "📌 *Usage:* `." + command + " <name>`\n" +
                "💡 *Example:* `." + command + " Solo Leveling`"
            );
        }

        // Loading status
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // Multi-Source Search API
        const apiUrl = `https://www.movanest.xyz/v2/movie?query=${encodeURIComponent(q)}&site=${encodeURIComponent(command)}`;
        const response = await axios.get(apiUrl).catch(() => null);
        
        // Fallback search via OMDb API if site API is unavailable
        let movieData = null;
        if (response && response.data && response.data.results && response.data.results.length > 0) {
            movieData = response.data.results[0];
        } else {
            const omdbRes = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&plot=full&apikey=76cb82e7`);
            if (omdbRes.data && omdbRes.data.Response !== "False") {
                movieData = {
                    title: omdbRes.data.Title,
                    year: omdbRes.data.Year,
                    rating: omdbRes.data.imdbRating,
                    runtime: omdbRes.data.Runtime,
                    category: omdbRes.data.Genre,
                    plot: omdbRes.data.Plot,
                    image: omdbRes.data.Poster
                };
            }
        }

        if (!movieData) {
            return reply("❌ *ලබාදුන් නමට අදාළ Movie/Show එක සොයාගැනීමට නොහැකි විය. නම නැවත පරීක්ෂා කරන්න!*");
        }

        // Clean & Spaced Beautiful Layout
        let caption = 
`╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 🎬 *JANIYAZZZ MD MOVIE DOWNLOADER* 🎬
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Title:* ${movieData.title || q} (${movieData.year || 'N/A'})

⭐ *IMDb Rating:* ${movieData.rating || 'N/A'} / 10

🎭 *Category / Site:* ${command.toUpperCase()}

⏱️ *Runtime:* ${movieData.runtime || 'N/A'}

📅 *Released / Type:* ${movieData.category || 'Movie / Series'}


📖 *STORYLINE / PLOT:*
─────────────────────────────
${movieData.plot || 'No storyline description available.'}


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

        let posterUrl = (movieData.image && movieData.image !== "N/A") 
            ? movieData.image 
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
