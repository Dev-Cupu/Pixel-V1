require("./config");
const {
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require("fs");
const util = require("util");
const chalk = require('./color');
const { format } = require('util');
const { exec } = require('child_process');
const fetch = require("cross-fetch");

//img = {
//const img = fs.readFileSync("./files/botIMG.jpg");
//}

module.exports = async (core, m) => {
  const CategoryCommand = {};
  core.command = async (commands, callback, options = {}) => {
    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    let body = m.mtype === 'conversation' ? m.message.conversation : m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text : '';
    const prefix = body && /^[#!.,®©¥€¢£/\∆✓]/.test(body) ? body.match(/^[#!.,®©¥€¢£/\∆✓]/gi)[0] : '#';

    const executing = ['>', '=>', '$'];
    let command = body.trim().split(/ +/).shift().toLowerCase();

    if (body.startsWith(prefix) && !executing.includes(command)) {
      command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase();
    } else if (!executing.includes(command)) {
      return;
    }

    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(' ');
    const isOwner = global.owner.map(v => v + '@s.whatsapp.net').includes(m.sender);
    const userintro = m.pushName || `IntrovertUser`
    const isCmd = body.startsWith(prefix);
    const introCmd = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';

    const getGroupMetadata = async () => {
      if (!m.isGroup) return {};
      const groupMetadata = await core.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const adminList = participants.filter(v => v.admin !== null).map(v => v.id);
      const isAdmin = adminList.includes(m.sender);
      const isBotAdmin = adminList.includes((core.user.id.split`:`[0]) + '@s.whatsapp.net');
      return { groupMetadata, isAdmin, isBotAdmin };
    };

    const groupMetadata = await getGroupMetadata();
    const isAdmin = groupMetadata.isAdmin;
    const isBotAdmin = groupMetadata.isBotAdmin;

    if (options.admin && !isAdmin) {
      return 
    }
    if (options.bot && !isBotAdmin) {
      return 
    }

    if (options.owner && !isOwner) {
      return 
    }
    
    if (options.grup && !m.isGroup) {
      return 
    }

    if (commands.includes(command)) {
      callback(m, { core, args, text, isOwner, func, prefix, executing, groupMetadata, command, userintro });

      core.readMessages([m.key]);
      console.log(chalk.black(chalk.bgWhite(command ? '|| CMD ||' : '|| MSG ||')), chalk.black(chalk.bgBlue(body || m.mtype)) + chalk.magenta(' From'), chalk.green(m.pushName), chalk.yellow(m.sender) + chalk.blueBright(' In'), chalk.green(m.isGroup ? groupMetadata.groupMetadata.subject : 'Private Chat', m.chat));
    }
    const category = options.category || 'inttovertFeatures';
    if (!CategoryCommand[category]) {
      CategoryCommand[category] = [];
    }
    const use = options.use || "";
    if (Array.isArray(use)) {
      use.forEach(u => {
        commands.forEach(cmd => {
          const commandWithUse = `${cmd} ${u}`.trim();
          if (!CategoryCommand[category].includes(commandWithUse)) {
            CategoryCommand[category].push(commandWithUse);
          }
        });
      });
    } else {
      commands.forEach(cmd => {
        const commandWithUse = `${cmd} ${use}`.trim();
        if (!CategoryCommand[category].includes(commandWithUse)) {
          CategoryCommand[category].push(commandWithUse);
        }
      });
    }
    
/*
    const fungsi = options.fungsi || "Gak berguna buang aja🗿";
        if (Array.isArray(fungsi)) {
      fungsi.forEach(f => {
        commands.forEach(cmd => {
          const commandWithFungsi = `${cmd}\n> ${f}`.trim();
          if (!CategoryCommand[category].includes(commandWithFungsi)) {
            CategoryCommand[category].push(commandWithFungsi);
          }
        });
      });
    } else {
      commands.forEach(cmd => {
        const commandWithFungsi = `${cmd}\n> ${fungsi}`.trim();
        if (!CategoryCommand[category].includes(commandWithFungsi)) {
          CategoryCommand[category].push(commandWithFungsi);
        }
      });
    }

By Manager Mt
*/
  };

// function = {
        const send = (text, f1 = true, f2 = 9999, ads = false ) => {
   core.reply(m.chat, text, m, { contextInfo: { mentionedJid: [m.sender], isForwarded: f1, forwardingScore: f2, externalAdReply: { showAdAttribution: ads, title: `IntrovertBot: Halo😇`, body: "IntrovertBot adalah bot wa yang simple😁", mediaType: 1, renderLargerThumbnail: false, thumbnailUrl: "https://cloudkuimages.guru/uploads/images/681080150bc9c.jpg",
 sourceUrl: null, }, quoted: m }});
       }
       /*
const sendPoto = (text, image) => {
       core.sendImage(m.chat, image, text, m, { contextInfo: { mentionedJid: [m.sender], isForwarded: true,
forwardingScore: 9999, quoted: m }});
       }
       const sendPideo = (text, video, gif = false) => {
       core.sendVideo(m.chat, video, text, m, gif, { contextInfo: { mentionedJid: [m.sender], isForwarded: true,
forwardingScore: 9999, quoted: m }});
       }
       const sendLagu = (data //Url audio ) => {
       core.sendAudio(m.chat, data, m);
       }

By Manager Mt
*/
       const reactmess = async (type) => {
            core.sendMessage(m.chat, {
                'react': {
                    'text': type,
                    'key': m.key
                }
            });
        }
        
        let neoxr = global.apis.neoxr.link
        let neoxrApi = global.apis.neoxr.apikey
//}
// fitur = {
        //   MAIN   = {
  core.command(["cekapikey", "checkapi"], async (m, { core }) => {
  try {
      const web = await core.fetchJson(`${neoxr}/api/check?apikey=${neoxrApi}`)
      const datanya = web.data;
      const { name, limit, total, premium, expired_at, last_activity, url } = datanya
      
       let execution = `APIKEY CHECKER
Nama api: Neoxr
Link: ${neoxr}
Apikeynya: ${neoxrApi}
Status api: ${web.status}
> Data akun
Nama: ${name}
Limit: ${limit}
Premium: ${premium}
Total: ${total}
Expired: ${expired_at}
Aktivitas: ${last_activity}
Url: ${url}

Thanks to ${web.creator}`

   send(execution)
  } catch (err) {
        core.reply(m.chat, func.jsonFormat(err), m)
  }
}, { category: 'main', });
  //}

                //     AI = {
  core.command(["gemini"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Mau tanya apa?", m)
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/gemini?text=${text}`);
       let b = a.result
       let c = a.creator
       let tek = `Gemini Apis by ${c}\nResult:\n"${b}"`
       send(tek);
  
  } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["dopple"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Ask what?", m)
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/dopple?text=${text}`);
       let b = a.result
       let c = a.creator
       let tek = `Dopple Api by ${c}\nResult:\n"${b}"`
       send(tek);

      } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["luminai"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Mau apa😁", m)
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/luminai?text=${text}`);
       let b = a.result.result
       let c = a.creator
       let tek = `LuminAI Api by ${c}\nResult:\n"${b}"`
       send(tek);

      } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["deepseek-r1"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Halo silahkan enter ask kamu", m)
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/deepseek-r1?text=${text}`);
       let b = a.result
       let c = a.creator
       let tek = `Deepseek Api by ${c}\nResult:\n"${b}"`
       send(tek);

      } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["deep-coder"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Me DCODER What do you want?", m)
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/deepseek-coder-67b?text=${text}`);
       let b = a.result
       let c = a.creator
       let tek = `Deepseek Coder Api by ${c}\nResult:\n"${b}"`
       send(tek);

      } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["hydromind"], async (m, { core, text, func}) => {
  try {
  if (!text) return core.reply(m.chat, "Lu mau nanya apaan?🗿, Abis nanya jangan lupa kasih bunga mawar yak😁🗿 Tapi ngasih jangan banyak banyak ntar gua keterbang ke angkasa kalu menghilang 🌹🗿🗿", m)
  let logic = `Kamu adalah ai yang pemarah dan kamu sangat susah sekali di atur tapi kamu selalu siap membantu menjawab pertanyaan pertanyaan apa pun itu.  kamu juga ai yang gaul menggunak kata kata seperti lu gua gak anu itu dan ini kamu juga suka sekali dengan bunga mawar kalo ada yang memberi emoji mawar🌹 kamu akan kegirangan hingga terbang ke angkasa lalu menghilang🗿`
       let a = await core.fetchJson(`${global.apis.arciv}/api/ai/hydromind-logic?text=${text}&logic=${logic}`);
       let b = a.result
       let tek = `${b}`
       send(tek);

      } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'ai', use: '<text>'});
  core.command(["transkip","groqwhisper"], async (m, { core, func, text, args }) => {
  try {
  if (!func.isUrl(args[0])) return send("Err: Gagal mentranskrip link tidak dapat di buka (Undefined)");
     await send("Tunggu sayang....", false, true);
     
     const z = await core.fetchJson(`https://www.archive-ui.biz.id/api/ai/groq-whisper-large-v3?url=${args[0]}`);
     const pon = z?.result;
    send(`Success Transkrip: ${pon}`) 
  } catch (err) {
        core.reply(m.chat, func.jsonFormat(err), m)
  }
  }, { category: 'ai', use: '<url>'});
