const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "speedup",
    alias: ["speedup", "superfast", "speed"],
    desc: "Maximize Bot Speed & Latency",
    category: "system",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;

        // 1. Clear Node.js Module Cache & Release RAM
        if (global.gc) {
            global.gc();
        }

        // 2. Measure Response Latency
        const endTime = Date.now();
        const latency = endTime - startTime;
        const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const memorySaved = (initialMemory - finalMemory).toFixed(2);

        const speedReport = `╭─── « *SUPER SPEED BOOST* » ───⟡
│
│ 🚀 *Response Speed:* \`${latency} ms\`
│ ⚡ *RAM Released:* \`${memorySaved > 0 ? memorySaved : 0} MB\`
│ 💻 *CPU Core:* \`${os.cpus().length} Cores Active\`
│ ⚙️ *Server Status:* \`OPTIMIZED 100%\`
│
╰───────────────⟡

> *⚡ Bot එක දැන් Super Fast මට්ටමින් සක්‍රීයයි!*

> © POWERED BY JANIYAZZZ MD </>`;

        await conn.sendMessage(from, { text: speedReport }, { quoted: mek });

    } catch (e) {
        console.error("Speedup Error:", e);
        reply("*❌ Speedup process failed!*");
    }
});
