import { createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./player.module.css";

export default function Player() {
  const [ashtrayOpen, setAshtrayOpen] = createSignal(false);

  const onVolumeChange = (volume) => {
    console.log(volume);
  };

  return (
    <div class={styles.player}>
      <div class={styles.header}>
        <img src="/slices/player_header3.png" />
      </div>
      <div class={styles.body}>
        <img
          class={styles.bodyImage}
          src="/slices/player_body_01.png"
          style={{ "grid-column": "1 / 4" }}
        />
        <img class={styles.bodyImage} src="/slices/player_body_022.png" />
        <img class={styles.bodyImage} src="/slices/player_body_03.png" />
        <img class={styles.bodyImage} src="/slices/player_body_04.png" />
        <img
          class={styles.bodyImage}
          src="/slices/player_body_05.png"
          style={{ "grid-column": "1 / 4" }}
        />
        <img class={styles.leftSpeaker} src="/slices/player_04.png" />
        <img class={styles.rightSpeaker} src="/slices/player_06.png" />
        <button
          classList={{
            [styles.ashtray]: true,
            [styles.ashtrayClosed]: !ashtrayOpen(),
          }}
          onClick={() => setAshtrayOpen((open) => !open)}
        >
          <img src="/slices/player_03.png" />
        </button>
        <Content />
        <Controls />
        <VolumeSlider onChange={onVolumeChange} />
        <button class={styles.tvButton} />
        <button class={styles.settingsButton} />
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
      <button class={styles.play} />
      <button class={styles.back} />
      <button class={styles.forward} />
      <button class={styles.stop} />
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
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  });

  const onMouseDown = (event) => {
    setGrabbing(true);
    setStartY(event.clientY);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseUp = () => {
    setGrabbing(false);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (event) => {
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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <img src="/player/slider.png" />
    </button>
  );
}
