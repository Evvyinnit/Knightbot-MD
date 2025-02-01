async function ownerCommand(sock, chatId) {
    const ownerName = "Nimesh D. Bandara"; // Change this to your name
    const ownerNumber = "+94761206570"; // Change this to your WhatsApp number

    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=${ownerNumber}:${ownerNumber}
END:VCARD
`;

    // Batman-Themed Message
    const batmanQuote = `"The night is darkest just before the dawn. And I promise you, the dawn is coming." - Batman`;
    
    const styledMessage = `🦇 *THE DARK KNIGHT'S SIGNAL* 🦇\n\n${batmanQuote}\n\n📞 *Need the Bat? Contact my trusted ally:*`;

    await sock.sendMessage(chatId, {
        contacts: { displayName: ownerName, contacts: [{ vcard }] }
    });

    await sock.sendMessage(chatId, { text: styledMessage });
}

module.exports = { ownerCommand };
