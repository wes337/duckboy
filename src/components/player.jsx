import { createEffect, createSignal, For, Show } from "solid-js";
import { playSoundEffect } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import Ashtray from "./ashtray";
import TV from "./tv";
import PlayerIntro from "./player-intro";
import VolumeSlider from "./volume-slider";
import Controls from "./controls";
import PlayerContent from "./player-content";
import DuckButton from "./duck-button";
import { Ice } from "./freeze";
import styles from "./player.module.css";

export default function Player() {
  const [initialized, setInitialized] = createSignal(false);

  createEffect(() => {
    if (!AudioPlayer.state.visible) {
      return;
    }

    setTimeout(() => playSoundEffect("clunk-down.mp3", true), 500);
  });

  createEffect(() => {
    const introDone = state.sceneDone("intro");

    if (!introDone || initialized()) {
      return;
    }

    setInitialized(true);
    AudioPlayer.play();
  });

  const renderAlbumButtons = () => {
    const albums = [
      { album: "coping", color: "orange" },
      { album: "hymns", color: "blue" },
      { album: "tragic", color: "green" },
    ];

    return (
      <div class={styles.albums}>
        <For each={albums}>
          {({ album, color }) => {
            return (
              <button
                classList={{
                  [styles.album]: true,
                  [styles.active]:
                    state.showContent() === "audio" &&
                    AudioPlayer.currentTrack?.album === album,
                }}
                onClick={() => {
                  playSoundEffect("click-softest.mp3", true);

                  if (state.showContent() === "video") {
                    state.setShowContent("static");

                    setTimeout(() => {
                      state.setShowContent("audio");
                      AudioPlayer.gotoAlbum(album);
                      AudioPlayer.play();
                      state.setVideoPlayer("playing", false);
                    }, 500);
                  } else if (AudioPlayer.currentAlbum !== album) {
                    AudioPlayer.gotoAlbum(album);
                  }
                }}
              >
                <img src={`/player/${color}-button.png`} alt="" />
              </button>
            );
          }}
        </For>
      </div>
    );
  };

  return (
    <>
      <div
        classList={{
          [styles.player]: true,
          [styles.visible]: AudioPlayer.state.visible,
        }}
        onAnimationEnd={() => state.sceneNextStep("intro")}
      >
        <img class={styles.playerBody} src={`/player/player-no-speakers.png`} />
        <img
          class={styles.speakerLeft}
          src={`/player/speaker-left.png`}
          style={{ transform: `scale(${AudioPlayer.state.speakerBoom})` }}
        />
        <img
          class={styles.speakerRight}
          src={`/player/speaker-right.png`}
          style={{ transform: `scale(${AudioPlayer.state.speakerBoom})` }}
        />
        <PlayerContent />
        <Ashtray />
        <VolumeSlider />
        <Controls />
        <TV />
        <DuckButton />
        <Ice />
        {renderAlbumButtons()}
        <div class={styles.channel}>
          <Show when={state.getChannel() !== "None"}>
            <img
              src={`/images/${
                state.getChannel() === "Music" ? "music" : "cherry"
              }-icon.png`}
            />
          </Show>
          <div class={styles.label}>{state.getChannel()}</div>
          <Show when={state.getChannel() !== "None"}>
            <img
              src={`/images/${
                state.getChannel() === "Music" ? "music" : "cherry"
              }-icon.png`}
            />
          </Show>
        </div>
      </div>
      <PlayerIntro />
    </>
  );
}
