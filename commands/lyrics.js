const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please provide a song title!' 
        });
        return;
    }

    try {
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json.lyrics) {
            await sock.sendMessage(chatId, { 
                text: '❌ Lyrics not found for this song!' 
            });
            return;
        }

        const lyricsText = `*🎵 ${songTitle}*\n\n${json.lyrics}\n\n_Powered by Lyrics.ovh_`;

        await sock.sendMessage(chatId, {
            text: lyricsText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ The lyrics service is currently unavailable. Please try again later.' 
        });
    }
}

module.exports = { lyricsCommand };
