export const CDN_URL = "https://w-img.b-cdn.net/duckboy";

export const playSoundEffect = (soundEffect, quiet) => {
  return new Promise((resolve) => {
    try {
      const url = `${CDN_URL}/sounds/${soundEffect}`;
      const audio = new Audio(url);

      audio.volume = quiet ? 0.1 : 0.3;

      const playPromise = audio.play().catch(() => {
        // Do nothing
        resolve();
      });

      if (playPromise !== undefined) {
        audio
          .play()
          .then(() => {
            audio.remove();
            resolve();
          })
          .catch(() => {
            // Do nothing
            resolve();
          });
      }
    } catch {
      // Do nothing
      resolve();
    }
  });
};

export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
