import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./controls.module.css";

export default function Controls() {
  const onClickPlay = () => {
    if (AudioPlayer.playing || state.videoPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.play();
  };

  const onClickRewind = () => {
    if (state.videoPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.previous();
  };

  const onClickFastForward = () => {
    if (state.videoPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.next();
  };

  const onClickStop = () => {
    if (!AudioPlayer.playing || state.videoPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.pause();
  };

  return (
    <div class={styles.controls}>
      <button class={styles.play} onClick={onClickPlay}>
        <img src="/player/play.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: AudioPlayer.playing || state.videoPlayer.playing,
          }}
          src="/player/play-pressed.png"
        />
      </button>
      <button class={styles.rewind} onClick={onClickRewind}>
        <img src="/player/rw.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: state.videoPlayer.playing,
          }}
          src="/player/rw-pressed.png"
        />
      </button>
      <button class={styles.fastForward} onClick={onClickFastForward}>
        <img src="/player/ff.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: state.videoPlayer.playing,
          }}
          src="/player/ff-pressed.png"
        />
      </button>
      <button class={styles.stop} onClick={onClickStop}>
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
