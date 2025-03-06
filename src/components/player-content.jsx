import { createMemo, Switch } from "solid-js";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./player-content.module.css";

export default function PlayerContent() {
  const currentTrack = () => AudioPlayer.currentTrack;

  const showAudio = createMemo(() => {
    const introFinished = state.sceneDone("intro");
    return introFinished && currentTrack().type === "audio";
  });

  return (
    <>
      <div class={styles.playerContent}>
        <video
          classList={{ [styles.static]: true, [styles.on]: !showAudio() }}
          src={`/videos/crt-2.mp4`}
          autoplay
          playsinline
          muted
          loop
        />
        <Switch
          fallback={
            <video
              class={styles.static}
              src={`/videos/crt.mp4`}
              autoplay
              playsinline
              muted
              loop
            />
          }
        >
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
