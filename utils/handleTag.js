export const handleTag = async (sock, data) => {
  const { chat, sender, message, key, ext } = data;
  if (message.includes("@me")) {
    const mentions = ext?.contextInfo?.mentionedJid
      ? [...ext.contextInfo.mentionedJid, "212722544028@s.whatsapp.net"]
      : ["212722544028@s.whatsapp.net"];
    await sock.sendMessage(chat, {
      text: message.replaceAll("@me", "@212722544028"),
      mentions: mentions,
      edit: key,
    });
  }
  if (message?.includes("@u")) {
    await sock.sendMessage(chat, {
      text: message.replaceAll("@u", `@${sender.split("@")[0]}`),
      mentions: [...ext.contextInfo.mentionedJid, sender],
      edit: key,
    });
  }
};
