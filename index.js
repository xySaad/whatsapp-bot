import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import { run } from "./bot.js";
import dotenv from "dotenv";
import Bot from "./utils/_Bot.js";
import { log } from "./utils/logger.js";
dotenv.config();

const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

const connectToWhatsApp = async () => {
  const sock = await makeWASocket.makeWASocket({
    markOnlineOnConnect: false,
    auth: state,
    printQRInTerminal: true,
  });

  const bot = new Bot(sock);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.data?.reason != "401";
      console.log(
        "connection closed due to ",
        lastDisconnect?.error?.data?.reason,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        await connectToWhatsApp();
        return;
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
    log(bot);
    run(bot);
  });
};

connectToWhatsApp();
