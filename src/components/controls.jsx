import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./controls.module.css";
import { gotoNextLongCameo, gotoPreviousLongCameo } from "./player-content";

export default function Controls() {
  const onClickPlay = () => {
    if (state.videoPlayer.playing) {
      document.getElementById("long-cameo")?.play();
      state.setVideoPlayer("paused", false);
      return;
    }

    if (AudioPlayer.playing) {
      return;
    }

    playSoundEffect("click-hard.mp3");
    AudioPlayer.play();
  };

  const onClickRewind = () => {
    playSoundEffect("click-hard.mp3");

    if (state.videoPlayer.playing) {
      gotoPreviousLongCameo();
      document.getElementById("long-cameo")?.play();
      state.setVideoPlayer("paused", false);
      return;
    }

    AudioPlayer.previous();
  };

  const onClickFastForward = () => {
    playSoundEffect("click-hard.mp3");

    if (state.videoPlayer.playing) {
      gotoNextLongCameo();
      document.getElementById("long-cameo")?.play();
      state.setVideoPlayer("paused", false);
      return;
    }

    AudioPlayer.next();
  };

  const onClickStop = () => {
    if (state.videoPlayer.playing) {
      document.getElementById("long-cameo")?.pause();
      state.setVideoPlayer("paused", true);
      return;
    }

    if (!AudioPlayer.playing) {
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
            [styles.on]: state.videoPlayer.playing
              ? !state.videoPlayer.paused
              : AudioPlayer.playing,
          }}
          src="/player/play-pressed.png"
        />
      </button>
      <button class={styles.rewind} onClick={onClickRewind}>
        <img src="/player/rw.png" />
        <img
          classList={{
            [styles.pressed]: true,
          }}
          src="/player/rw-pressed.png"
        />
      </button>
      <button class={styles.fastForward} onClick={onClickFastForward}>
        <img src="/player/ff.png" />
        <img
          classList={{
            [styles.pressed]: true,
          }}
          src="/player/ff-pressed.png"
        />
      </button>
      <button class={styles.stop} onClick={onClickStop}>
        <img src="/player/stop.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: state.videoPlayer.playing
              ? state.videoPlayer.paused
              : !AudioPlayer.playing,
          }}
          src="/player/stop-pressed.png"
        />
      </button>
    </div>
  );
}
