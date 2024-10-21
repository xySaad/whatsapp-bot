export const prv = (bot) => {
  const viewOnceObject =
    bot.Message.quotedMessage?.viewOnceMessageV2 ||
    bot.Message.quotedMessage?.viewOnceMessage ||
    bot.Message.quotedMessage?.viewOnceMessageV1;

  const viewOnceMessage = viewOnceObject?.message;

  const viewOnceImage = viewOnceMessage?.imageMessage;

  if (
    bot.Message.quotedMessage?.viewOnceMessageV2 &&
    bot.Message.quotedMessage &&
    bot.Message.isFromMe
  ) {
    bot.reply(
      {
        forward: {
          ...bot.Message.m.messages[0],
          message: {
            ...viewOnceMessage,
            imageMessage: {
              ...viewOnceImage,
              viewOnce: false,
            },
          },
        },
      },
      bot.me
    );
  }
};
