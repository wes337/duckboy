import AudioPlayer from "../audio-player";
import state from "../state";
import { playSoundEffect } from "../utils";
import styles from "./player-intro.module.css";

export default function PlayerIntro() {
  return (
    <div
      classList={{
        [styles.playerIntro]: true,
        [styles.hide]: AudioPlayer.state.visible,
        [styles.done]: state.sceneDone("intro"),
      }}
    >
      <button
        class={styles.button}
        onClick={() => {
          AudioPlayer.visible = true;
          playSoundEffect("click-soft.mp3");
          setTimeout(() => playSoundEffect("click-hard.mp3"), 100);
        }}
      >
        <span>Enter</span>
        <img class={styles.goldButton} src={`/gold-button.png`} />
      </button>
      <img src={`/player/player-intro.png`} />
    </div>
  );
}
