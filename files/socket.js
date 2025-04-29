const fs = require("fs")
const { default: makeWASocket, proto, getContentType, jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FileType = require('file-type');
const path = require('path');
const fetch = require("cross-fetch");
        
        
exports.socket = (...args) => {
    let core = makeWASocket(...args);
    Object.defineProperty(core, 'name', {
        value: 'WASocket',
        configurable: true,
    });
    core.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
     } else return jid
    }
    core.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await fetch(PATH)).buffer()
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    const type = await FileType.fromBuffer(data) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
      (filename = path.join(process.cwd(), "/temp/" + new Date() * 1 + "." + type.ext)),
     await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
      deleteFile() {
        return filename && fs.promises.unlink(filename);
      },
    };
  };
  (core.sendFile = async (jid, path, filename = "", caption = "", quoted, ptt = false, options = {}) => {
      let type = await core.getFile(path, true);
      let { res, data: file, filename: pathFile } = type;
      if ((res && res.status !== 200) || file.length <= 65536) {
        try {
          throw { json: JSON.parse(file.toString()) };
        } catch (e) {
          if (e.json) throw e.json;
        }
      }
      let opt = { filename };
      if (quoted) opt.quoted = quoted;
      if (!type) options.asDocument = true;
      let mtype = "",
        mimetype = type.mime,
        convert;
      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) {
         mtype = "sticker";
      } else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) {
        mtype = "image";
      } else if (/video/.test(type.mime)) {
        mtype = "video";
      } else if (/audio/.test(type.mime)) {
       (convert = await (ptt ? toPTT : toAudio)(file, type.ext)), (file = convert.data), (pathFile = convert.filename), (mtype = "audio"),
       (mimetype = "audio/mpeg") 
      } else mtype = "document";
      if (options.asDocument) mtype = "document";

      let message = {
        ...options,
        caption,
        ptt,
        [mtype]: { url: pathFile },
        mimetype,
      };
      let m;
      try {
        m = await core.sendMessage(jid, message, { ...opt, ...options });
      } catch (e) {
        console.error(e);
        m = null;
      } finally {
        if (!m)
          m = await core.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
        return m;
      }
   });
    core.fetchJson = async (url, options) => {
    try {
      options ? options : {};
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
        ...options,
      });
      return res.data;
     } catch (err) {
      return err;
     }
    };
     core.getBuffer = async (url, options) => {
      try {
       options ? options : {}
       const res = await axios({
         method: "get",
          url,
          headers: {
           'DNT': 1,
           'Upgrade-Insecure-Request': 1
          }, ...options, responseType: 'arraybuffer'
        })
      return res.data
     } catch (err) {
       return err
      }
  }
  core.filename = (extension) => {
    return `${Math.floor(Math.random() * 10000)}.${extension}`
  }
  core.sendImage = async (jid, path, caption = '', quoted = '', options) => {
   let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await core.getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await core.sendMessage(jid, {
        image: buffer,
        caption: caption,
        ...options
    }, { quoted });
  };
  core.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await core.getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
      return await core.sendMessage(jid, {
        video: buffer,
        caption: caption,
        gifPlayback: gif,
        ...options
     }, { quoted });
  };

  core.sendAudio = async (jid, data, quoted = '') => {
   let doc = {
      audio: { url: data },
      mimetype: "audio/mp4"
    };

    return core.sendMessage(jid, doc, { quoted });
   };
    if (core.user && core.user.id) core.user.jid = core.decodeJid(core.user.id);
    core.parseMention = (text = "") => {
     return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net");
    };
    core.reply = async (jid, text, quoted, options) => {
     await core.sendPresenceUpdate('composing', jid)
     return core.sendMessage(jid, {text: text, mentions: core.parseMention(text), ...options}, { quoted})
   }
   core.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message|WithCaption/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }
  return core;
};

exports.smsg = (core, m, store) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('B24E') && m.id.length === 20 || m.id.startsWith('3EB0') && m.id.length === 22
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = core.decodeJid(m.fromMe && core.user.id || m.participant || m.key.participant || m.chat || '');
    if (m.isGroup) m.participant = core.decodeJid(m.key.participant) || '';
  }
  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
    m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text;
    let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = Object.keys(m.quoted)[0];
      m.quoted = m.quoted[type];
      if (['productMessage'].includes(type)) {
        type = Object.keys(m.quoted)[0];
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === 'string') m.quoted = {
        text: m.quoted
      };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
      m.quoted.isBaileys =  m.quoted.id ? (m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 22) : false
      m.quoted.sender = core.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === core.decodeJid(core.user.id);
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
      m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
      let vM = m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id
        },
        message: quoted,
        ...(m.isGroup ? {
          participant: m.quoted.sender
        } : {})
      });
      m.quoted.delete = () => core.sendMessage(m.quoted.chat, {
        delete: vM.key
      });
      m.quoted.download = () => core.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => core.downloadMediaMessage(m.msg);
  m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';
  return m;
};
