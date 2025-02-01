const fetch = require('node-fetch');

async function getLyrics(songTitle) {
    try {
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        return json.lyrics || null;
    } catch (error) {
        console.error('Lyrics.ovh failed:', error.message);
        return null;
    }
}

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { text: '❌ Please provide a song title!' });
        return;
    }

    try {
        const lyrics = await getLyrics(songTitle);

        if (!lyrics) {
            await sock.sendMessage(chatId, { text: '❌ Lyrics not found for this song!' });
            return;
        }

        const lyricsText = `*🎵 ${songTitle}*\n\n${lyrics}\n\n_Powered by Lyrics.ovh_`;

        await sock.sendMessage(chatId, {
            text: lyricsText,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        });

    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { text: `❌ The lyrics service is currently unavailable.\n\nError: ${error.message}` });
    }
}

module.exports = { lyricsCommand };