const fetch = require('node-fetch');
require('../config.js');

async function lyricsCommand(sock, chatId, songTitle) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please provide a song title!' 
        });
        return;
    }

    try {
        // Validate global API keys
        if (!global.APIs?.xteam || !global.APIKeys?.['https://api.xteam.xyz']) {
            throw new Error('API configuration is missing.');
        }

        const apiUrl = `${global.APIs.xteam}/api/lirik?q=${encodeURIComponent(songTitle)}&apikey=${global.APIKeys['https://api.xteam.xyz']}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            throw new Error(`API responded with status: ${res.status}`);
        }

        const json = await res.json();
        if (!json.result || typeof json.result !== 'string') {
            await sock.sendMessage(chatId, { 
                text: '❌ Lyrics not found for this song!' 
            });
            return;
        }

        const lyricsText = `*🎵 ${songTitle}*\n\n${json.result}\n\n_Powered by XTeam API_`;

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
