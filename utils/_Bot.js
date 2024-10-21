class Bot {
  constructor(sock) {
    this.sock = sock;
    this.id = sock.authState.creds.me?.id;
    this.me = this.id?.replace(/:\d+/g, "");
    this.selfTag = "@" + this.me?.split("@")[0];
  }
  init(m) {
    const msgArray = m.messages[0];
    const Message = {};
    Message.m = m;
    Message.message = msgArray.message;
    Message.type = m.type;
    Message.items = m.messages.length;
    Message.chat = msgArray?.key.remoteJid;
    Message.sender = msgArray?.key.participant || Message.chat;
    Message.ext = msgArray?.message?.extendedTextMessage;
    Message.caption =
      msgArray?.message?.videoMessage?.caption ||
      msgArray?.message?.imageMessage?.caption;

    Message.text =
      msgArray?.message?.conversation || Message.caption || Message.ext?.text;

    Message.key = msgArray?.key;
    Message.isFromMe = Message.key?.fromMe === true;

    Message.quotedMessage = Message.ext?.contextInfo?.quotedMessage;
    Message.quotedMessageJid = Message.ext?.contextInfo?.remoteJid;
    Message.isQuotedStatus =
      Message.quotedMessageJid === "status@broadcast" ? true : false;

    Message.viewOnce = msgArray.message?.viewOnceMessageV2?.message;

    Message.viewOnceMedia =
      Message.viewOnce?.videoMessage || Message.viewOnce?.imageMessage;

    Message.caption = Message.viewOnceMedia
      ? Message.viewOnceMedia.caption
      : Message.caption;
    this.Message = Message;
  }
  async send(chat, content, extra) {
    await this.sock.sendMessage(chat, content, extra);
  }
  async reply(content, chat, m) {
    await this.send(chat || this.Message.chat, content, {
      quoted: (m || this.Message.m).messages[0],
    });
  }
  async react(emoji) {
    await this.send(this.Message.chat, {
      react: {
        text: emoji,
        key: this.Message.key,
      },
    });
  }
}

export default Bot;
