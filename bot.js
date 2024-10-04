import Bot from "./utils/_Bot.js";
import { handleTag } from "./utils/handleTag.js";
import { prv } from "./utils/prv.js";
import { handleDownload } from "./utils/handleDownload.js";

export const run = async (sock, m) => {
  const bot = new Bot(sock, m);
  switch (true) {
    case bot.message == "!prv" && bot.isFromMe:
      prv(bot);
      break;

    case bot.message?.includes("@") && bot.isFromMe:
      handleTag(bot);
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
      handleDownload(bot, tiktokLink, "tiktok");
      break;
    case bot.message?.startsWith("!f"):
      const facebookLink = bot.message.split("!f")[1];
      handleDownload(bot, facebookLink, "facebook");
      break;

    default:
      break;
  }
};
