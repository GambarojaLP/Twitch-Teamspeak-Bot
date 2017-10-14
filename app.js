//Requires + Global Var's
require('dotenv').config();
var tmi     = require('tmi.js');
const Cactus = require('cactus-ts');
var request = "empty";
//Twitch Verbindung aufbauen
var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: process.env.USER,
        password: process.env.PASS
    },
    channels: [process.env.CHANNEL]
};
var client = new tmi.client(options);
client.connect();
//Bot liest chat mit, falls songrequest kommt = do
client.on("message", function (channel, userstate, message, self) {
    if (self) return;
    if(message.indexOf('!songrequest') == 0) {
        request = message;
    //Das wichtigste aus dem Request rausfiltern
    let regex = /(http|https):\/\/(www\.)?(youtube\.com\/)(watch\?v=|watch\/)(\w){11}((\?|&)[A-z]+=[\w]*)*(#[\w]+)*$/
    req = request.match(regex)
    //Username Random auswählen um Nickname already in use zu vermeiden.
    random = Math.random();
    //Teamspeak Nachricht schicken
    let bot = new Cactus ({
        login: process.env.BOT_NAME,
        ip: process.env.IP,
        password: process.env.QUERY_PASS,
        display_name: random
    })
    if (req!=undefined && req.length > 0) {
        bot.on('ready', () => {
            bot.send('sendtextmessage', {
                target: process.env.TARGET_ID,
                targetmode: 1,
                msg: '!yt [URL]' + req[0] + '[/URL]'
        }, (res) => {
            console.log(res)
            })
        })}
    } else {
        return;
    }
});
