const { cmd } = require('../command');

cmd({
    pattern: "gstatus",
    alias: ["gstatus", "gcstatus"],
    desc: "Get group details and status",
    category: "group",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("*❌ මෙය භාවිතා කළ හැක්කේ සමූහ (Group) තුළ පමණි!*");

        const metadata = await conn.groupMetadata(from);
        const admins = metadata.participants.filter(p => p.admin !== null).length;

        const statusText = `╭─── « *GROUP STATUS* » ───⟡
│
│ ◈ *නම:* ${metadata.subject}
│ ◈ *ID:* ${metadata.id}
│ ◈ *සාමාජිකයින්:* ${metadata.participants.length}
│ ◈ *Admins ප්‍රමාණය:* ${admins}
│ ◈ *සෑදූ දිනය:* ${new Date(metadata.creation * 1000).toLocaleDateString('si-LK')}
│ ◈ *Group Owner:* @${metadata.owner ? metadata.owner.split('@')[0] : 'නොදනී'}
│
╰───────────────⟡

> © JANIYAZZZ MD V1`;

        await conn.sendMessage(from, { 
            text: statusText, 
            mentions: metadata.owner ? [metadata.owner] : [] 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("*❌ Group Status ලබාගැනීමට නොහැකි විය!*");
    }
});
