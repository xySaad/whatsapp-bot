class Bot {
  constructor(sock) {
    this.sock = sock;
    this.id = sock.authState.creds.me?.id;
    this.me = this.id?.replace(/:\d+/g, "");
    this.selfTag = "@" + this.me?.split("@")[0];
  }
  init(m) {
    this.m = m;
    this.chat = m.messages[0].key.remoteJid;
    this.sender = m.messages[0].key.participant || this.chat;
    this.ext = m.messages[0].message?.extendedTextMessage;
    this.caption =
      m.messages[0]?.message?.videoMessage?.caption ||
      m.messages[0]?.message?.imageMessage?.caption;

    this.message =
      m.messages[0].message?.conversation || this.caption || this.ext?.text;
    this.key = m.messages[0]?.key;
    this.isFromMe = this.key?.fromMe === true;

    this.quotedMessage = this.ext?.contextInfo?.quotedMessage;
    this.quotedMessageJid = this.ext?.contextInfo?.remoteJid;
    this.isQuotedStatus =
      this.quotedMessageJid === "status@broadcast" ? true : false;
  }
  async send(chat, content, extra) {
    await this.sock.sendMessage(chat, content, extra);
  }
  async reply(content, chat, m) {
    await this.send(chat || this.chat, content, {
      quoted: m?.messages[0] || this.m?.messages[0],
    });
  }
  async react(emoji) {
    await this.send(this.chat, {
      react: {
        text: emoji,
        key: this.key,
      },
    });
  }
}

export default Bot;
