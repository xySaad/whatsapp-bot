import tiktokDl from "@tobyg74/tiktok-api-dl";

export const getTiktok = async (tiktokLink) => {
  var version = "3";

  if (tiktokLink[0] > 0) {
    version = tiktokLink[0];
  }

  const res = {
    ok: true,
    video: { url: null, caption: null },
    error: null,
  };

  try {
    const videoInfo = await tiktokDl.Downloader(tiktokLink, {
      version: `v${version}`,
    });

    res.video.caption = videoInfo?.result.desc
      ? videoInfo?.result.desc.substring(0, 35)
      : "";
    const videoUrl = videoInfo?.result?.videoHD || videoInfo?.result?.video;

    res.video.url = videoUrl;
  } catch (error) {
    console.error(error.message);
    res.error = error.message;
    res.ok = false;
    return res;
  }
  return res;
};
