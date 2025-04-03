import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import AudioPlayer from "../audio-player";
import styles from "./spotify.module.css";

export default function Spotify() {
  const [controller, setController] = createSignal(null);
  const currentTrack = () => AudioPlayer.currentTrack;

  onMount(() => {
    let interval;

    window.onSpotifyIframeApiReady = (iframeAPI) => {
      const element = document.getElementById("spotify-embed");
      const options = {
        uri: `spotify:album:5t1WhjJFLi5avb8t68AHCf`,
      };

      iframeAPI.createController(element, options, (controller) => {
        setController(controller);

        controller.addListener("ready", () => {
          controller.pause();

          if (interval) {
            clearInterval(interval);
          }

          controller.play();

          interval = setInterval(() => controller?.pause?.(), 50);
        });
      });
    };

    onCleanup(() => {
      if (controller()) {
        controller().destroy?.();
      }

      if (interval) {
        clearInterval(interval);
      }
    });
  });

  createEffect(() => {
    if (!currentTrack() || !controller()) {
      return;
    }

    controller().loadUri(`spotify:track:${currentTrack().spotifyId}`);
  });

  return (
    <div class={styles.spotify}>
      <div id="spotify-embed" />
    </div>
  );
}
