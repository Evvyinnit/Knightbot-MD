async function aliveCommand(sock, chatId) {
    try {
        const message = `🌈 *🤖 පනපිටිං තාම 😎!*\n\n` +
                        `✨ *Version:* 1.0.0\n` +
                        `🌟 *Status:* Online\n` +
                        `⚡ *Mode:* Public\n\n` +
                        `🚀 *🌟 Features:*\n` +
                        `   • 🎉 Group Management\n` +
                        `   • 🔗 Antilink Protection\n` +
                        `   • 😂 Fun Commands\n` +
                        `   • 📚 And more!\n\n` +
                        `👉 *For the full command list, just type* *.menu* 😏✨`;

        await sock.sendMessage(chatId, {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: 'Selina Kayle',
                    serverMessageId: -1
                }
            }
        });
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '😒 මැරිලා නෑ 😝' });
    }
}

module.exports = aliveCommand;
