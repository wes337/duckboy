import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./tv.module.css";

export default function TV() {
  const onClickTV = () => {
    if (state.showContent() === "video" || state.showContent() === "static") {
      return;
    }

    const nextContent =
      state.showContent() === "video-long" ? "audio" : "video-long";

    state.setShowContent("static");

    setTimeout(() => {
      state.setShowContent(nextContent);

      if (nextContent === "audio") {
        AudioPlayer.play();
        state.setVideoPlayer("playing", false);
      }
    }, 500);
  };

  return (
    <div class={styles.tv}>
      <button class={styles.stop} onClick={onClickTV}>
        <img src="/player/tv.png" />
        <img
          classList={{
            [styles.pressed]: true,
            [styles.on]: state.videoPlayer.playing,
          }}
          src="/player/tv-pressed.png"
        />
      </button>
    </div>
  );
}
