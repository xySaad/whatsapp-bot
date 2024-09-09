import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { handleTag } from "./utils/handleTag.js";
import tiktokDl from "@tobyg74/tiktok-api-dl";

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

        try {
          // Convert ReadableStream to Buffer
          async function streamToBuffer(stream) {
            const chunks = [];
            for await (const chunk of stream) {
              chunks.push(chunk);
            }
            return Buffer.concat(chunks);
          }

          // Function to download video using fetch and return a buffer
          async function downloadVideo(url) {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch video: ${response.statusText}`);
            }
            const videoBuffer = await streamToBuffer(response.body); // Convert stream to buffer
            return videoBuffer;
          }

          const videoInfo = await tiktokDl.Downloader(tiktokLink, {
            version: "v3",
          });

          const videoBuffer = await downloadVideo(videoInfo?.result?.videoHD);

          sock.sendMessage(
            chat,
            {
              video: videoBuffer,
              caption: videoInfo?.result.desc.substring(0, 35),
            },
            {
              quoted: m.messages[0],
            }
          );
        } catch (error) {
          sock.sendMessage(
            chat,
            { text: "ra kayn error ajmi" },
            { quoted: m.messages[0] }
          );
          console.error(error.message);
        }
      default:
        break;
    }
  });
};

connectToWhatsApp();
