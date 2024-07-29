/*!-======[ Module Imports ]======-!*/
const axios = "axios".import();

/*!-======[ Function Imports ]======-!*/
const { mediafireDl } = await (fol[0] + 'mediafire.js').r();

/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender } = cht;

    ev.on({ 
        cmd: ['pinterestdl', 'pindl'], 
        listmenu: ['pinterestdl'], 
        tag: 'downloader',
        args: "Mana linknya?",
        energy: 5
    }, async () => {
        let q = is.quoted?.url || is.url;
        await cht.reply('```Processing...```');
        
        try {
            let response = await fetch(api.xterm.url + "/api/downloader/pinterest?url=" + q + "&key=" + api.xterm.key);
            
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }

            let jsonResponse = await response.json();
            
            if (!jsonResponse.data) {
                throw new Error("Invalid JSON response");
            }

            let p = jsonResponse.data;
            let pin = Object.values(p.videos)[0].url;
            await Exp.sendMessage(cht.id, { video: { url: pin }, mimetype: "video/mp4" }, { quoted: cht });
            
        } catch (error) {
            if (error.message.includes("Network response was not ok")) {
                await cht.reply("Service is currently unavailable. Please try again later.");
            } else {
                await cht.reply("TypeErr: " + error.message);
            }
        }
    });
    
    ev.on({ 
        cmd: ['mediafire', 'mediafiredl'], 
        listmenu: ['mediafire'], 
        tag: 'downloader',
        args: "Mana linknya?",
        energy: 8 
    }, async () => {
        const _key = key[sender];
        let q = is.quoted?.url || is.url;
        if (!q) return cht.reply("Mana linknya?");
        await cht.edit('```Processing...```', _key);
        try {
            let m = await mediafireDl(q);
            await cht.edit("Checking media type...", _key);
            let { headers } = await axios.get(m.link);
            let type = headers["content-type"];
            await cht.edit("Sending...", _key);
            await Exp.sendMessage(cht.id, { document: { url: m.link }, mimetype: type, fileName: m.title }, { quoted: cht });
            await cht.edit("Success", _key);
        } catch (e) {
            if (e.message.includes("Network response was not ok")) {
                await cht.reply("Service is currently unavailable. Please try again later.");
            } else {
                await cht.edit("TypeErr: " + e.message, _key);
            }
        }
    });

    ev.on({ 
        cmd: ['tiktok', 'tiktokdl', 'tt'], 
        listmenu: ['tiktok', 'ttdl'], 
        tag: 'downloader',
        args: "Mana linknya?",
        energy: 4 
    }, async () => {
        const _key = key[sender];
        if (!(is.quoted?.url || is.url)) return cht.reply("Mana urlnya?");
        let url = is.quoted?.url || is.url;
        if (!(url ? url[0].includes("tiktok.com") : false)) return cht.reply("Itu bukan link tiktok!");
        await cht.edit("Bntr..", _key);
        
        try {
            let response = await fetch(api.xterm.url + "/api/downloader/tiktok?url=" + url[0] + "&key=" + api.xterm.key);
            
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }

            let jsonResponse = await response.json();
            
            if (!jsonResponse.data) {
                throw new Error("Invalid JSON response");
            }

            let data = jsonResponse.data;
            await cht.edit("Lagi dikirim...", _key);
            let type = data.type;
            if (type == 'image') {
                for (let image of data.media) {
                    await Exp.sendMessage(cht.id, { image: { url: image.url } }, { quoted: cht });
                }
            } else if (type == 'video') {
                await Exp.sendMessage(cht.id, { video: { url: data.media[1].url } }, { quoted: cht });
            }
            await cht.edit("Dah tuh", _key);
        } catch (error) {
            if (error.message.includes("Network response was not ok")) {
                await cht.reply("Service is currently unavailable. Please try again later.");
            } else {
                await cht.reply("TypeErr: " + error.message);
            }
        }
    });

    ev.on({ 
        cmd: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
        listmenu: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
        tag: 'downloader',
        args: "Mana linknya?",
        energy: 4 
    }, async () => {
        const _key = key[sender];
        let q = is.quoted?.url || is.url || (typeof cht.q !== 'undefined' ? [cht.q] : null);
        if (!q) return cht.reply('Harap sertakan url/judul videonya!');
        try {
            await cht.edit("Searching...", _key);
            let searchResponse = await fetch(api.xterm.url + "/api/search/youtube?query=" + q[0] + "&key=" + api.xterm.key);
            
            if (!searchResponse.ok) {
                throw new Error("Network response was not ok " + searchResponse.statusText);
            }

            let searchJson = await searchResponse.json();
            
            if (!searchJson.data) {
                throw new Error("Invalid JSON response");
            }

            let search = searchJson.data;
            await cht.edit("Downloading...", _key);
            
            let downloadResponse = await fetch(api.xterm.url + "/api/downloader/youtube?url=" + q[0] + "&type=" + (cht.cmd === "ytmp4" ? "mp4" : "mp3") + "&key=" + api.xterm.key);
            
            if (!downloadResponse.ok) {
                throw new Error("Network response was not ok " + downloadResponse.statusText);
            }

            let downloadJson = await downloadResponse.json();
            
            if (!downloadJson.data) {
                throw new Error("Invalid JSON response");
            }

            let data = downloadJson.data;
            let item = search.items[0];
            
            let audio = {
                [cht.cmd === "ytmp4" ? "video" : "audio"]: { url: data.dlink },
                mimetype: cht.cmd === "ytmp4" ? "video/mp4" : "audio/mpeg",
                fileName: item.title + (cht.cmd === "ytmp4" ? ".mp4" : ".mp3"),
                ptt: cht.cmd === "play",
                contextInfo: {
                    externalAdReply: {
                        title: "Title: " + item.title,
                        body: "Channel: " + item.creator,
                        thumbnailUrl: item.thumbnail,
                        sourceUrl: item.url,
                        mediaUrl: "http://ẉa.me/6285868755849?text=Idmsg: " + Math.floor(Math.random() * 100000000000000000),
                        renderLargerThumbnail: false,
                        showAdAttribution: true,
                        mediaType: 2,
                    },
                },
            };
            await cht.edit("Sending...", _key);
            await Exp.sendMessage(cht.id, audio, { quoted: cht });
        } catch (error) {
            if (error.message.includes("Network response was not ok")) {
                await cht.reply("Service is currently unavailable. Please try again later.");
            } else {
                console.log(error);
                cht.reply("TypeErr: " + error.message);
            }
        }
    });
}
