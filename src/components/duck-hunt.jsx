import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { randomNumberBetween, playSoundEffect } from "../utils";
import state from "../state";
import styles from "./duck-hunt.module.css";

export default function DuckHunt() {
  const [shooting, setShooting] = createSignal(false);

  onMount(() => {
    const preloadImages = () => {
      const imagesToPreload = [
        "/images/gun.gif",
        "/images/duck-fly.gif",
        "/images/duck-dead.png",
        "/images/blood-01.gif",
        "/images/blood-02.gif",
        "/images/blood-03.gif",
        "/images/blood-04.gif",
        "/images/blood-05.gif",
      ];
      imagesToPreload.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    };

    preloadImages();
  });

  createEffect(() => {
    if (!state.duckHunt()) {
      return;
    }

    playSoundEffect("cock.wav");

    const onShoot = () => {
      if (shooting()) {
        return;
      }

      setShooting(true);
      playSoundEffect("gunshot.mp3");

      setTimeout(() => {
        setShooting(false);
      }, 500);
    };

    document.addEventListener("click", onShoot);

    let ducksFlown = 0;

    let blood = 1;

    const spawnDuck = () => {
      ducksFlown = ducksFlown + 1;

      const duck = document.createElement("div");
      const img = document.createElement("img");
      img.src = `/images/duck-fly.gif`;
      const deadImg = document.createElement("img");
      deadImg.src = `/images/duck-dead.png`;
      deadImg.className = styles.deadDuck;
      const bloodImg = document.createElement("img");
      blood = blood + 1 <= 5 ? blood + 1 : 1;
      bloodImg.src = `/images/blood-0${blood}.gif?${Date.now()}`;
      bloodImg.className = styles.blood;
      duck.appendChild(img);
      duck.appendChild(deadImg);
      duck.appendChild(bloodImg);
      duck.className = styles.duck;
      duck.style.top = `${randomNumberBetween(0, window.innerHeight - 300)}px`;
      duck.style.left = "-100px";

      const fly = setInterval(() => {
        const currentLeft = parseInt(duck.style.left) || 0;

        duck.style.left = `${currentLeft + window.innerWidth * 0.02}px`;

        if (currentLeft > window.innerWidth) {
          clearInterval(fly);
          duck.remove();
        }
      }, 100);

      duck.onclick = () => {
        if (!state.duckHunt()) {
          return;
        }

        img.style.opacity = 0;
        deadImg.style.opacity = 1;
        bloodImg.style.opacity = 1;
        duck.style.animation = "none";
        clearInterval(fly);
        playSoundEffect("quack-dead.mp3");

        setTimeout(() => {
          duck.remove();
        }, 5000);
      };

      document.body.appendChild(duck);
      playSoundEffect(`quack.mp3`);
    };

    const interval = setInterval(() => {
      spawnDuck();

      if (ducksFlown >= 20) {
        clearInterval(interval);
        state.setDuckHunt(false);
      }
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
      document.removeEventListener("click", onShoot);
    });
  });

  return (
    <Show when={state.duckHunt()}>
      <Portal>
        <img
          classList={{ [styles.gun]: true, [styles.show]: !shooting() }}
          src={"/images/gun.png"}
        />
        <img
          classList={{ [styles.gun]: true, [styles.show]: shooting() }}
          src={"/images/gun.gif"}
        />
      </Portal>
    </Show>
  );
}
