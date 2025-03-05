import { CDN_URL } from "./utils";

export const TRACKS = [
  {
    artist: "DUCKBOY",
    name: "EXCALIBUR",
    cover: `${CDN_URL}/images/album/hymns.jpg`,
    src: `${CDN_URL}/music/EXCALIBUR.mp3`,
    type: "audio",
  },
  {
    artist: "DUCKBOY",
    name: "my love life needs a lobotomy",
    cover: `${CDN_URL}/images/album/tragic.jpg`,
    src: `${CDN_URL}/music/${encodeURIComponent(
      "my love life needs a lobotomy"
    )}.mp3`,
    type: "audio",
  },
];

export const SCENES = {
  intro: {
    steps: 2,
    currentStep: 0,
  },
};
