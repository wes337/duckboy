import { createEffect, createSignal, Show } from "solid-js";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import Ashtray from "./ashtray";
import TV from "./tv";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import PlayerContent from "./player-content";
import DuckButton from "./duck-button";
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

    setInitialized(true);
    AudioPlayer.play();
  });

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
        <TV />
        <DuckButton />
        <div class={styles.channel}>
          <Show when={state.getChannel() !== "None"}>
            <img
              src={`/images/${
                state.getChannel() === "Music" ? "music" : "cherry"
              }-icon.png`}
            />
          </Show>
          <div class={styles.label}>{state.getChannel()}</div>
          <Show when={state.getChannel() !== "None"}>
            <img
              src={`/images/${
                state.getChannel() === "Music" ? "music" : "cherry"
              }-icon.png`}
            />
          </Show>
        </div>
      </div>
      <PlayerIntro />
    </>
  );
}
