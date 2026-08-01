const { cmd } = require('../command');
const axios = require('axios');

// Movie details/search data store කරන්න temporary storage එකක්
const searchResults = new Map();

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

        // Movie Data Fetching via OMDb
        const omdbApiKey = process.env.OMDB_API_KEY || "76cb82e7";
        const omdbRes = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&plot=full&apikey=${omdbApiKey}`).catch(() => null);

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
│ 🎬 *JANIYAZZZ MD MOVIE DOWNLOADER* 🎬
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

> *Powered by ᴊᴀɴɪʏᴀᴢᴢᴢ ᴍᴅ*`;

        let posterUrl = (movieData.image && movieData.image !== "N/A") 
            ? movieData.image 
            : "https://i.ibb.co/RcdImage.jpg";

        // Message එක send කිරීම
        const sentMsg = await conn.sendMessage(from, {
            image: { url: posterUrl },
            caption: caption
        }, { quoted: mek });

        // User reply එක identify කරගන්න message details map එකට දා ගැනීම
        searchResults.set(sentMsg.key.id, {
            title: movieData.title,
            from: from
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message || e}`);
    }
});

// Reply එක handle කරන කොටස (1-4 reply කරද්දී download කිරීමට)
cmd({
    on: "text"
},
async (conn, mek, m, { from, body, isGroup, reply }) => {
    try {
        const quotedId = mek.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (!quotedId || !searchResults.has(quotedId)) return;

        const movieInfo = searchResults.get(quotedId);
        const choice = body.trim();

        // Quality Map
        const qualityMap = {
            "1": "360",
            "2": "480",
            "3": "720",
            "4": "1080"
        };

        if (!qualityMap[choice]) return;

        const selectedQuality = qualityMap[choice];
        const apiKey = "zan_bcBMA3Yv_3o4jw0eny7";

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply(`⏳ *Downloading ${movieInfo.title} (${selectedQuality}p)... Please wait!*`);

        // Dynamic API Request
        const apiUrl = `https://api.zanta-mini.store/api/ytdl?apiKey=${apiKey}&url=${encodeURIComponent(movieInfo.title)}&type=mp4&quality=${selectedQuality}`;
        const response = await axios.get(apiUrl).catch(() => null);

        if (response && response.data && response.data.result && response.data.result.downloadUrl) {
            const videoUrl = response.data.result.downloadUrl;

            // Video එක Chat එකට යැවීම
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `🎬 *${movieInfo.title}*\n📐 *Quality:* ${selectedQuality}p\n\n> Powered by JANIYAZZZ-MD`
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            
            // Map එකෙන් remove කිරීම
            searchResults.delete(quotedId);
        } else {
            reply("❌ *ලබාදුන් Quality එකට අදාළ Video එක සොයාගැනීමට නොහැකි විය!*");
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Download Error:* ${e.message || e}`);
    }
});
