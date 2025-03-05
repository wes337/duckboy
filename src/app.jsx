import Player from "./components/player";
import DuckHunt from "./components/duck-hunt";
import styles from "./app.module.css";
import Footer from "./components/footer";

function App() {
  return (
    <div class={styles.app}>
      <Player />
      <Footer />
      <DuckHunt />
    </div>
  );
}

export default App;
