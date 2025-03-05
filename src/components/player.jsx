import { createEffect } from "solid-js";
import state from "../state";
import { playSoundEffect } from "../utils";
import Ashtray from "./ashtray";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import PlayerContent from "./player-content";
import styles from "./player.module.css";

export default function Player() {
  createEffect(() => {
    state.speakerBoom();
  });

  createEffect(() => {
    if (!state.player.visible) {
      return;
    }

    setTimeout(() => playSoundEffect("clunk-down.mp3", true), 500);
  });

  createEffect(() => {
    const introDone = state.sceneDone("intro");

    if (!introDone) {
      return;
    }

    console.log("Start player!");
    state.setPlayer("playing", true);
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
          [styles.visible]: state.player.visible,
        }}
        onAnimationEnd={() => state.sceneNextStep("intro")}
      >
        <img class={styles.playerBody} src={`/player/player-no-speakers.png`} />
        <img
          class={styles.speakerLeft}
          src={`/player/speaker-left.png`}
          style={{ transform: `scale(${state.speakerBoom()})` }}
        />
        <img
          class={styles.speakerRight}
          src={`/player/speaker-right.png`}
          style={{ transform: `scale(${state.speakerBoom()})` }}
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
