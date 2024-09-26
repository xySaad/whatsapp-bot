class Bot {
  constructor(sock, m) {
    this.m = m;
    this.sock = sock;
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
    this.sock.sendMessage(chat, content, extra);
  }
  async reply(content, m) {
    await this.send(this.chat, content, {
      quoted: (m || this.m).messages[0],
    });
  }
  react(emoji) {
    this.send(this.chat, {
      react: {
        text: emoji,
        key: this.key,
      },
    });
  }
}

export default Bot;
