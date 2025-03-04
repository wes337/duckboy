import { playSoundEffect } from "../utils";
import state from "../state";
import styles from "./controls.module.css";

export default function Controls() {
  const onClickPlay = () => {
    playSoundEffect("click-hard.mp3");
  };

  const onClickRewind = () => {
    playSoundEffect("click-hard.mp3");
  };
  const onClickFastForward = () => {
    playSoundEffect("click-hard.mp3");
  };

  const onClickStop = () => {
    playSoundEffect("click-hard.mp3");
  };

  return (
    <div class={styles.controls}>
      <button classList={styles.play} onClick={onClickPlay}>
        <img src="/player/play.png" />
        <img class={styles.pressed} src="/player/play-pressed.png" />
      </button>
      <button classList={styles.rewind} onClick={onClickRewind}>
        <img src="/player/rw.png" />
        <img class={styles.pressed} src="/player/rw-pressed.png" />
      </button>
      <button classList={styles.fastForward} onClick={onClickFastForward}>
        <img src="/player/ff.png" />
        <img class={styles.pressed} src="/player/ff-pressed.png" />
      </button>
      <button classList={styles.stop} onClick={onClickStop}>
        <img src="/player/stop.png" />
        <img class={styles.pressed} src="/player/stop-pressed.png" />
      </button>
    </div>
  );
}
