import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SCENES } from "./constants";
import AudioPlayer from "./audio-player";

const [introDone, setIntroDone] = createSignal(false);
const [ashtrayOpen, setAshtrayOpen] = createSignal(false);
const [duckHunt, setDuckHunt] = createSignal(false);

const [scenes, setScenes] = createStore(SCENES);

const [videoPlayer, setVideoPlayer] = createStore({
  playing: false,
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

  showContent,
  setShowContent,
};
