import { createSignal } from "solid-js";

const [playerVisible, setPlayerVisible] = createSignal(false);
const [introDone, setIntroDone] = createSignal(false);
const [volume, setVolume] = createSignal(1);
const [ashtrayOpen, setAshtrayOpen] = createSignal(false);
const [channel, setChannel] = createSignal("None");

export default {
  playerVisible,
  setPlayerVisible,
  introDone,
  setIntroDone,
  volume,
  setVolume,
  ashtrayOpen,
  setAshtrayOpen,
  channel,
  setChannel,
};
