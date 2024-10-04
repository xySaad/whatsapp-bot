export const prv = (bot) => {
  if (
    bot.quotedMessage?.viewOnceMessageV2 &&
    bot.quotedMessage &&
    bot.isFromMe
  ) {
    bot.reply(
      {
        forward: {
          ...bot.m.messages[0],
          message: {
            ...bot.quotedMessage.viewOnceMessageV2.message,
            imageMessage: {
              ...bot.quotedMessage.viewOnceMessageV2.message.imageMessage,
              viewOnce: false,
            },
          },
        },
      },
      bot.me
    );
  }
};
