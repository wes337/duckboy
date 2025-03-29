import { createSignal, createEffect, onCleanup } from "solid-js";
import { isMobileDevice } from "../utils";
import state from "../state";
import styles from "./cursor.module.css";

export default function Cursor() {
  const [positionX, setPositionX] = createSignal(0);
  const [positionY, setPositionY] = createSignal(0);

  createEffect(() => {
    if (isMobileDevice()) {
      return;
    }

    if (state.duckHunt()) {
      document.body.classList.add("hideCursor");
    } else {
      document.body.classList.remove("hideCursor");
    }
  });

  createEffect(() => {
    if (isMobileDevice()) {
      return;
    }

    const onMouseMove = (event) => {
      const offset = 50;
      setPositionX(event.clientX - offset);
      setPositionY(event.clientY - offset);
    };

    document.addEventListener("pointermove", onMouseMove);

    onCleanup(() => document.removeEventListener("pointermove", onMouseMove));
  });

  if (isMobileDevice()) {
    return null;
  }

  return (
    <img
      class={styles.cursor}
      src={`/images/cursor.png`}
      alt=""
      style={{
        opacity: state.duckHunt() ? 1 : 0,
        left: `${positionX()}px`,
        top: `${positionY()}px`,
      }}
    />
  );
}
