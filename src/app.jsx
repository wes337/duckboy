import Player from "./components/player";
import DropTab from "./components/drop-tab";
import styles from "./app.module.css";

function App() {
  return (
    <div class={styles.app}>
      <main>
        <Player />
        <DropTab />
      </main>
    </div>
  );
}

export default App;
