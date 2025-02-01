async function ownerCommand(sock, chatId) {
    const ownerName = "Nimesh D. Bandara";
    const ownerNumber = "+94761206570@s.whatsapp.net"; // Correct WhatsApp format

    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=94761206570:94761206570
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
