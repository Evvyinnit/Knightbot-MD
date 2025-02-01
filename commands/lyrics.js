const fetch = require('node-fetch');
require('../config.js');

const GENIUS_API_KEY = global.APIKeys['https://api.genius.com']; // Make sure your config has this

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please provide a song title!' 
        });
        return;
    }

    try {
        if (!GENIUS_API_KEY) {
            throw new Error('Missing Genius API Key.');
        }

        // Step 1: Search for the song
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(songTitle)}&access_token=${GENIUS_API_KEY}`;
        const searchRes = await fetch(searchUrl);
        const searchJson = await searchRes.json();

        if (!searchJson.response.hits.length) {
            await sock.sendMessage(chatId, { 
                text: '❌ No lyrics found for this song!' 
            });
            return;
        }

        // Step 2: Get the first result
        const song = searchJson.response.hits[0].result;
        const lyricsPageUrl = song.url; // Genius does not provide raw lyrics via API

        const lyricsText = `*🎵 ${songTitle}*\n\nLyrics are available at: ${lyricsPageUrl}\n\n_Powered by Genius API_`;

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
