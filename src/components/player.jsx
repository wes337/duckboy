import { createEffect, createSignal } from "solid-js";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import Ashtray from "./ashtray";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import PlayerContent from "./player-content";
import styles from "./player.module.css";

export default function Player() {
  const [initialized, setInitialized] = createSignal(false);

  createEffect(() => {
    if (!AudioPlayer.state.visible) {
      return;
    }

    setTimeout(() => playSoundEffect("clunk-down.mp3", true), 500);
  });

  createEffect(() => {
    const introDone = state.sceneDone("intro");

    if (!introDone || initialized()) {
      return;
    }

    console.log("Start player!");
    AudioPlayer.play();
    setInitialized(true);
  });

  const onClickDuckButton = (event) => {
    playSoundEffect("duck.mp3");
    state.setDuckHunt(true);
  };

  return (
    <>
      <div
        classList={{
          [styles.player]: true,
          [styles.visible]: AudioPlayer.state.visible,
        }}
        onAnimationEnd={() => state.sceneNextStep("intro")}
      >
        <img class={styles.playerBody} src={`/player/player-no-speakers.png`} />
        <img
          class={styles.speakerLeft}
          src={`/player/speaker-left.png`}
          style={{ transform: `scale(${AudioPlayer.state.speakerBoom})` }}
        />
        <img
          class={styles.speakerRight}
          src={`/player/speaker-right.png`}
          style={{ transform: `scale(${AudioPlayer.state.speakerBoom})` }}
        />
        <PlayerContent />
        <Ashtray />
        <VolumeSlider />
        <Controls />
        <button class={styles.duckButton} onClick={onClickDuckButton}>
          <img src={`/player/duck.png`} />
          <img src={`/player/duck-pressed.png`} />
        </button>
        <div class={styles.channel}>
          <div>{state.getChannel()}</div>
        </div>
      </div>
      <PlayerIntro />
    </>
  );
}
