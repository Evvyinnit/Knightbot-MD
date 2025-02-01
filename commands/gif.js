const axios = require('axios');
const settings = require('../settings'); // Ensure API key is loaded from this file

async function gifCommand(sock, chatId, query) {
    const apiKey = settings.giphyApiKey; // Giphy API Key

    // Check if query is provided
    if (!query) {
        await sock.sendMessage(chatId, { text: 'Please provide a search term for the GIF.' });
        return;
    }

    try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: query,
                limit: 1,
                rating: 'g'
            }
        });

        // Check if we have any GIFs in the response
        const gifUrl = response.data.data[0]?.images?.downsized_medium?.url;

        if (gifUrl) {
            // Send the GIF as a video with a caption
            await sock.sendMessage(chatId, { video: { url: gifUrl }, caption: `Here is your GIF for "${query}"` });
        } else {
            await sock.sendMessage(chatId, { text: 'No GIFs found for your search term.' });
        }
    } catch (error) {
        console.error('Error fetching GIF:', error);

        // Handle different error scenarios with more granularity if needed
        if (error.response) {
            await sock.sendMessage(chatId, { text: `Error fetching GIF from Giphy: ${error.response.status}` });
        } else if (error.request) {
            await sock.sendMessage(chatId, { text: 'No response received from Giphy.' });
        } else {
            await sock.sendMessage(chatId, { text: 'Failed to fetch GIF. Please try again later.' });
        }
    }
}

module.exports = gifCommand;