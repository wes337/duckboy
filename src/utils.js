import { Howl } from "howler";

export const CDN_URL = "https://w-img.b-cdn.net/duckboy";

export const playSoundEffect = (soundEffect, quiet) => {
  return new Promise((resolve) => {
    try {
      const url = `${CDN_URL}/sounds/${soundEffect}`;

      const sound = new Howl({
        src: [url],
        volume: quiet ? 0.5 : 1,
        onend: () => {
          resolve();
        },
      });

      sound.play();
    } catch {
      // Do nothing
      resolve();
    }
  });
};

export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const calculateTime = (seconds) => {
  try {
    const _minute = Math.floor(seconds / 60);
    const minute = _minute < 10 ? `0${_minute}` : `${_minute}`;
    const _second = Math.floor(seconds % 60);
    const second = _second < 10 ? `0${_second}` : `${_second}`;
    return `${minute}:${second}`;
  } catch {
    return `00:00`;
  }
};

export function isMacOS() {
  const isMacUserAgent = /Mac OS X/i.test(navigator.userAgent);
  const isMacPlatform = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isMacUserAgentData = navigator.userAgentData
    ? navigator.userAgentData.platform === "macOS"
    : false;

  return isMacUserAgent || isMacPlatform || isMacUserAgentData;
}

export async function preloadVideos(videoUrls) {
  const videoPromises = videoUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.addEventListener("loadeddata", () => {
        resolve(video);
      });

      video.addEventListener("error", (error) => {
        reject(error);
      });

      video.preload = "auto";
      video.muted = true;
      video.volume = 0;
      video.src = url;
      video.load();
    });
  });

  await Promise.all(videoPromises);
}
