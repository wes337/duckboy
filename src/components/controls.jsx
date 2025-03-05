import { playSoundEffect } from "../utils";
import state from "../state";
import styles from "./controls.module.css";

export default function Controls() {
  const onClickPlay = () => {
    if (state.player.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    state.setPlayer("playing", true);
  };

  const onClickRewind = () => {
    playSoundEffect("click-hard.mp3");
  };

  const onClickFastForward = () => {
    playSoundEffect("click-hard.mp3");
    state.playerNextTrack();
  };

  const onClickStop = () => {
    if (!state.player.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    state.setPlayer("playing", false);
  };

  return (
    <div class={styles.controls}>
      <button classList={styles.play} onClick={onClickPlay}>
        <img src="/player/play.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: state.player.playing,
          }}
          src="/player/play-pressed.png"
        />
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
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: !state.player.playing,
          }}
          src="/player/stop-pressed.png"
        />
      </button>
    </div>
  );
}
