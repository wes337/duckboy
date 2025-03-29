import { createEffect, createSignal, onCleanup } from "solid-js";
import { isMobileSizedScreen, playSoundEffect } from "../utils";
import state from "../state";
import styles from "./werewolves.module.css";

const NUMBER_OF_WEREWOLVES = 4;

export default function Werewolves() {
  const [werewolvesShown, setWerewolvesShown] = createSignal(0);

  const spawnWerewolf = () => {
    const werewolf = document.createElement("div");
    const img = document.createElement("img");
    img.src = `/images/werewolf.gif`;

    werewolf.appendChild(img);
    werewolf.className = styles.werewolf;
    const offset = isMobileSizedScreen() ? 100 : 200;
    werewolf.style.bottom = `${
      werewolvesShown() * offset +
      (isMobileSizedScreen() ? window.innerHeight / 4 : 0)
    }px`;
    werewolf.style.zIndex = NUMBER_OF_WEREWOLVES + 1 - werewolvesShown();

    werewolf.onanimationend = () => {
      werewolf.remove();
    };

    document.body.appendChild(werewolf);

    playSoundEffect(`wolf.mp3`);

    setWerewolvesShown((werewolvesShown) => werewolvesShown + 1);
  };

  createEffect(() => {
    const introDone = state.sceneDone("intro");
    const werewolvesScene = state.werewolves();
    const show = introDone && werewolvesScene;

    if (!show) {
      return;
    }

    const interval = setInterval(() => {
      if (werewolvesShown() >= NUMBER_OF_WEREWOLVES) {
        clearInterval(interval);
        state.setWerewolves(false);
        setWerewolvesShown(0);
      } else {
        spawnWerewolf();
      }
    }, 350);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return <></>;
}
