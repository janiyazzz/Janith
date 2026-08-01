const { cmd } = require('../command');

cmd({
    pattern: "save",
    alias: ["save","sv"],
    desc: "Save status or media to your DM",
    category: "other",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {
        if (!m.quoted) return reply("*❌ කරුණාකර Save කර ගැනීමට අවශ්‍ය Status/Media එකට Reply කරන්න!*");

        // Forward the quoted message directly to the user's Inbox
        await conn.forwardMessage(m.sender, m.quoted.fakeObj, true);
        reply("*✅ ඔබගේ Inbox (DM) එකට Send කරන ලදී!*");

    } catch (e) {
        console.error(e);
        reply("*❌ Save කිරීමට නොහැකි විය!*");
    }
});
