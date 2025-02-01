async function emojimixCommand(sock, chatId, msg) {
    try {
        // Get the emoji from the message
        const text = msg.message?.conversation?.trim() || 
                    msg.message?.extendedTextMessage?.text?.trim() || '';
        
        const emoji = text.split(' ')[1]?.trim(); // Extract emoji from the message after .emojimix

        if (!emoji) {
            await sock.sendMessage(chatId, { 
                text: '✳️ Please provide a valid emoji after the command.\n\n📌 Example: .emojimix 😎' 
            });
            return;
        }

        // Convert the emoji into a sticker by sending it as a sticker
        await sock.sendMessage(chatId, {
            sticker: emoji, // Send the emoji directly as a sticker
        }, { quoted: msg });

    } catch (error) {
        console.error('Error in emojimix command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to convert emoji to sticker. Please ensure you are using a valid emoji.\n\nExample: .emojimix 😎' 
        });
    }
}

module.exports = emojimixCommand;
