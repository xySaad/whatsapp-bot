import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { run } from "./bot.js";
import dotenv from "dotenv";
import Bot from "./utils/_Bot.js";
dotenv.config();

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = await makeWASocket.makeWASocket({
    markOnlineOnConnect: false,
    auth: state,
    printQRInTerminal: true,
  });

  const bot = new Bot(sock);

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
      bot.send(bot.id, {
        text: ` Bot is alive\nMode: ${process.env.BOT_MODE}`,
      });
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    bot.init(m);
    run(bot);
  });
};

connectToWhatsApp();
