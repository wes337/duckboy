import { createMemo, createEffect, onCleanup } from "solid-js";
import { CDN_URL } from "../constants";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import PlayerAudio from "./player-audio";
import state from "../state";
import styles from "./player-content.module.css";

export default function PlayerContent() {
  const initialized = () => state.sceneDone("intro");

  let videoEnd;

  const showVideoLong = createMemo(() => {
    return initialized() && state.showContent() === "video";
  });

  createEffect(() => {
    if (!initialized()) {
      return;
    }

    if (state.showContent() === "video") {
      const volume = AudioPlayer.volume;

      const video = document.getElementById("video");
      if (video) {
        video
          .play()
          .then(() => {
            video.volume = volume;
            video.muted = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      AudioPlayer.pause();
      state.setVideoPlayer("playing", true);
    }

    if (state.showContent() === "audio") {
      const video = document.getElementById("video");
      if (video) {
        video.pause();
      }

      state.setVideoPlayer("playing", false);
    }
  });

  onCleanup(() => {
    if (videoEnd) {
      clearTimeout(videoEnd);
    }
  });

  createEffect(() => {
    if (state.showContent() !== "static") {
      return;
    }

    AudioPlayer.pause();
    playSoundEffect("static.mp3");
    state.setCRT((crt) => {
      const nextCRT = crt + 1;
      const CRT_VIDEOS = 12;

      if (nextCRT > CRT_VIDEOS) {
        return 1;
      }

      return nextCRT;
    });
  });

  const onEnded = () => {
    if (!state.showContent().match(/video/gi)) {
      return;
    }

    const nextContent = state.showContent();
    state.setShowContent("static");
    videoEnd = setTimeout(() => {
      if (nextContent === "video") {
        state.gotoNextVideo();
      }

      state.setShowContent(nextContent);

      if (nextContent === "audio") {
        AudioPlayer.play();
      }
    }, 500);
  };

  return (
    <div class={styles.playerContent}>
      <video
        classList={{
          [styles.static]: true,
          [styles.on]: !initialized() || state.showContent() === "static",
        }}
        src={`${CDN_URL}/videos/fx/crt-${state.crt()}.mp4`}
        autoplay
        playsinline
        muted
        loop
      />
      <div
        classList={{
          [styles.video]: true,
          [styles.show]: showVideoLong(),
        }}
      >
        <div class={styles.inner}>
          <video
            id="video"
            src={`${CDN_URL}/videos/long/${state.video()}.mp4`}
            playsinline
            onEnded={onEnded}
            muted
          />
        </div>
      </div>
      <PlayerAudio />
    </div>
  );
}
