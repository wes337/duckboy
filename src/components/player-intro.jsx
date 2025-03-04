import state from "../state";
import { playSoundEffect } from "../utils";
import styles from "./player-intro.module.css";

export default function PlayerIntro() {
  return (
    <div
      classList={{
        [styles.playerIntro]: true,
        [styles.hide]: state.playerVisible(),
        [styles.done]: state.introDone(),
      }}
    >
      <button
        class={styles.button}
        onClick={() => {
          state.setPlayerVisible(true);
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
