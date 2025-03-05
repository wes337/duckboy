import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SCENES, TRACKS } from "./constants";

const [introDone, setIntroDone] = createSignal(false);
const [ashtrayOpen, setAshtrayOpen] = createSignal(false);
const [duckHunt, setDuckHunt] = createSignal(false);

const [scenes, setScenes] = createStore(SCENES);
const [player, setPlayer] = createStore({
  playing: false,
  currentTrack: 0,
  volume: 1,
  visible: false,
  tracks: TRACKS,
});

const [speakerBoom, setSpeakerBoom] = createSignal("1");

const sceneDone = (scene) => {
  return scenes[scene].currentStep >= scenes[scene].steps;
};

const sceneNextStep = (scene) => {
  setScenes(scene, (s) => ({
    currentStep: Math.min(s.currentStep + 1, s.steps),
  }));
};

const playerNextTrack = () => {
  const nextTrack = player.currentTrack + 1;
  setPlayer("currentTrack", player.tracks[nextTrack] ? nextTrack : 0);
};

const getChannel = () => {
  const currentTrack = player.tracks[player.currentTrack];

  if (player.playing && currentTrack.type === "audio") {
    return "Music";
  }

  if (player.playing && currentTrack.type === "video") {
    return "Videos";
  }

  return "None";
};

export default {
  introDone,
  setIntroDone,
  ashtrayOpen,
  setAshtrayOpen,
  duckHunt,
  setDuckHunt,
  player,
  setPlayer,
  scenes,
  setScenes,
  sceneDone,
  sceneNextStep,
  playerNextTrack,
  getChannel,
  speakerBoom,
  setSpeakerBoom,
};
