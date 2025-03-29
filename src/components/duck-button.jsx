import { createEffect, createSignal, onCleanup } from "solid-js";
import { playSoundEffect } from "../utils";
import state from "../state";
import styles from "./duck-button.module.css";

const EVENTS = ["duckHunt", "ads", "ducky", "werewolf"];

export default function DuckButton() {
  const [eventIndex, setEventIndex] = createSignal(0);
  const [highlightDuck, setHighlightDuck] = createSignal(false);
  const [duckButtonClicked, setDuckButtonClicked] = createSignal(false);

  createEffect(async () => {
    if (!state.sceneDone("intro") || state.duckHunt() || duckButtonClicked()) {
      return;
    }

    const highlightDuckButton = () => {
      return new Promise((resolve) => {
        playSoundEffect("quack.mp3");
        setHighlightDuck(true);
        setTimeout(() => {
          setHighlightDuck(false);
          resolve();
        }, 500);
      });
    };

    const timeout = setTimeout(async () => {
      await highlightDuckButton();
      await highlightDuckButton();
    }, 100);

    const interval = setInterval(async () => {
      await highlightDuckButton();
      await highlightDuckButton();
    }, 30000);

    onCleanup(() => {
      clearInterval(interval);
      clearTimeout(timeout);
    });
  });

  const onClickDuckButton = () => {
    setDuckButtonClicked(true);
    playSoundEffect("duck.mp3");

    if (state.duckHunt()) {
      state.setDuckHunt(false);
      return;
    }

    const currentEvent = EVENTS[eventIndex()];

    switch (currentEvent) {
      case "duckHunt": {
        state.setDuckHunt(true);
        break;
      }

      case "ads": {
        state.setAds(true);
        break;
      }

      case "ducky": {
        if (!state.ducky()) {
          state.setDucky("entrance");
        }
        break;
      }

      case "werewolf": {
        state.setWerewolves(true);
        break;
      }

      default: {
        break;
      }
    }

    setEventIndex((eventIndex) => {
      const nextEventIndex = eventIndex + 1;

      if (nextEventIndex > EVENTS.length - 1) {
        return 0;
      }

      return nextEventIndex;
    });
  };

  return (
    <button
      classList={{
        [styles.duckButton]: true,
        [styles.highlight]: highlightDuck(),
      }}
      onClick={onClickDuckButton}
    >
      <img src={`/player/duck.png`} />
      <img src={`/player/duck-pressed.png`} />
    </button>
  );
}
