const { cmd } = require('../command');
const axios = require('axios');

// Fast in-memory tracking
const searchResults = new Map();

// Fast Request ලබාගැනීමට Axios instance එකක් සාදාගැනීම
const http = axios.create({ timeout: 15000 });

cmd({
    pattern: "cinesubz",
    alias: ["movie", "mv", "cinesubz", "sinhalasubz", "baiscope", "sublk", "anime", "k drama", "cartoon"],
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

        // Fast Loading reaction
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // Fast Fetch via OMDb
        const omdbApiKey = process.env.OMDB_API_KEY || "76cb82e7";
        const omdbRes = await http.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&plot=full&apikey=${omdbApiKey}`).catch(() => null);

        if (!omdbRes || !omdbRes.data || omdbRes.data.Response === "False") {
            return reply("❌ *ලබාදුන් නමට අදාළ Movie/Show එක සොයාගැනීමට නොහැකි විය. නම නැවත පරීක්ෂා කරන්න!*");
        }

        const movieData = {
            title: omdbRes.data.Title,
            year: omdbRes.data.Year,
            rating: omdbRes.data.imdbRating,
            runtime: omdbRes.data.Runtime,
            category: omdbRes.data.Genre,
            plot: omdbRes.data.Plot,
            image: omdbRes.data.Poster
        };

        // Layout
        let caption = 
`╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 🎬 *JANIYAZZ MD MOVIE DOWNLOADER* 🎬
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Title:* ${movieData.title} (${movieData.year})

⭐ *IMDb Rating:* ${movieData.rating} / 10

🎭 *Category / Site:* ${command.toUpperCase()}

⏱️ *Runtime:* ${movieData.runtime}

📅 *Released / Type:* ${movieData.category}


📖 *STORYLINE / PLOT:*
─────────────────────────────
${movieData.plot}


📥 *DOWNLOAD OPTIONS:*
─────────────────────────────
 1️⃣  │  360p SD Quality   *(Standard)*

 2️⃣  │  480p SD Quality   *(Medium)*

 3️⃣  │  720p HD Quality   *(High)*

 4️⃣  │  1080p Full HD     *(Ultra)*


─────────────────────────────
👉 *Reply with the quality number (1-4) to download.*

👤 *Requested By:* ${pushname}

> *Powered by JANIYAZZ-MD*`;

        let posterUrl = (movieData.image && movieData.image !== "N/A") 
            ? movieData.image 
            : "https://i.ibb.co/RcdImage.jpg";

        const sentMsg = await conn.sendMessage(from, {
            image: { url: posterUrl },
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;

        // Map එකට Save කිරීම
        searchResults.set(msgId, {
            title: movieData.title,
            from: from
        });

        // Speed Optimization: විනාඩි 5කට පසු Memory Auto-Clear වීම
        setTimeout(() => {
            if (searchResults.has(msgId)) {
                searchResults.delete(msgId);
            }
        }, 5 * 60 * 1000);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message || e}`);
    }
});

// Reply Handler (1-4 speed download)
cmd({
    on: "text"
},
async (conn, mek, m, { from, body, reply }) => {
    try {
        const quotedId = mek.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (!quotedId || !searchResults.has(quotedId)) return;

        const choice = body.trim();

        // Quality Mapping (360, 480, 720, 1080)
        const qualityMap = {
            "1": "360p",
            "2": "480p",
            "3": "720p",
            "4": "1080p"
        };

        if (!qualityMap[choice]) return;

        const movieInfo = searchResults.get(quotedId);
        const selectedQuality = qualityMap[choice];
        const apiKey = "zan_bcBMA3Yv_3o4jw0eny7";

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply(`⏳ *Downloading ${movieInfo.title} (${selectedQuality}p)... Please wait!*`);

        // Fast API Request with Timeout
        const apiUrl = `https://api.zanta-mini.store/api/ytdl?apiKey=${apiKey}&url=${encodeURIComponent(movieInfo.title)}&type=mp4&quality=${selectedQuality}`;
        const response = await http.get(apiUrl, { timeout: 30000 }).catch(() => null);

        if (response && response.data && response.data.result && response.data.result.downloadUrl) {
            const videoUrl = response.data.result.downloadUrl;

            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `🎬 *${movieInfo.title}*\n📐 *Quality:* ${selectedQuality}p\n\n> Powered by JANIYAZZ-MD`
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            
            // Clean memory
            searchResults.delete(quotedId);
        } else {
            reply("❌ *ලබාදුන් Quality එකට අදාළ Video එක සොයාගැනීමට නොහැකි විය!*");
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Download Error:* ${e.message || e}`);
    }
});
