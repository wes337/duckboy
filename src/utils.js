export const CDN_URL = "https://w-img.b-cdn.net/duckboy";

export const playSoundEffect = (soundEffect, quiet) => {
  try {
    const url = `${CDN_URL}/sounds/${soundEffect}`;
    const audio = new Audio(url);

    audio.volume = quiet ? 0.1 : 0.3;

    const playPromise = audio.play().catch(() => {
      // Do nothing
    });

    if (playPromise !== undefined) {
      audio
        .play()
        .then(() => {
          audio.remove();
        })
        .catch(() => {
          // Do nothing
          return;
        });
    }
  } catch {
    // Do nothing
  }
};
