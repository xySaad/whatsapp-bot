import tiktokDl from "@tobyg74/tiktok-api-dl";
import getFBInfo from "@xaviabot/fb-downloader";
import { decodeHtmlEntities } from "./decode.js";

export const handleDownload = async (bot, url, platform) => {
  await bot.react("🕒");

  const res = {
    ok: true,
    video: { url: null, caption: null },
    error: null,
  };

  try {
    var videoInfo;
    if (platform === "tiktok") {
      var version = "3";

      if (url[0] > 0) {
        version = url[0];
      }

      videoInfo = await tiktokDl.Downloader(url, {
        version: `v${version}`,
      });
      res.video.caption = videoInfo?.result.desc
        ? videoInfo?.result.desc.substring(0, 35)
        : "";
      res.video.url = videoInfo?.result?.videoHD || videoInfo?.result?.video;
    } else if (platform === "facebook") {
      videoInfo = await getFBInfo(url);
      res.video.caption =
        decodeHtmlEntities(videoInfo?.title).substring(0, 35) || "";
      res.video.url = videoInfo.hd || videoInfo.sd;
    }
  } catch (error) {
    console.error(error.message);
    res.error = error.message;
    res.ok = false;
  }
  if (!res.ok) {
    bot.react("🚫");
  } else if (res.ok && res.video.url) {
    await bot.reply({
      video: { url: res.video.url },
      caption: res.video.caption,
    });
    bot.react("✅");
  }
};
