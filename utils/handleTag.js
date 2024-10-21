export const handleTag = async (bot) => {
  const { sock } = bot;
  const { chat, sender, text, key, ext } = bot.Message;
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

  let updatedMessage = text;
  let newMentions = [...mentions];

  // Replace mentions in the message and add corresponding mentions
  replacements.forEach(({ target, replacement, mention }) => {
    if (text.includes(target)) {
      updatedMessage = updatedMessage.replaceAll(target, replacement);
      newMentions.push(mention);
    }
  });

  // If any replacements occurred, send the message
  if (updatedMessage !== text) {
    await sock.sendMessage(chat, {
      text: updatedMessage,
      mentions: newMentions,
      edit: key,
    });
  }
};
