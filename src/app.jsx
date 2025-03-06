import { onMount, onCleanup } from "solid-js";
import AudioPlayer from "./audio-player";
import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import Footer from "./components/footer";
import styles from "./app.module.css";
import { preloadVideos } from "./utils";

function App() {
  onMount(async () => {
    AudioPlayer.init();

    await preloadVideos([
      "/videos/fx/crt-1.mp4",
      "/videos/fx/crt-2.mp4",
      "/videos/fx/crt-3.mp4",
      "/videos/fx/crt-4.mp4",
      "/videos/fx/crt-5.mp4",
      "/videos/fx/crt-6.mp4",
      "/videos/fx/crt-7.mp4",
      "/videos/fx/crt-8.mp4",
      "/videos/fx/crt-9.mp4",
      "/videos/fx/crt-10.mp4",
      "/videos/fx/crt-11.mp4",
      "/videos/fx/crt-12.mp4",
    ]);
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
