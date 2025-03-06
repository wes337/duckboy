import { createSignal, createEffect, onCleanup } from "solid-js";
import AudioPlayer from "../audio-player";
import { playSoundEffect } from "../utils";
import styles from "./volume-slider.module.css";

export default function VolumeSlider() {
  const [grabbing, setGrabbing] = createSignal(false);
  const [bottom, setBottom] = createSignal(32);
  const [startY, setStartY] = createSignal(0);

  const MAX_BOTTOM = 42;
  const MIN_BOTTOM = 24;

  createEffect(() => {
    const volume =
      (bottom() - MIN_BOTTOM) / (MAX_BOTTOM - MIN_BOTTOM).toFixed(2);
    AudioPlayer.volume = volume;
  });

  onCleanup(() => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  });

  const onPointerDown = (event) => {
    setGrabbing(true);
    setStartY(event.clientY);
    playSoundEffect("click-medium.mp3");

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerUp = () => {
    setGrabbing(false);
    playSoundEffect("click-soft.mp3", true);

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (event) => {
    if (!grabbing()) {
      return;
    }

    const deltaY = -(event.clientY - startY());
    const deltaPercent = deltaY * 0.1;

    const newBottom = Math.max(
      MIN_BOTTOM,
      Math.min(MAX_BOTTOM, bottom() + deltaPercent)
    );

    setBottom(newBottom);
    setStartY(event.clientY);
  };

  return (
    <button
      classList={{ [styles.volumeSlider]: true, [styles.grabbing]: grabbing() }}
      style={{
        bottom: `${bottom()}%`,
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <img src="/player/volume-slider.png" />
    </button>
  );
}
