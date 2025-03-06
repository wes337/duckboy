import {
  createMemo,
  createSignal,
  createEffect,
  onCleanup,
  Switch,
} from "solid-js";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./player-content.module.css";

export default function PlayerContent() {
  const initialized = () => state.sceneDone("intro");

  const [crt, setCRT] = createSignal(3);
  const [cameo, setCameo] = createSignal(1);

  const currentTrack = () => AudioPlayer.currentTrack;

  let video;
  let videoEnd;

  const showAudio = createMemo(() => {
    return initialized() && state.showContent() === "audio";
  });

  const showVideo = createMemo(() => {
    return initialized() && state.showContent() === "video";
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

  const onVideoEnd = () => {
    state.setShowContent("static");
    videoEnd = setTimeout(() => {
      setCameo((cameo) => {
        const nextCameo = cameo + 1;
        const CAMEO_VIDS = 11;

        if (nextCameo > CAMEO_VIDS) {
          return 1;
        }

        return nextCameo;
      });

      state.setShowContent("audio");
      AudioPlayer.play();
      state.setVideoPlayer("playing", false);
    }, 500);
  };

  const onVideoStart = () => {
    const volume = AudioPlayer.volume;
    video.volume = volume;
    state.setVideoPlayer("playing", true);
    AudioPlayer.pause();
  };

  return (
    <>
      <div class={styles.playerContent}>
        <video
          ref={video}
          classList={{
            [styles.static]: true,
            [styles.on]: !initialized() || state.showContent() === "static",
          }}
          src={`/videos/fx/crt-${crt()}.mp4`}
          autoplay
          playsinline
          muted
          loop
        />
        <Switch
          fallback={
            <video
              class={styles.static}
              src={`/videos/fx/crt-${crt()}.mp4`}
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
                src={`/videos/cameos/short/${cameo()}.mp4`}
                autoplay
                playsinline
                onPlay={onVideoStart}
                onEnded={onVideoEnd}
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
