export const CDN_URL = "https://w-img.b-cdn.net/duckboy";

export const NUMBER_OF_VIDEOS = 23;

export const SCENES = {
  intro: {
    steps: 2,
    currentStep: 0,
  },
};

export const ALBUMS = {
  tragic: {
    id: "tragic",
    name: "tragic love songs to study to (vol. 5)",
    cover: `${CDN_URL}/images/album/tragic.jpg`,
    bumpers: [
      `${CDN_URL}/videos/bumpers/tragic.mp4`,
      `${CDN_URL}/videos/bumpers/summer.mp4`,
      `${CDN_URL}/videos/bumpers/cameo.mp4`,
    ],
  },
  hymns: {
    id: "hymns",
    name: "existential hymns for the average sigma (vol. 9)",
    cover: `${CDN_URL}/images/album/hymns.jpg`,
    bumpers: [
      `${CDN_URL}/videos/bumpers/hymns.mp4`,
      `${CDN_URL}/videos/bumpers/summer.mp4`,
      `${CDN_URL}/videos/bumpers/cameo.mp4`,
    ],
  },
};
