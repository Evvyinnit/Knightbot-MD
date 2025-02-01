const settings = require('../settings');

async function ownerCommand(sock, chatId) {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Batman, The Dark Knight
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`;

    await sock.sendMessage(chatId, {
        contacts: { displayName: `${settings.botOwner} - The Caped Crusader`, contacts: [{ vcard }] },
    });
}

module.exports = ownerCommand;