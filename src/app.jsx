import { onMount, onCleanup } from "solid-js";
// import { CDN_URL, preloadVideos } from "./utils";
import AudioPlayer from "./audio-player";
import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import Footer from "./components/footer";
import styles from "./app.module.css";

function App() {
  onMount(async () => {
    AudioPlayer.init();

    // const CRT = 12;
    // const SHORT_CAMEO = 11;
    // const LONG_CAMEO = 12;

    // const videosToPreload = [];

    // for (let i = 1; i <= CRT; i++) {
    //   videosToPreload.push(`${CDN_URL}/videos/fx/crt-${i}.mp4`);
    // }

    // for (let i = 1; i <= SHORT_CAMEO; i++) {
    //   videosToPreload.push(`${CDN_URL}/videos/short/${i}.mp4`);
    // }

    // for (let i = 1; i <= LONG_CAMEO; i++) {
    //   videosToPreload.push(`${CDN_URL}/videos/long/${i}.mp4`);
    // }

    // await preloadVideos(videosToPreload);

    onMount(() => {
      const handleUserInteraction = () => {
        const volume = AudioPlayer.volume;

        const shortCameoVideo = document.getElementById("short-cameo");
        if (shortCameoVideo && shortCameoVideo.muted) {
          shortCameoVideo.muted = false;
          shortCameoVideo.volume = volume;
        }

        const longCameoVideo = document.getElementById("long-cameo");
        if (longCameoVideo && longCameoVideo.muted) {
          longCameoVideo.muted = false;
          longCameoVideo.volume = volume;
        }
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchend", handleUserInteraction);

      onCleanup(() => {
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchend", handleUserInteraction);
      });
    });
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
