import { onMount, onCleanup } from "solid-js";
// import { CDN_URL, preloadVideos } from "./utils";
import AudioPlayer from "./audio-player";
import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import Footer from "./components/footer";
import SocialMediaLinks from "./components/social-media-links";
import Sign from "./components/sign";
import Ads from "./components/ads";
import Ducky from "./components/ducky";
import Cursor from "./components/cursor";
import Werewolves from "./components/werewolves";
import styles from "./app.module.css";

function App() {
  onMount(async () => {
    AudioPlayer.init();

    // const CRT = 12;
    // const VIDEOS = 12;

    // const videosToPreload = [];

    // for (let i = 1; i <= CRT; i++) {
    //   videosToPreload.push(`${CDN_URL}/videos/fx/crt-${i}.mp4`);
    // }

    // for (let i = 1; i <= VIDEOS; i++) {
    //   videosToPreload.push(`${CDN_URL}/videos/long/${i}.mp4`);
    // }

    // await preloadVideos(videosToPreload);

    onMount(() => {
      const handleUserInteraction = () => {
        const volume = AudioPlayer.volume;

        const video = document.getElementById("video");
        if (video && video.muted) {
          video.muted = false;
          video.volume = volume;
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
      <Cursor />
      <Ads />
      <Sign />
      <Player />
      <Footer />
      <DuckHunt />
      <Ducky />
      <SocialMediaLinks />
      <Werewolves />
    </div>
  );
}

export default App;
