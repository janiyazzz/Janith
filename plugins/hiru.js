const { cmd } = require('../command');
const { execSync } = require('child_process');

// Railway එකේ auto package install කරගැනීමට
let axios, cheerio;
try {
    axios = require('axios');
} catch (e) {
    execSync('npm install axios');
    axios = require('axios');
}

try {
    cheerio = require('cheerio');
} catch (e) {
    execSync('npm install cheerio');
    cheerio = require('cheerio');
}

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

        let newsData = null;

        // Method 1: Web Scraping (Most Reliable)
        try {
            const res = await axios.get('https://www.hirunews.lk/sinhala/local-news.php', {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 5000
            });
            const $ = cheerio.load(res.data);
            const first = $('.all-news-block').first();
            const title = first.find('.news-title a, .all-news-title a').text().trim();
            const link = first.find('.news-title a, .all-news-title a').attr('href');
            const img = first.find('img').attr('src');

            if (title) {
                newsData = { title, desc: 'Hiru Sinhala News Direct Web Scraping', link, img };
            }
        } catch (err) {
            console.log("Scraping failed, trying API 1...");
        }

        // Method 2: Backup API 1
        if (!newsData) {
            try {
                const api1 = await axios.get('https://dark-yasiya-news-api.vercel.app/hiru', { timeout: 5000 });
                if (api1.data && api1.data.result) {
                    const r = api1.data.result;
                    newsData = {
                        title: r.title,
                        desc: r.desc || r.news || 'විස්තර ලබාගත නොහැක.',
                        link: r.url || r.link || '',
                        img: r.image
                    };
                }
            } catch (err) {
                console.log("API 1 failed, trying API 2...");
            }
        }

        // Method 3: Backup API 2
        if (!newsData) {
            try {
                const api2 = await axios.get('https://news-api-virid.vercel.app/hiru', { timeout: 5000 });
                if (api2.data && api2.data.result) {
                    const r = api2.data.result;
                    newsData = {
                        title: r.title,
                        desc: r.news || r.description || 'විස්තර ලබාගත නොහැක.',
                        link: '',
                        img: r.image
                    };
                }
            } catch (err) {
                console.log("API 2 failed...");
            }
        }

        // Check if any method worked
        if (!newsData || !newsData.title) {
            return reply("*❌ මේ මොහොතේ Hiru News Server එක සමඟ සම්බන්ධ වීමට නොහැක. පසුව නැවත උත්සාහ කරන්න.*");
        }

        const caption = `╭─── « *HIRU LATEST NEWS* » ───⟡
│
│ 📰 *${newsData.title}*
│
│ 📝 ${newsData.desc}
│
${newsData.link ? `│ 🔗 *Read More:* ${newsData.link}\n` : ''}╰───────────────⟡

> © JANIYAZZZ MD V1`;

        if (newsData.img) {
            await conn.sendMessage(from, { image: { url: newsData.img }, caption: caption }, { quoted: mek });
        } else {
            await reply(caption);
        }

    } catch (e) {
        console.error("Hiru Error:", e);
        reply("*❌ Hiru News ලබාගැනීමේදී දෝෂයක් සිදු විය!*");
    }
});
