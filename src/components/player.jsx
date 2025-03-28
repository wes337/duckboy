import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import Ashtray from "./ashtray";
import TV from "./tv";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import PlayerContent from "./player-content";
import styles from "./player.module.css";

export default function Player() {
  const [initialized, setInitialized] = createSignal(false);
  const [highlightDuck, setHighlightDuck] = createSignal(false);
  const [duckButtonClicked, setDuckButtonClicked] = createSignal(false);

  createEffect(async () => {
    if (!initialized() || state.duckHunt() || duckButtonClicked()) {
      return;
    }

    const highlightDuckButton = () => {
      return new Promise((resolve) => {
        playSoundEffect("quack.mp3");
        setHighlightDuck(true);
        setTimeout(() => {
          setHighlightDuck(false);
          resolve();
        }, 500);
      });
    };

    const timeout = setTimeout(async () => {
      await highlightDuckButton();
      await highlightDuckButton();
    }, 100);

    const interval = setInterval(async () => {
      await highlightDuckButton();
      await highlightDuckButton();
    }, 30000);

    onCleanup(() => {
      clearInterval(interval);
      clearTimeout(timeout);
    });
  });

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

  const onClickDuckButton = () => {
    setDuckButtonClicked(true);
    playSoundEffect("duck.mp3");

    if (state.duckHunt()) {
      state.setDuckHunt(false);
    } else {
      state.setDuckHunt(true);
    }
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
        <TV />
        <button
          classList={{
            [styles.duckButton]: true,
            [styles.highlight]: highlightDuck(),
          }}
          onClick={onClickDuckButton}
        >
          <img src={`/player/duck.png`} />
          <img src={`/player/duck-pressed.png`} />
        </button>
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
