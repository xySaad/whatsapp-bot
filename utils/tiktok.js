import tiktokDl from "@tobyg74/tiktok-api-dl";

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

export const getTiktok = async (tiktokLink) => {
  const res = {
    ok: true,
    video: { buffer: null, caption: null },
    error: null,
  };

  try {
    const videoInfo = await tiktokDl.Downloader(tiktokLink, {
      version: "v3",
    });
    res.video.caption = videoInfo?.result.desc
      ? videoInfo?.result.desc.substring(0, 35)
      : "";
    const videoBuffer = await downloadVideo(videoInfo?.result?.videoHD);
    res.video.buffer = videoBuffer;
  } catch (error) {
    console.error(error.message);
    res.error = error.message;
    res.ok = false;
    return res;
  }
  return res;
};
