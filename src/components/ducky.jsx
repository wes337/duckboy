import { onMount, createSignal, onCleanup, Show } from "solid-js";
import { preloadImages } from "../utils";
import state from "../state";
import styles from "./ducky.module.css";

const ANIMATION_DURATIONS = {
  ENTRANCE: 4000,
  TALK: 6000,
  DIE: 8000,
};

export default function Ducky() {
  let animationTimer;

  onMount(() => {
    preloadImages([
      "/ducky/entrance.gif",
      "/ducky/idle.gif",
      "/ducky/talk.gif",
      "/ducky/die.gif",
    ]);
  });

  onCleanup(() => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }
  });

  const onClick = () => {
    if (state.duckHunt()) {
      state.setDucky("die");

      animationTimer = setTimeout(() => {
        state.setDucky("");
      }, ANIMATION_DURATIONS.DIE);
    }
  };

  return (
    <Show when={state.ducky()}>
      <div class={styles.ducky} onClick={onClick}>
        <img
          key={state.ducky()}
          src={`/ducky/${state.ducky()}.gif`}
          onLoad={() => {
            if (state.ducky() === "entrance") {
              animationTimer = setTimeout(() => {
                state.setDucky("idle");
              }, ANIMATION_DURATIONS.ENTRANCE);
            }
          }}
        />
      </div>
    </Show>
  );
}
