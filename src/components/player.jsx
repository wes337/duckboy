import { onMount, createSignal, createEffect, onCleanup } from "solid-js";
import state from "../state";
import { playSoundEffect } from "../utils";
import Ashtray from "./ashtray";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import styles from "./player.module.css";

export default function Player() {
  createEffect(() => {
    if (!state.playerVisible()) {
      return;
    }

    setTimeout(() => playSoundEffect("clunk-down.mp3", true), 500);
  });

  const onClickDuckButton = (event) => {
    playSoundEffect("duck.mp3");
  };

  return (
    <>
      <div
        classList={{
          [styles.player]: true,
          [styles.visible]: state.playerVisible(),
        }}
        onAnimationEnd={() => state.setIntroDone(true)}
      >
        <img class={styles.playerBody} src={`/player/player-full.png`} />
        <div class={styles.main}>
          <video
            class={styles.static}
            src={`/videos/crt-2.mp4`}
            autoplay
            playsinline
            muted
            loop
          />
        </div>
        <Ashtray />
        <VolumeSlider />
        <Controls />
        <button class={styles.duckButton} onClick={onClickDuckButton}>
          <img src={`/player/duck.png`} />
          <img src={`/player/duck-pressed.png`} />
        </button>
        <div class={styles.channel}>
          <div>{state.channel()}</div>
        </div>
      </div>
      <PlayerIntro />
    </>
  );
}
