import { createEffect, createSignal, onCleanup } from "solid-js";
import { playSoundEffect } from "../utils";
import styles from "./player.module.css";

export default function Player() {
  const [ashtrayOpen, setAshtrayOpen] = createSignal(false);

  const onVolumeChange = (volume) => {
    console.log(volume);
  };

  return (
    <div class={styles.player}>
      <div class={styles.header}>
        <img src="/player/header.png" />
      </div>
      <div class={styles.body}>
        <img
          class={styles.bodyImage}
          src="/player/body-top.png"
          style={{ "grid-column": "1 / 4" }}
        />
        <img class={styles.bodyImage} src="/player/body-left.png" />
        <img class={styles.bodyImage} src="/player/body-center.png" />
        <img class={styles.bodyImage} src="/player/body-right.png" />
        <img
          class={styles.bodyImage}
          src="/player/body-bottom.png"
          style={{ "grid-column": "1 / 4" }}
        />
        <img class={styles.leftSpeaker} src="/player/left-speaker.png" />
        <img class={styles.rightSpeaker} src="/player/right-speaker.png" />
        <button
          classList={{
            [styles.ashtray]: true,
            [styles.ashtrayClosed]: !ashtrayOpen(),
          }}
          onClick={() => {
            setAshtrayOpen((open) => {
              if (open) {
                playSoundEffect("latch-close.mp3");
              } else {
                playSoundEffect("latch-open.mp3");
              }

              return !open;
            });
          }}
        >
          <img src="/player/ashtray.png" />
        </button>
        <Content />
        <Controls />
        <VolumeSlider onChange={onVolumeChange} />
        <button
          class={styles.tvButton}
          onClick={() => {
            playSoundEffect("click-glass.mp3");
          }}
        />
        <button
          class={styles.settingsButton}
          onClick={() => {
            playSoundEffect("click-soft.mp3");
          }}
        />
        <button
          class={styles.duckButton}
          onClick={() => {
            playSoundEffect("duck.mp3");
          }}
        />
      </div>
    </div>
  );
}

function Content() {
  return <div class={styles.content}>Main content here</div>;
}

function Controls(props) {
  return (
    <div class={styles.controls}>
      <button
        class={styles.play}
        onClick={() => {
          playSoundEffect("click-hard.mp3");
        }}
      />
      <button
        class={styles.back}
        onClick={() => {
          playSoundEffect("click-hard.mp3");
        }}
      />
      <button
        class={styles.forward}
        onClick={() => {
          playSoundEffect("click-hard.mp3");
        }}
      />
      <button
        class={styles.stop}
        onClick={() => {
          playSoundEffect("click-hard.mp3");
        }}
      />
    </div>
  );
}

function VolumeSlider(props) {
  const [grabbing, setGrabbing] = createSignal(false);
  const [bottom, setBottom] = createSignal(44);
  const [startY, setStartY] = createSignal(0);

  const MAX_BOTTOM = 56;
  const MIN_BOTTOM = 31;

  createEffect(() => {
    const volume = ((bottom() - MIN_BOTTOM) / (MAX_BOTTOM - MIN_BOTTOM)) * 100;
    props.onChange?.(volume);
  });

  onCleanup(() => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  });

  const onPointerDown = (event) => {
    setGrabbing(true);
    setStartY(event.clientY);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerUp = () => {
    setGrabbing(false);
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
      <img src="/player/slider.png" />
    </button>
  );
}
