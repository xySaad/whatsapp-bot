import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { handleTag } from "./utils/handleTag.js";
import { getTiktok } from "./utils/tiktok.js";

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket.makeWASocket({
    markOnlineOnConnect: false,
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = true;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    const chat = m.messages[0].key.remoteJid;
    const sender = m.messages[0].key.participant || chat;
    const ext = m.messages[0].message?.extendedTextMessage;
    const caption =
      m.messages[0]?.message?.videoMessage?.caption ||
      m.messages[0]?.message?.imageMessage?.caption;

    const message = m.messages[0].message?.conversation || caption || ext?.text;
    const key = m.messages[0]?.key;
    const isFromMe = key?.fromMe === true;

    const quotedMessage = ext?.contextInfo?.quotedMessage;
    const quotedMessageJid = ext?.contextInfo?.remoteJid;
    const isQuotedStatus =
      quotedMessageJid === "status@broadcast" ? true : false;

    switch (true) {
      case message?.includes("test") && !isFromMe:
        sock.sendMessage(chat, {
          forward: { ...m.messages[0], message: quotedMessage },
        });
        break;
      case message?.includes("@") && isFromMe:
        handleTag(sock, { chat, sender, message, key, ext });
        break;

      case isQuotedStatus:
        if (
          !isFromMe &&
          (message.toLowerCase().includes("pass") ||
            message.toLowerCase().includes("pss") ||
            message.toLowerCase().includes("send"))
        ) {
          sock.sendMessage(
            chat,
            {
              forward: { ...m.messages[0], message: quotedMessage },
            },
            { quoted: m.messages[0] }
          );
        }
        break;
      case message?.startsWith("!t"):
        const tiktokLink = message.split("!t")[1];
        sock.sendMessage(chat, {
          react: {
            text: "🕒",
            key,
          },
        });

        getTiktok(sock, m, { tiktokLink, chat });

        sock.sendMessage(chat, {
          react: {
            text: "✅",
            key,
          },
        });
      default:
        break;
    }
  });
};

connectToWhatsApp();