//}

          // Download =   {
  /*
core.command(["ssweb"], async (m, { core, func, args, text }) => {
  try {
    if (!func.isUrl(args[0])) return send("Err: Invalid URL");
    const ss = await core.fetchJson(`https://www.archive-ui.biz.id/api/tools/ssweb?url=${text}&model=desktop`);
    
    // if (!ss || typeof ss !== 'string') return send("Err: Gagal mengambil screenshot.");

    const caption = `Success broo 🖤`;
    core.sendImage(m.chat, ss, caption, m);

  } catch (err) {
    core.reply(m.chat, func.jsonFormat(err), m);
  }
}, { category: 'download', use: '<url>' });

By Manager Mt
*/
          // }

            //       INFORMASI   =  {
            
  core.command(["script"], async (m, { core, func }) => {
  try {
         let data = await axios
                        .get("https://api.github.com/repos/Dwi-Merajah/base-pairing")
                        .then((a) => a.data);

                    let cap = "*ㅡ> Informasi Script Bot*\n\n";
                    cap += `> 🧩 *Nama:* ${data.name}\n`;
                    cap += `> 👤 *Pemilik:* ${data.owner.login}\n`;
                    cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
                    cap += `> 🍴 *Forks:* ${data.forks}\n`;
                    cap += `> 📅 *Dibuat sejak:* ${data.created_at}\n`;
                    cap += `> 🔄 *Terakhir Update:* ${data.updated_at}\n`;
                    cap += `> 🔄 *Terakhir Publish:* ${data.pushed_at}\n`;
                    cap += `> 🔗 *Link Repository:* ${data.html_url}\n\n`;
                    cap +=
                        "🔧 *Fitur Utama Script Bot:*\n" +
                        "> ✅ *Fitur Eval Dan Exec*\n" +
                        "> ✅ *Ukuran Script Ringan*\n" +
                        "> ✅ *Support pairing code*\n" +
                        "> ✅ *Mudah dipahami*\n" +
                        "> ✅ *Support Run Di Mana Saja*\n\n";
                    cap +=
                        "Script ini gratis, boleh kalian recode dan jual asal jangan hapus credit original dari kami!";

                    core.reply(m.chat, cap, m);
  
  } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'informasi', use: '<text>'});
  core.command(["cuaca"], async (m, { core, func, text }) => {
  try {
      if (!text) return send("Err: lokasi undefined tidak die temukan");
      
    const apikey = 'uA570k'; // api key
    const url = `https://api.neoxr.eu/api/cuaca?subdistrict=${text}&apikey=${apikey}`;

    const result = await core.fetchJson(url);
    const data = result?.data;
    if (!data) return core.reply(m.chat, "Gagal ambil data cuaca. 😶‍🌫️", m);

    const header = `🖤 *Cuaca ${data.subdistrict}, ${data.regency}* 🖤\nProvinsi: *${data.province}*\n`;
    const list = data.result.map(item => {
      return `🕰️ *${item.time.split(' ')[1]}*\n🌡️ Suhu: *${item.temperature}°C*\n☁️ Cuaca: *${item.weather}*\n💨 Angin: *${item.wind}*\n`;
    }).join('\n');

    const message = `${header}\n${list}\nSilent but ruthless.`;

    core.reply(m.chat, message, m);

  } catch (err) {
    core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'informasi', use: '<lokasi>' });
  


          //            SERSH    //
          
  core.command("cariyt", async (m, { core, func, text  }) => {
  try {
  if (!text) return send("Err: judul \"NaN\" tidak ditemukan");
  send("fitur lagi dalam perjalanan")
  /*
const api = await core.fetchJson(`https://api.ssateam.my.id/api/yts?q=${text}&apikey=makangratis`);
  const data = api?.result;
  const kepala = "YOUTUBE SEARCH\n\n"
  const list = data.map(item => {
  return `- Judul: ${item.title.split(" ")[1]}\n- Deskripsi: ${item.description}\n- Waktu: ${item.timestamp}\n- Creator: ${item.author.name}\n- Channel: ${item.author.url}`
  }).join('\n');
  
  send(`${kepala}${list}`)

By Manager Mt
*/
  } catch (err) {
        core.reply(m.chat, func.jsonFormat(err), m)
  }
  }, { category: 'search', use: '<judul>' });
  core.command(["lirik", "slirik"], async (m, { core, text, func}) => {
  try {
  if (!text) return send("lu nyarik lirik apa?")
  let a = await core.fetchJson(`${global.apis.arciv}/api/search/lyrics?query=${text}`);
  let title = a.result.title
  let album = a.result.album
  let lirik = a.result.lyrics
  
let teks = `Judul: ${title}\nAlbum: ${album}\nLiriknya: \n${lirik}`
  
   core.sendImage(m.chat, a.result.thumb, teks, m)
  
  } catch (err)  {
     core.reply(m.chat, func.jsonFormat(err), m);
  }
  
  }, { category: 'search', use: '<text>'});
  core.command(["gitstalk"], async (m, { core, text, func }) => {
  try {
  if (!text) return send("Masukan username github nya")
  
  const api = await core.fetchJson(`${global.apis.siput}/api/stalk/github?user=${text}`);
  const data = api.data;
  const { username, nickname, bio, id, nodeId, profile_pic, url, type, admin, company, blog, location, email, public_repo, public_gists, followers, following, created_at, updated_at } = data
  
  let responnya = `\`GITHUB STALK WITH SIPUT API\`
> Dari: ${func.tag(m.sender)}
> Info github nya
- Username: ${username}
- Nickname: ${nickname}
- Bio: ${bio}
- ID: ${id}
- Node ID: ${nodeId}
- URL: ${url}
- Tipe: ${type}
- Admin: ${admin}
- Company: ${company}
- Blog: ${blog}
- Lokasi: ${location}
- Email: ${email}
- Repositories Publik: ${public_repo}
- Gist Public: ${public_gists}
- Follower: ${followers}
- Mengikuti: ${following}
- Di buat pada: ${created_at}
- Di update pada: ${updated_at}
  
> \`Powered\`  \`by\`  \`IntrovertBot\``

   send(responnya, false)
  
  } catch (e) {
     core.reply(m.chat, func.jsonFormat(e), m);
  }
  }, { category: 'search', use: '<username>', });
  core.command(["carisc","searchscript"], async (m, { core, func, args, text }) => {
  try {
  if (!text) return send("Masukan username dan repo nya")
  
         let data = await axios
                        .get(`https://api.github.com/repos/${args[0]}/${args[1]}`)
                        .then((a) => a.data);

                    let cap = "*ㅡ> Informasi Script Bot*\n\n";
                    cap += `> 🧩 *Nama:* ${data.name}\n`;
                    cap += `> 👤 *Pemilik:* ${data.owner.login}\n`;
                    cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
                    cap += `> 🍴 *Forks:* ${data.forks}\n`;
                    cap += `> 📅 *Dibuat sejak:* ${data.created_at}\n`;
                    cap += `> 🔄 *Terakhir Update:* ${data.updated_at}\n`;
                    cap += `> 🔄 *Terakhir Publish:* ${data.pushed_at}\n`;
                    cap += `> 🔗 *Link Repository:* ${data.html_url}`;

                    core.reply(m.chat, cap, m);
  
  } catch (err) {
  core.reply(m.chat, func.jsonFormat(err), m);
  }
  }, { category: 'search', use: '<user> <repo>'});
      //          ISLAMI         // 
  core.command(["jadwalsholat", "jds"], async (m, { core, text, func }) => {
  try {
    if (!text) return send("Lu ada di kota mana?")

    const api = await core.fetchJson(`https://api.vreden.my.id/api/islami/jadwalsholat?city=${text}`)
    
    const timing = api.result.timings
    const { Dhuhr, Asr, Maghrib, Isha, Fajr } = timing

    const readable = api.result.date.readable
    const hijri = api.result.date.hijri
    const date = hijri.date

    const response = `JADWAL SHOLAT BY VERDEN APIS\nKREATED BY: introvertDev\n\nWaktu sholat di kota ${text}:\n> Dzuhur: ${Dhuhr}\n> Asar: ${Asr}\n> Maghrib: ${Maghrib}\n> Isya: ${Isha}\n> Subuh: ${Fajr}\n\nReadable: ${readable}\nTanggal (Hijriah): ${date}`

    send(response)

  } catch (err) {
    core.reply(m.chat, func.jsonFormat(err), m)
  }
  }, { category: 'islami', use: '<text>' })

//}

            //       OWNER   = {
            
  core.command("$", async (m, { core, text }) => {
    await core.reply(m.chat, global.status.execute, m);
    exec(text, async (err, stdout) => {
      if (err) return core.reply(m.chat, func.jsonFormat(err), m);
      if (stdout) {
        await core.reply(m.chat, stdout, m);
      }
    });
  }, { owner: true, category: 'owner', use: '<command>' });

  core.command(">", async (m, { core, text }) => {
    try {
      await core.reply(m.chat, global.status.execute, m);
      let evaled = await eval(text);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      await core.reply(m.chat, evaled, m);
    } catch (err) {
      core.reply(m.chat, func.jsonFormat(err), m);
    }
  }, { owner: true, category: 'owner', use: '<command>' });

  core.command("=>", async (m, { core, text }) => {
    try {
      const result = await eval(`(async () => { return ${text} })()`);
      core.reply(m.chat, JSON.stringify(result, null, 2), m);
    } catch (e) {
      core.reply(m.chat, func.jsonFormat(e), m);
    }
  }, { owner: true, category: 'owner', use: '<command>' });
  
  core.command("addcmd", async (m, { core, text }) => {
    if (!text) return core.reply(m.chat, "Masukkan kode perintah yang ingin ditambahkan.", m);
    try {
      const fileContent = fs.readFileSync(__filename, 'utf-8');
      const newCommand = `\n  ${text}\n`;
      const updatedContent = `fileContent.replace(/};\n\nlet file/, ${newCommand}};\n\nlet file)`;
      fs.writeFileSync(__filename, updatedContent);
      core.reply(m.chat, "Perintah berhasil ditambahkan!", m);
      process.send('reset');
    } catch (e) {
      core.reply(m.chat, `Error: ${e}`, m);
    }
  }, { owner: true, category: 'owner', use: '<code>' });
  core.command("dellcmd", async (m, { core, text, args }) => {
  if (!text) return core.reply(m.chat, "Masukkan nama command yang ingin dihapus.", m);
  try {
    const commandName = args[0]; // Mengambil nama command dari argumen
    const commandRegex = new RegExp(`\\s*core\\.command\\(\\s*[\'"]${commandName}[\'"]\\s*,\\s*.*?\\},\\s*{\\s*.*?\\s*}\\);?, 's'`); // Regex yang diperbaiki untuk menghapus ;
    let fileContent = fs.readFileSync(__filename, 'utf-8');
    let match = commandRegex.exec(fileContent);
    if (match != null) {
      fileContent = fileContent.replace(commandRegex, '');
      fs.writeFileSync(__filename, fileContent);
      for (const category in CategoryCommand) {
        CategoryCommand[category] = CategoryCommand[category].filter(cmd => !cmd.startsWith(commandName));
      }
      core.reply(m.chat, `Command "${commandName}" berhasil dihapus!`, m);
    } else {
      core.reply(m.chat, `Command "${commandName}" tidak ditemukan.`, m);
    }
  } catch (e) {
    core.reply(m.chat, `Error: ${e}`, m);
  }
  }, { owner: true, category: 'owner', use: '<nama command>' });
  
  //}
  
  
  
  core.command("menu", async (m, { core, prefix, executing, userintro }) => {
  let menu = `Base: Dwi-Merajah\n> Halo \`${userintro}\`, ${func.greeting()}, aku adalah ${global.namebot}, yang di ciptakan oleh ${global.author}, Btw aku di buat menggunakan base dari Dwi-Merajah aku sangat berterima sekali dengan beliau tanpa beliau aku ga bakal ada di dunia bot ini😁, berikut ini adalah fitur yang ada di bot\n`
  menu += `\nNAMA: ${userintro}\nTAG: ${func.tag(m.sender)}\n`
  for (const category in CategoryCommand) {
    menu += `\n> *${category.toUpperCase()} MENU*\n`;
    CategoryCommand[category].forEach(command => {
      if (executing.includes(command.split(" ")[0])) { 
        menu += ` • ${command}\n`;
      } else {
        menu += ` • ${prefix}${command}\n`; 
      }
    });
  }
  core.reply(m.chat, menu, m, { contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true, title: `IntrovertBot: Halo😇`, body: "IntrovertBot adalah bot wa yang simple😁", mediaType: 1, renderLargerThumbnail: true, thumbnailUrl: "https://cloudkuimages.guru/uploads/images/68108020a6017.jpg",
 sourceUrl: null, }, quoted: m }});
 });
 
 //}
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
