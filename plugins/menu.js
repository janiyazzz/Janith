const { cmd, commands } = require('../command'); 
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/cSy6TwFH/e995c6e2a1cb.jpg";

const logoTypes = [
    "neon","neon2","fire2","glitch","hacker","futuristic","thunder","devil",
    "fire","ice","snow","lava","metal","gold","silver","glossy","blackpink",
    "transformer","horror","blood","joker","galaxy","space","cloud","sand",
    "stone","magma","gradient","light","paper","watercolor","candy","christmas",
    "luxury","leaf","summer","circuit","block3d","cartoon","chrome","frozen"
];

// ------------------- MAIN MENU COMMAND -------------------
cmd({
    pattern: "menu",
    alias: ["menu", "panel", "commands", "list", "menu"],
    desc: "Show main menu.",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const ramUsed = ((totalMem - freeMem) / 1024 / 1024).toFixed(2);
        const ramTotal = Math.round(totalMem / 1024 / 1024);
        const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;

        const uptimeSeconds = process.uptime();
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
        const rtime = `${uptimeHours}h ${uptimeMinutes}m`;

        const time = parseInt(moment.tz('Asia/Colombo').format('HH'), 10);
        let greeting = "Good Night";
        if (time >= 4 && time < 12) greeting = "Good Morning";
        else if (time >= 12 && time < 17) greeting = "Good Afternoon";
        else if (time >= 17 && time < 20) greeting = "Good Evening";

        const hostName = os.hostname();
        let hostname = 'VPS / Local';
        if (hostName.length === 12) hostname = 'Replit';
        else if (hostName.length === 36) hostname = 'Heroku';
        else if (hostName.length === 8) hostname = 'Koyeb';

        const menuText = `╭─── « 𝐉ᴀɴɪʏᴀᴢᴢᴢ 𝐌ᴅ 𝐯𝟏 » ───⟡
│
│ ⊳ *𝗛𝗶 ${pushname || 'User'}, ${greeting}!*
│
│ ◈ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.0
│ ◈ 𝗢𝘄𝗻𝗲𝗿  : MR.JANITH SACHINTHA
│ ◈ 𝗥𝗮𝗺    : ${ramUsage}
│ ◈ 𝗨𝗽𝘁𝗶𝗺𝗲 : ${rtime}
│ ◈ 𝗛𝗼𝘀𝘁   : ${hostname}
│
╰───────────────⟡

╭─── « 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗣𝗔𝗡𝗘𝗟 » ───⟡
│
│ [ 𝟭 ] 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨
│ [ 𝟮 ] 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨
│ [ 𝟯 ] 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨
│ [ 𝟰 ] 𝗟𝗢𝗚𝗢 𝗠𝗘𝗡𝗨
│ [ 𝟱 ] 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦
│ [ 𝟲 ] 𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨
│ [ 𝟳 ] 𝗔𝗜 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
│ [ 𝟴 ] 𝗢𝗧🇭𝗘𝗥 𝗧𝗢𝗢𝗟𝗦
│
╰───────────────⟡

> _Reply with a number to navigate._`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: botLogo },
            caption: menuText
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": "mainmenu",
            "2": "ownermenu",
            "3": "groupmenu",
            "4": "logomenu",
            "5": "downloadmenu",
            "6": "searchmenu",
            "7": "aimenu",
            "8": "othermenu"
        };

    } catch (e) {
        console.error("Menu Error:", e);
        reply(`*❌ System Error!*\n\n${e.message || e}`);
    }
});

// ------------------- FAST SUBMENU GENERATOR -------------------
const generateSubMenu = async (conn, mek, from, category, title, reply) => {
    try {
        let cmdList = '';

        if (Array.isArray(commands) && commands.length > 0) {
            for (let i = 0; i < commands.length; i++) {
                const c = commands[i];
                if (c && c.category === category && !c.dontAddCommandList) {
                    cmdList += `│ ⊳ *${c.pattern}*\n│   ${c.desc || 'No Description'}\n│\n`;
                }
            }
        }

        if (!cmdList) {
            cmdList = `│ ⊳ No commands found.\n│\n`;
        }

        const menuContent = `╭─── « 𝐉ᴀɴɪʏᴀᴢᴢᴢ 𝐌ᴅ 𝐯𝟏 » ───⟡
│
│ ⊳ *${title}*
│
${cmdList}╰───────────────⟡

> © 𝙹𝙰𝙽𝙸𝚈𝙰𝚉𝚉𝚉 𝙼𝙳 𝚅1`;

        await conn.sendMessage(from, { 
            image: { url: botLogo }, 
            caption: menuContent 
        }, { quoted: mek });

    } catch (e) { 
        console.error("Submenu Error:", e); 
        reply('*❌ Submenu Error !!*'); 
    }
};

// ------------------- LOGO MENU COMMAND -------------------
cmd({ pattern: "logomenu", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, pushname, reply }) => {
    try {
        let logoList = `╭─── « 𝐉ᴀɴɪʏᴀᴢᴢᴢ 𝐌檔 𝐯𝟏 » ───⟡
│
│ ⊳ *𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥 𝗠𝗘𝗡𝗨*
│
`;
        logoTypes.forEach((type, index) => {
            let num = (index + 1).toString().padStart(2, '0');
            logoList += `│ [ ${num} ] ${type.toUpperCase()}\n`;
        });

        logoList += `│
╰───────────────⟡

> _Reply with a number to generate._
> _To set custom name: .logo <name>_

> © 𝙹𝙰𝙽𝙸𝚈𝙰𝚉𝚉𝚉 𝙼𝙳 𝚅1`;

        const sentMsg = await conn.sendMessage(from, { image: { url: botLogo }, caption: logoList }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {};

        logoTypes.forEach((type, index) => {
            global.numberStore[msgId][(index + 1).toString()] = `genlogo ${type}&${pushname || 'User'}`;
        });

    } catch (e) {
        console.error("Logo Menu Error:", e);
        reply('*❌ Logo Menu Error!*');
    }
});

// ------------------- SUBMENU ROUTERS -------------------
cmd({ pattern: "mainmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'main', '𝗠𝗔𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', reply);
});

cmd({ pattern: "ownermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'owner', '𝗢𝗪𝗡𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', reply);
});

cmd({ pattern: "groupmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'group', '𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦', reply);
});

cmd({ pattern: "downloadmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'download', '𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗🇪𝗥𝗦', reply);
});

cmd({ pattern: "searchmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'search', '𝗦𝗘𝗔𝗥𝗖𝗛 𝗧𝗢𝗢𝗟𝗦', reply);
});

cmd({ pattern: "aimenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'ai', '𝗔𝗜 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦', reply);
});

cmd({ pattern: "othermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, { from, reply }) => {
    await generateSubMenu(conn, mek, from, 'other', '𝗢𝗧🇭🇪𝗥 𝗨𝗧𝗜𝗟𝗜𝗧𝗜𝗘𝗦', reply);
});
