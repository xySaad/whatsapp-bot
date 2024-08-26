export const handleTag = async (sock, data) => {
  const { chat, sender, message, key, ext } = data;
  const mentions = ext?.contextInfo?.mentionedJid || [];

  // Prepare replacements
  const replacements = [
    {
      target: "@me",
      replacement: "@212722544028",
      mention: "212722544028@s.whatsapp.net",
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
