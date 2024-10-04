export const handleTag = async (bot) => {
  const { chat, sender, message, key, ext, sock } = bot;
  const mentions = ext?.contextInfo?.mentionedJid || [];
  // Prepare replacements
  const replacements = [
    {
      target: "@me",
      replacement: bot.selfTag,
      mention: bot.me,
    },
    { target: "@u", replacement: `@${sender.split("@")[0]}`, mention: sender },
  ];

  let updatedMessage = message;
  let newMentions = [...mentions];

  // Replace mentions in the message and add corresponding mentions
  replacements.forEach(({ target, replacement, mention }) => {
    if (message.includes(target)) {
      updatedMessage = updatedMessage.replaceAll(target, replacement);
      newMentions.push(mention);
    }
  });

  // If any replacements occurred, send the message
  if (updatedMessage !== message) {
    await sock.sendMessage(chat, {
      text: updatedMessage,
      mentions: newMentions,
      edit: key,
    });
  }
};
