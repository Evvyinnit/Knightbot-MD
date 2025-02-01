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

        // Convert emojis to Unicode format (Google API requires Unicode)
        function toUnicode(emoji) {
            return [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
        }

        const emoji1Code = toUnicode(emoji1);
        const emoji2Code = toUnicode(emoji2);

        // Step 1: Fetch valid emoji mixes from Google's Emoji Kitchen API
        const googleApi = `https://www.gstatic.com/android/keyboard/emojikitchen/v1/${emoji1Code}/${emoji1Code}_${emoji2Code}.png`;

        // Check if image exists
        const response = await fetch(googleApi);
        if (!response.ok) {
            await sock.sendMessage(chatId, { 
                text: '❌ These emojis cannot be mixed! Try different ones.' 
            });
            return;
        }

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const tempFile = path.join(tmpDir, `temp_${Date.now()}.png`);
        const outputFile = path.join(tmpDir, `sticker_${Date.now()}.webp`);

        const buffer = await response.buffer();
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
