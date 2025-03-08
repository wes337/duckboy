import { onMount, onCleanup, createSignal } from "solid-js";
import AudioPlayer from "../audio-player";
import state from "../state";
import { playSoundEffect } from "../utils";
import styles from "./player-intro.module.css";

export default function PlayerIntro() {
  const [enterClicked, setEnterClicked] = createSignal(false);

  const onEnter = () => {
    if (enterClicked()) {
      return;
    }

    AudioPlayer.visible = true;
    playSoundEffect("click-soft.mp3");
    setTimeout(() => playSoundEffect("click-hard.mp3"), 100);
    setEnterClicked(true);
  };

  onMount(() => {
    document.addEventListener("click", onEnter, { once: true });
    document.addEventListener("touchend", onEnter, { once: true });

    onCleanup(() => {
      document.removeEventListener("click", onEnter, { once: true });
      document.removeEventListener("touchend", onEnter, { once: true });
    });
  });

  return (
    <div
      classList={{
        [styles.playerIntro]: true,
        [styles.hide]: AudioPlayer.state.visible,
        [styles.done]: state.sceneDone("intro"),
      }}
    >
      <button class={styles.button} onClick={onEnter}>
        <span>Enter</span>
        <img class={styles.goldButton} src={`/gold-button.png`} />
      </button>
      <img src={`/player/player-intro.png`} />
    </div>
  );
}
