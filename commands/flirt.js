const flirtLines = [
    "Are you a magician? Because every time I look at you, everyone else disappears into thin air. 🎩✨",
    "Do you have a map? Because I keep getting utterly lost in those dreamy eyes of yours! 🗺️💖",
    "Is your name Google? Because you’ve got everything I’ve been searching for—no filters necessary! 🔍😏",
    "Do you believe in love at first sight, or should I walk by and give you a second chance? 💘👀",
    "If you were a vegetable, you'd be a cute-cumber, and I'm all about that healthy lifestyle! 🥒😉",
    "Are you a parking ticket? Because you've got ‘FINE’ written all over you—and I’m checking it out! 🚗💌",
    "Is your dad a baker? Because you’re a whole cutie pie fresh out of the oven! 🥧💞",
    "Do you have a Band-Aid? Because I just scraped my knee falling head over heels for you. 💔🩹",
    "If beauty were time, you'd be an eternity—and I’d happily lose track of it with you! ⏳💓",
    "Are you Wi-Fi? Because I’m feeling an undeniable connection—let's upgrade this to high-speed! 📶❤️",

    // Additional flirt lines
    "Are you French? Because Eiffel for you—let’s build some romantic bridges! 🇫🇷😍",
    "Can you lend me a kiss? I promise to return it after the perfect moment. 😘💋",
    "Do you believe in fate? Because I think destiny just dropped us off at the same spot! 🍀💕",
    "Are you a campfire? Because you're smoking hot and I want s'more marshmallows with you! 🔥❤️",
    "If I could rearrange the alphabet, U and I would be snugly next to each other (like BFFs!). 🔠✨",
    "Are you a snowstorm? Because my heart races faster every time you're near! ❄️❤️",
    "Is your name Chapstick? Because baby, you're da balm—I can't resist your charm! 💄😘",
    "Excuse me, but did it hurt when you dropped from heaven? Because I'm still picking up my jaw! 😲🙌",
    "Are you a time traveler? Because in my dreams, you're always in my future! ⏳🌟",
    "Your hand looks heavy—let me lift that for you and steal your heart while I'm at it! 🤚💘",
    "Are you a bank loan? Because you've definitely got my interest skyrocketing. 💸😍",
    "Do you have a sunburn, or are you just naturally sizzling hot like summer? ☀️🔥",
    "Are you an angel? Because heaven must be missing its brightest star—let’s shine together! 👼🌙",
    "You must be made of copper and tellurium because you're Cu-Te—and I’m conducting some serious feelings here! 🧪💖",
    "Are you tired? Because you've been running through my thoughts since I've met you. 💤💓",
    "Do you have a mirror in your pocket? Because every time I look at you, I see the love of my life reflected back! 🪞💝",
    "You're like fine wine; the more I admire you, the better the experience gets. 🍷😍",
    "Can we take a picture together? So I can show my friends that angels truly exist on Earth! 📸👼✨",
    "Did it hurt when you fell from heaven? Or are we just meant to fall together now? 👼💔",
    "Are you a camera? Because every time I see your face, it captures my heart perfectly. 📷❤️",
    "Are we at a parking lot? Because I've searched my whole life for someone like you – now I'm done looking! 🚗💖",
    "Is your dad an artist? Because you're an absolute masterpiece that deserves to be cherished. 🎨💕",

   // Adding some more...
   "You must be exhausted—running through my dreams all night must take its toll! 😴💓", 
   "Are you a light bulb? Because your presence brightens even the darkest days—let’s shine bright together! 💡✨", 
   "I must be a snowflake because I've fallen head over heels for someone as unique as you. ❄️❤️", 
   "You’re so sweet I'm worried about getting diabetes from all this sweetness around me—care to balance it out with some spice? 🍬🔥", 
   "Do I know your name or can I simply call you mine for eternity? 🌌💖", 
   "Are you gravity? Because with every moment, you're irresistibly pulling me closer to your orbit. 🌍🌠"
];

async function flirtCommand(sock, chatId) {
   const randomFlirt = flirtLines[Math.floor(Math.random() * flirtLines.length)];
   await sock.sendMessage(chatId, { text: `${randomFlirt}` });
}

module.exports = { flirtCommand };