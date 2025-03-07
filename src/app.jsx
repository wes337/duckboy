import { onMount, onCleanup } from "solid-js";
import { CDN_URL, preloadVideos } from "./utils";
import AudioPlayer from "./audio-player";
import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import Footer from "./components/footer";
import styles from "./app.module.css";

function App() {
  onMount(async () => {
    AudioPlayer.init();

    const CRT = 12;
    const SHORT_CAMEO = 11;
    const LONG_CAMEO = 12;

    const videosToPreload = [];

    for (let i = 1; i <= CRT; i++) {
      videosToPreload.push(`${CDN_URL}/videos/fx/crt-${i}.mp4`);
    }

    for (let i = 1; i <= SHORT_CAMEO; i++) {
      videosToPreload.push(`${CDN_URL}/videos/short/${i}.mp4`);
    }

    for (let i = 1; i <= LONG_CAMEO; i++) {
      videosToPreload.push(`${CDN_URL}/videos/long/${i}.mp4`);
    }

    await preloadVideos(videosToPreload);
  });

  onCleanup(() => {
    AudioPlayer.cleanup();
  });

  return (
    <div class={styles.app}>
      <Player />
      <Footer />
      <DuckHunt />
    </div>
  );
}

export default App;
