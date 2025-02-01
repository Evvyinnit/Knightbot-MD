const settings = require('../settings');

async function ownerCommand(sock, chatId) {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Bruce Wayne
N:Wayne;Bruce;;;
ORG:Wayne Enterprises
TITLE:CEO and The Dark Knight
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
EMAIL:bruce.wayne@wayneenterprise.com
URL:https://www.batman.com
ADR;TYPE=WORK:;;1007 Mountain Drive;Gotham City;Gotham;10001;USA
NOTE:Protecting Gotham City as The Dark Knight.\nCaped Crusader at night, billionaire by day.
END:VCARD
`;

    await sock.sendMessage(chatId, {
        contacts: {
            displayName: `🦇 ${settings.botOwner} - The Caped Crusader 🦇`, 
            contacts: [{ vcard }]
        },
    });
}

module.exports = ownerCommand;