import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SCENES, NUMBER_OF_VIDEOS } from "./constants";
import { randomNumberBetween } from "./utils";
import state from "./state";
import AudioPlayer from "./audio-player";

const [introDone, setIntroDone] = createSignal(false);
const [ashtrayOpen, setAshtrayOpen] = createSignal(false);
const [scenes, setScenes] = createStore(SCENES);

// Duck button events
const [duckHunt, setDuckHunt] = createSignal(false);
const [ads, setAds] = createSignal(false);
const [werewolves, setWerewolves] = createSignal(false);
const [freeze, setFreeze] = createSignal({
  iceOne: false,
  iceTwo: false,
});
const [ducky, setDucky] = createSignal("");

// Player
const [crt, setCRT] = createSignal(3);
const [video, setVideo] = createSignal(
  randomNumberBetween(1, NUMBER_OF_VIDEOS)
);
const [seenVideos, setSeenVideos] = createSignal([]);
const [showContent, setShowContent] = createSignal("audio");
const [videoPlayer, setVideoPlayer] = createStore({
  playing: false,
  paused: false,
});

const sceneDone = (scene) => {
  return scenes[scene].currentStep >= scenes[scene].steps;
};

const sceneNextStep = (scene) => {
  setScenes(scene, (s) => ({
    currentStep: Math.min(s.currentStep + 1, s.steps),
  }));
};

const getChannel = () => {
  if (videoPlayer.playing) {
    return "Videos";
  }

  if (AudioPlayer.playing) {
    return "Music";
  }

  return "None";
};

const getUnseenVideo = () => {
  if (seenVideos().length === NUMBER_OF_VIDEOS) {
    setSeenVideos([]);
    return getUnseenVideo();
  }

  const randomVideo = randomNumberBetween(1, NUMBER_OF_VIDEOS);

  if (seenVideos().includes(randomVideo)) {
    return getUnseenVideo();
  }

  setSeenVideos((seenVideos) => [...seenVideos, randomVideo]);

  return randomVideo;
};

export const gotoNextVideo = () => {
  if (state.showContent() === "static") {
    return;
  }

  setShowContent("static");

  setTimeout(() => {
    setShowContent("video");
  }, 500);

  setVideo(getUnseenVideo());
};

export const gotoPreviousVideo = () => {
  if (state.showContent() === "static") {
    return;
  }

  setShowContent("static");

  setTimeout(() => {
    setShowContent("video");
  }, 500);

  setVideo((video) => {
    const previousVideo = video - 1;

    if (previousVideo < 0) {
      return NUMBER_OF_VIDEOS - 1;
    }

    return previousVideo;
  });
};

export default {
  introDone,
  setIntroDone,
  ashtrayOpen,
  setAshtrayOpen,
  duckHunt,
  setDuckHunt,
  scenes,
  setScenes,
  sceneDone,
  sceneNextStep,
  getChannel,
  videoPlayer,
  setVideoPlayer,
  ads,
  setAds,
  showContent,
  setShowContent,
  werewolves,
  setWerewolves,
  ducky,
  setDucky,
  crt,
  setCRT,
  video,
  setVideo,
  gotoNextVideo,
  gotoPreviousVideo,
  freeze,
  setFreeze,
};
