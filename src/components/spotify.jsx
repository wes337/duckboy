import { createEffect, createSignal, createMemo, onCleanup } from "solid-js";
import AudioPlayer from "../audio-player";
import styles from "./spotify.module.css";

export const SPOTIFY_ALBUM_IDS = {
  tragic: "5t1WhjJFLi5avb8t68AHCf",
  hymns: "0249YKLhbyTmcDuKp1nPEU",
};

export default function Spotify() {
  const [controller, setController] = createSignal(null);
  const currentAlbum = () => AudioPlayer.currentAlbum;
  const currentTrack = () => AudioPlayer.currentTrack;
  const albumId = createMemo(() => SPOTIFY_ALBUM_IDS[currentAlbum()]);

  createEffect(() => {
    if (!albumId()) {
      return;
    }

    window.onSpotifyIframeApiReady = (iframeAPI) => {
      const element = document.getElementById("spotify-embed");
      const options = {
        uri: `spotify:album:${albumId()}`,
      };

      iframeAPI.createController(element, options, (controller) =>
        setController(controller)
      );
    };

    onCleanup(() => {
      controller()?.destroy?.();
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
