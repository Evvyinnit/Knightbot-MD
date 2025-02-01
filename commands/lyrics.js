const fetch = require('node-fetch');

async function getLyricsFromSomeRandomAPI(songTitle) {
    try {
        const apiUrl = `https://some-random-api.com/others/lyrics?title=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const json = await res.json();
        return json.lyrics || null;
    } catch (error) {
        console.error('SomeRandomAPI failed:', error.message);
        return null;
    }
}

async function getLyricsFromLyricsOvh(songTitle) {
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

async function getLyricsFromChartLyrics(songTitle) {
    try {
        const apiUrl = `http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=&song=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const text = await res.text();
        const lyricsMatch = text.match(/<Lyric>(.*?)<\/Lyric>/);
        return lyricsMatch ? lyricsMatch[1] : null;
    } catch (error) {
        console.error('ChartLyrics API failed:', error.message);
        return null;
    }
}

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { text: '❌ Please provide a song title!' });
        return;
    }

    try {
        let lyrics =
            (await getLyricsFromSomeRandomAPI(songTitle)) ||
            (await getLyricsFromLyricsOvh(songTitle)) ||
            (await getLyricsFromChartLyrics(songTitle));

        if (!lyrics) {
            await sock.sendMessage(chatId, { text: '❌ Lyrics not found for this song!' });
            return;
        }

        const lyricsText = `*🎵 ${songTitle}*\n\n${lyrics}\n\n_Powered by multiple APIs_`;

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
