import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import styles from "./controls.module.css";

export default function Controls() {
  const onClickPlay = () => {
    if (AudioPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.play();
  };

  const onClickRewind = () => {
    playSoundEffect("click-hard.mp3");
    AudioPlayer.previous();
  };

  const onClickFastForward = () => {
    playSoundEffect("click-hard.mp3");
    AudioPlayer.next();
  };

  const onClickStop = () => {
    if (!AudioPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.pause();
  };

  return (
    <div class={styles.controls}>
      <button classList={styles.play} onClick={onClickPlay}>
        <img src="/player/play.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: AudioPlayer.playing,
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
            [styles.on]: !AudioPlayer.playing,
          }}
          src="/player/stop-pressed.png"
        />
      </button>
    </div>
  );
}
