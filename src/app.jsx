import Player from "./components/player";
import styles from "./app.module.css";

function App() {
  return (
    <div class={styles.app}>
      <main>
        <Player />
      </main>
    </div>
  );
}

export default App;
