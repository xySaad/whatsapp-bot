import tiktokDl from "@tobyg74/tiktok-api-dl";

export const getTiktok = async (sock, m, { tiktokLink, chat }) => {
  try {
    // Convert ReadableStream to Buffer
    async function streamToBuffer(stream) {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    // Function to download video using fetch and return a buffer
    async function downloadVideo(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      const videoBuffer = await streamToBuffer(response.body); // Convert stream to buffer
      return videoBuffer;
    }

    const videoInfo = await tiktokDl.Downloader(tiktokLink, {
      version: "v3",
    });

    const videoBuffer = await downloadVideo(videoInfo?.result?.videoHD);

    sock.sendMessage(
      chat,
      {
        video: videoBuffer,
        caption: videoInfo?.result.desc.substring(0, 35),
      },
      {
        quoted: m.messages[0],
      }
    );
  } catch (error) {
    sock.sendMessage(
      chat,
      { text: "ra kayn error ajmi" },
      { quoted: m.messages[0] }
    );
    console.error(error.message);
  }
};
