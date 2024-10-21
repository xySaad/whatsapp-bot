import { handleTag } from "./utils/handleTag.js";
import { prv } from "./utils/prv.js";
import { handleDownload } from "./utils/handleDownload.js";

export const run = async (bot) => {
  switch (true) {
    case bot.Message.text == "!prv" && bot.Message.isFromMe:
      prv(bot);
      break;

    case bot.Message.text?.includes("@") && bot.Message.isFromMe:
      handleTag(bot);
      break;

    case bot.Message.isQuotedStatus:
      if (
        !bot.Message.isFromMe &&
        (bot.Message.text.toLowerCase().includes("pass") ||
          bot.Message.text.toLowerCase().includes("pss") ||
          bot.Message.text.toLowerCase().includes("send"))
      ) {
        bot.reply({
          forward: {
            ...bot.Message.m.messages[0],
            message: bot.Message.quotedMessage,
          },
        });
      }
      break;
    case bot.Message.viewOnce != undefined:
      bot.reply(
        {
          forward: {
            ...bot.Message.m.messages[0],
            message: {
              ...bot.Message.viewOnce,
              imageMessage: {
                contextInfo: { mentionedJid: [bot.me] },
                ...bot.Message.viewOnceMedia,
                viewOnce: false,
              },
            },
          },
        },
        bot.me
      );
      break;
    case process.env.BOT_MODE !== "personal":
      switch (true) {
        case bot.Message.text?.startsWith("!t"):
          const tiktokLink = bot.Message.text.split("!t")[1];
          handleDownload(bot, tiktokLink, "tiktok");
          break;
        case bot.Message.text?.startsWith("!f"):
          const facebookLink = bot.Message.text.split("!f")[1];
          handleDownload(bot, facebookLink, "facebook");
          break;
      }
      break;

    default:
      break;
  }
};
