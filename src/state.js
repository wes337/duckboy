import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SCENES } from "./constants";
import AudioPlayer from "./audio-player";

const [introDone, setIntroDone] = createSignal(false);
const [ashtrayOpen, setAshtrayOpen] = createSignal(false);

const [scenes, setScenes] = createStore(SCENES);

// Duck button events
const [duckHunt, setDuckHunt] = createSignal(false);
const [ads, setAds] = createSignal(false);
const [werewolves, setWerewolves] = createSignal(false);
const [ducky, setDucky] = createSignal("");

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

const [showContent, setShowContent] = createSignal("audio");

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
};
