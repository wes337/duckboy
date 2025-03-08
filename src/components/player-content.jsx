import { createMemo, createSignal, createEffect, onCleanup } from "solid-js";
import { CDN_URL, playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./player-content.module.css";

export default function PlayerContent() {
  const initialized = () => state.sceneDone("intro");

  const [crt, setCRT] = createSignal(3);
  const [shortCameo, setShortCameo] = createSignal(1);
  const [longCameo, setLongCameo] = createSignal(1);
  const [lastVideoEnded, setLastVideoEnded] = createSignal(null);

  const currentTrack = () => AudioPlayer.currentTrack;

  let videoEnd;

  const showAudio = createMemo(() => {
    return initialized() && state.showContent() === "audio";
  });

  const showVideo = createMemo(() => {
    return initialized() && state.showContent() === "video";
  });

  const showVideoLong = createMemo(() => {
    return initialized() && state.showContent() === "video-long";
  });

  createEffect(() => {
    if (!initialized()) {
      return;
    }

    if (state.showContent() === "video") {
      const volume = AudioPlayer.volume;

      const shortCameoVideo = document.getElementById("short-cameo");
      if (shortCameoVideo) {
        shortCameoVideo
          .play()
          .then(() => {
            shortCameoVideo.volume = volume;
            shortCameoVideo.muted = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      AudioPlayer.pause();
      state.setVideoPlayer("playing", true);
    }

    if (state.showContent() === "video-long") {
      const volume = AudioPlayer.volume;

      const longCameoVideo = document.getElementById("long-cameo");
      if (longCameoVideo) {
        longCameoVideo
          .play()
          .then(() => {
            longCameoVideo.volume = volume;
            longCameoVideo.muted = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      AudioPlayer.pause();
      state.setVideoPlayer("playing", true);
    }

    if (state.showContent() === "audio") {
      const shortCameoVideo = document.getElementById("short-cameo");
      if (shortCameoVideo) {
        shortCameoVideo.pause();
      }

      const longCameoVideo = document.getElementById("long-cameo");
      if (longCameoVideo) {
        longCameoVideo.pause();
      }
    }

    console.log(state.showContent());
  });

  createEffect(() => {
    if (!initialized()) {
      return;
    }

    const interval = setInterval(() => {
      if (!AudioPlayer.playing || state.videoPlayer.playing) {
        return;
      }

      const play =
        lastVideoEnded() === null || lastVideoEnded() < Date.now() - 3500;

      if (!play) {
        return;
      }

      state.setShowContent("static");

      setTimeout(() => {
        state.setShowContent("video");
      }, 500);
    }, 10000);

    onCleanup(() => {
      clearInterval(interval);
    });
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
    setCRT((crt) => {
      const nextCRT = crt + 1;
      const CRT_VIDEOS = 12;

      if (nextCRT > CRT_VIDEOS) {
        return 1;
      }

      return nextCRT;
    });
  });

  const onShortCameoEnd = () => {
    if (state.showContent() !== "video") {
      return;
    }

    state.setShowContent("static");
    videoEnd = setTimeout(() => {
      setShortCameo((shortCameo) => {
        const nextShortCameo = shortCameo + 1;
        const SHORT_CAMEO_VIDS = 11;

        if (nextShortCameo > SHORT_CAMEO_VIDS) {
          return 1;
        }

        return nextShortCameo;
      });

      state.setShowContent("audio");
      AudioPlayer.play();
      state.setVideoPlayer("playing", false);
      setLastVideoEnded(Date.now());
    }, 500);
  };

  const onLongCameoEnd = () => {
    if (state.showContent() !== "video-long") {
      return;
    }

    state.setShowContent("static");
    videoEnd = setTimeout(() => {
      setLongCameo((longCameo) => {
        const nextLongCameo = longCameo + 1;
        const LONG_CAMEO_VIDS = 12;

        if (nextLongCameo > LONG_CAMEO_VIDS) {
          return 1;
        }

        return nextLongCameo;
      });

      state.setShowContent("video-long");
      setLastVideoEnded(Date.now());
    }, 500);
  };

  return (
    <>
      <div class={styles.playerContent}>
        <video
          classList={{
            [styles.static]: true,
            [styles.on]: !initialized() || state.showContent() === "static",
          }}
          src={`${CDN_URL}/videos/fx/crt-${crt()}.mp4`}
          autoplay
          playsinline
          muted
          loop
        />

        <div
          classList={{
            [styles.shortCameo]: true,
            [styles.show]: showVideo(),
          }}
        >
          <div class={styles.video}>
            <video
              id="short-cameo"
              src={`${CDN_URL}/videos/short/${shortCameo()}.mp4`}
              playsinline
              onEnded={onShortCameoEnd}
              muted
            />
          </div>
        </div>
        <div
          classList={{
            [styles.longCameo]: true,
            [styles.show]: showVideoLong(),
          }}
        >
          <div class={styles.video}>
            <video
              id="long-cameo"
              src={`${CDN_URL}/videos/long/${longCameo()}.mp4`}
              playsinline
              onEnded={onLongCameoEnd}
              muted
            />
          </div>
        </div>
        <div classList={{ [styles.audio]: true, [styles.show]: showAudio() }}>
          <div class={styles.inner}>
            <img class={styles.borderTop} src={`/patterns/gold-border-y.png`} />
            <img
              class={styles.borderBottom}
              src={`/patterns/gold-border-y.png`}
            />
            <img
              class={styles.borderLeft}
              src={`/patterns/gold-border-x.png`}
            />
            <img
              class={styles.borderRight}
              src={`/patterns/gold-border-x.png`}
            />
            <div class={styles.cover}>
              <img src={currentTrack().cover} />
            </div>
            <div class={styles.details}>
              <div class={styles.artist}>{currentTrack().artist}</div>
              <div class={styles.name}>
                <marquee>{currentTrack().name}</marquee>
              </div>
              <div class={styles.seek}>
                <img class={styles.bar} src={`/player/seek-bar.png`} />
                <img
                  class={styles.knob}
                  src={`/player/seek-knob.png`}
                  style={{ left: `${AudioPlayer.seek}%` }}
                />
              </div>
              <div class={styles.duration}>
                <div>{AudioPlayer.currentTime}</div>/
                <div>{AudioPlayer.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
