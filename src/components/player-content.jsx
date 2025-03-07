import {
  createMemo,
  createSignal,
  createEffect,
  onCleanup,
  Switch,
} from "solid-js";
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

  const onVideoStart = () => {
    const volume = AudioPlayer.volume;

    const shortCameoVideo = document.getElementById("short-cameo");
    if (shortCameoVideo) {
      shortCameoVideo.volume = volume;
    }

    const longCameoVideo = document.getElementById("long-cameo");
    if (longCameoVideo) {
      longCameoVideo.volume = volume;
    }

    state.setVideoPlayer("playing", true);
    AudioPlayer.pause();
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
        <Switch
          fallback={
            <video
              class={styles.static}
              src={`${CDN_URL}/videos/fx/crt-${crt()}.mp4`}
              autoplay
              playsinline
              muted
              loop
            />
          }
        >
          <Match when={showVideo()}>
            <div class={styles.video}>
              <video
                id="short-cameo"
                ref={video}
                src={`${CDN_URL}/videos/short/${shortCameo()}.mp4`}
                autoplay
                playsinline
                onPlay={onVideoStart}
                onEnded={onShortCameoEnd}
              />
            </div>
          </Match>
          <Match when={showVideoLong()}>
            <div class={styles.video}>
              <video
                id="long-cameo"
                src={`${CDN_URL}/videos/long/${longCameo()}.mp4`}
                autoplay
                playsinline
                onPlay={onVideoStart}
                onEnded={onLongCameoEnd}
              />
            </div>
          </Match>
          <Match when={showAudio()}>
            <div class={styles.audio}>
              <div class={styles.inner}>
                <img
                  class={styles.borderTop}
                  src={`/patterns/gold-border-y.png`}
                />
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
          </Match>
        </Switch>
      </div>
    </>
  );
}
