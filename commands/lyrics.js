const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please provide a song title!' 
        });
        return;
    }

    try {
        // Fetch lyrics from ChartLyrics API (No API key needed)
        const apiUrl = `https://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=&song=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        const text = await res.text();

        // Extract lyrics from XML response
        const match = text.match(/<Lyric>(.*?)<\/Lyric>/s);
        const lyrics = match ? match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : null;

        if (!lyrics) {
            await sock.sendMessage(chatId, { 
                text: '❌ Lyrics not found for this song!' 
            });
            return;
        }

        const lyricsText = `*🎵 ${songTitle}*\n\n${lyrics}\n\n_Powered by ChartLyrics API_`;

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
