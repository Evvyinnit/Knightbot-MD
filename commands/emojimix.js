const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function emojimixCommand(sock, chatId, msg) {
    try {
        // Get the text after the command
        const text = msg.message?.conversation?.trim() || 
                    msg.message?.extendedTextMessage?.text?.trim() || '';
        
        // Ensure the text contains a single emoji
        const emoji = text.split(' ')[1]?.trim();

        if (!emoji) {
            await sock.sendMessage(chatId, { 
                text: '✳️ Please provide a valid emoji after the command.\n\n📌 Example: .emojimix 😎' 
            });
            return;
        }

        // Convert emoji to Unicode
        function toUnicode(emoji) {
            return [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
        }

        const emojiCode = toUnicode(emoji);

        // URL to fetch emoji image (Emoji Kitchen API)
        const googleApiUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/v1/${emojiCode}.png`;

        // Fetch the image URL for the single emoji
        const response = await fetch(googleApiUrl);
        if (!response.ok) {
            await sock.sendMessage(chatId, { 
                text: '❌ Could not fetch the emoji image! Try a different emoji.' 
            });
            return;
        }

        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Define temporary file paths
        const tempFile = path.join(tmpDir, `temp_${Date.now()}.png`);
        const outputFile = path.join(tmpDir, `sticker_${Date.now()}.webp`);

        // Download the image and save it
        const buffer = await response.buffer();
        fs.writeFileSync(tempFile, buffer);

        // Convert the image to WebP using ffmpeg
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

        // Ensure the WebP sticker file exists
        if (!fs.existsSync(outputFile)) {
            throw new Error('Failed to create sticker file');
        }

        // Send the sticker
        const stickerBuffer = fs.readFileSync(outputFile);
        await sock.sendMessage(chatId, { 
            sticker: stickerBuffer 
        }, { quoted: msg });

        // Clean up temporary files
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outputFile);

    } catch (error) {
        console.error('Error in emojimix command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to convert emoji to sticker. Please ensure you are using a valid emoji.\n\nExample: .emojimix 😎' 
        });
    }
}

module.exports = emojimixCommand;
