import { onMount, onCleanup } from "solid-js";
import AudioPlayer from "./audio-player";
import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import Footer from "./components/footer";
import styles from "./app.module.css";

function App() {
  onMount(() => {
    AudioPlayer.init();
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
