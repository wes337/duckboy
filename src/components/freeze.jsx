import { createSignal, createEffect, Show } from "solid-js";
import { playSoundEffect } from "../utils";
import state from "../state";
import styles from "./freeze.module.css";

export default function Freeze() {
  const show = () =>
    state.sceneDone("intro") &&
    (state.freeze().iceOne || state.freeze().iceTwo);

  createEffect(() => {
    if (!show()) {
      return;
    }

    playSoundEffect("witch.mp3");
  });

  return (
    <div classList={{ [styles.freeze]: true, [styles.show]: show() }}></div>
  );
}

export function Ice() {
  const [clickingIce, setClickingIce] = createSignal(false);

  const onClick = (event) => {
    if (clickingIce()) {
      return;
    }

    setClickingIce(true);
    event.target.classList.add(styles.shake);
    playSoundEffect("pick.mp3");
  };

  return (
    <>
      <Show when={state.freeze().iceOne}>
        <button
          class={styles.ice}
          onClick={onClick}
          onAnimationEnd={(event) => {
            event.target.classList.remove(styles.shake);
            state.setFreeze((freeze) => ({ ...freeze, iceOne: false }));
            setTimeout(() => {
              setClickingIce(false);
            }, 500);
          }}
        >
          <img src={`/images/ice-1.png`} />
        </button>
      </Show>
      <Show when={state.freeze().iceTwo}>
        <button
          class={styles.iceTwo}
          onClick={onClick}
          onAnimationEnd={(event) => {
            event.target.classList.remove(styles.shake);
            state.setFreeze((freeze) => ({ ...freeze, iceTwo: false }));
            setTimeout(() => {
              setClickingIce(false);
            }, 500);
          }}
        >
          <img src={`/images/ice-3.png`} />
        </button>
      </Show>
    </>
  );
}
