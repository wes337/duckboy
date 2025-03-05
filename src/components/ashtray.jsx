import { createEffect, onCleanup } from "solid-js";
import { playSoundEffect } from "../utils";
import state from "../state";
import styles from "./ashtray.module.css";

export default function Ashtray() {
  let timeout;

  createEffect(() => {
    const showIntroAnimation = state.scenes.intro.currentStep === 1;

    if (!showIntroAnimation) {
      return;
    }

    onClickAshtray();

    timeout = setTimeout(() => {
      onClickAshtray();
      state.sceneNextStep("intro");
    }, 750);

    onCleanup(() => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  });

  const onClickAshtray = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    state.setAshtrayOpen((open) => {
      const nextOpen = !open;
      playSoundEffect(nextOpen ? "open.mp3" : "close.mp3");
      return nextOpen;
    });
  };

  return (
    <button
      classList={{ [styles.ashtray]: true, [styles.open]: state.ashtrayOpen() }}
      onClick={onClickAshtray}
    >
      <img src="/player/ashtray-2.png" />
    </button>
  );
}
