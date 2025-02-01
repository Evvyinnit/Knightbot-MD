async function githubCommand(sock, chatId) {
    const repoInfo = `*🤖 Selina Kayle*

*📂 GitHub Repository:*
https://github.com/Evvyinnit/SelinaKayle

*📢 Official Channel:*
https://youtube.com/@evvyxan

_Star ⭐ the repository if you like the bot!_`;

    try {
        await sock.sendMessage(chatId, {
            text: repoInfo,
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
        console.error('Error in github command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error fetching repository information.' 
        });
    }
}

module.exports = githubCommand; 
