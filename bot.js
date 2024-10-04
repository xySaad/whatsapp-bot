import Bot from "./utils/_Bot.js";
import { handleTag } from "./utils/handleTag.js";
import { prv } from "./utils/prv.js";
import { getTiktok } from "./utils/tiktok.js";

export const run = async (sock, m) => {
  const bot = new Bot(sock, m);
  switch (true) {
    case bot.message == "!prv" && bot.isFromMe:
      prv(bot);
      break;

    case bot.message?.includes("@") && bot.isFromMe:
      handleTag(bot.sock, {
        chat: bot.chat,
        sender: bot.sender,
        message: bot.message,
        key: bot.key,
        ext: bot.ext,
      });
      break;

    case bot.isQuotedStatus:
      if (
        !bot.isFromMe &&
        (bot.message.toLowerCase().includes("pass") ||
          bot.message.toLowerCase().includes("pss") ||
          bot.message.toLowerCase().includes("send"))
      ) {
        bot.reply({
          forward: { ...bot.m.messages[0], message: bot.quotedMessage },
        });
      }
      break;

    case bot.message?.startsWith("!t"):
      const tiktokLink = bot.message.split("!t")[1];
      bot.react("🕒");
      const res = await getTiktok(tiktokLink);
      if (!res.ok) {
        bot.react("🚫");
      } else if (res.ok && res.video.buffer) {
        await bot.reply({
          video: res.video.buffer,
          caption: res.video.caption,
        });
        bot.react("✅");
      }
      break;

    default:
      break;
  }
};
