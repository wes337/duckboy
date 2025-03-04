import Player from "./components/player";
import DropTab from "./components/drop-tab";
import styles from "./app.module.css";
import Footer from "./components/footer";

function App() {
  return (
    <div class={styles.app}>
      <Player />
      <Footer />
    </div>
  );
}

export default App;
