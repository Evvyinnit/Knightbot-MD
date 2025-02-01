const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function emojimixCommand(sock, chatId, msg) {
    try {
        // Extract text from message
        const text = msg.message?.conversation?.trim() || 
                    msg.message?.extendedTextMessage?.text?.trim() || '';

        if (!text.includes('+')) {
            await sock.sendMessage(chatId, { 
                text: '✳️ Separate the emoji with a *+* sign\n\n📌 Example: \n*.emojimix* 😎+🥰' 
            });
            return;
        }

        let [emoji1, emoji2] = text.split('+').map(e => e.trim());

        // Step 1: Fetch valid emoji mixes from Google's Emoji Kitchen API
        const googleApi = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ
        &contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

        const response = await fetch(googleApi);
        const json = await response.json();

        if (!json.results || json.results.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ These emojis cannot be mixed! Try different ones.' 
            });
            return;
        }

        const imageUrl = json.results[0].url; // Get emoji mix image URL

        // Step 2: Download and process the image
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const tempFile = path.join(tmpDir, `temp_${Date.now()}.png`);
        const outputFile = path.join(tmpDir, `sticker_${Date.now()}.webp`);

        const imageResponse = await fetch(imageUrl);
        const buffer = await imageResponse.buffer();
        fs.writeFileSync(tempFile, buffer);

        // Convert to WebP using FFmpeg
        const ffmpegCommand = `ffmpeg -i "${tempFile}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" "${outputFile}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) {
                    console.error('FFmpeg error:', error);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // Check if output file exists
        if (!fs.existsSync(outputFile)) {
            throw new Error('Failed to create sticker file');
        }

        // Send the sticker
        const stickerBuffer = fs.readFileSync(outputFile);
        await sock.sendMessage(chatId, { 
            sticker: stickerBuffer 
        }, { quoted: msg });

        // Cleanup temp files
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outputFile);

    } catch (error) {
        console.error('Error in emojimix command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to mix emojis! Make sure you\'re using valid emojis.\n\nExample: .emojimix 😎+🥰' 
        });
    }
}

module.exports = emojimixCommand;
