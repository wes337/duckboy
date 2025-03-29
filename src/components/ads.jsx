import { createSignal, createEffect, onCleanup } from "solid-js";
import {
  randomNumberBetween,
  playSoundEffect,
  isMobileSizedScreen,
} from "../utils";
import { CDN_URL } from "../constants";
import state from "../state";
import styles from "./ads.module.css";

const NUMBER_OF_ADS = 6;

export default function Ads() {
  const [adIndex, setAdIndex] = createSignal(1);
  const [popUpsShown, setPopUpsShown] = createSignal(0);

  const positionPopup = (popUp, width, height) => {
    const popupWidth = width || popUp.offsetWidth;
    const popupHeight = height || popUp.offsetHeight;

    const maxTop = window.innerHeight - popupHeight;
    const maxLeft = window.innerWidth - popupWidth;

    const top = Math.max(0, Math.min(randomNumberBetween(0, maxTop), maxTop));
    const left = Math.max(
      0,
      Math.min(randomNumberBetween(0, maxLeft), maxLeft)
    );

    popUp.style.top = `${top}px`;
    popUp.style.left = `${left}px`;
  };

  const showRandomPopUp = () => {
    setPopUpsShown((popUpsShown) => popUpsShown + 1);

    const popUp = document.createElement("div");

    setAdIndex((adIndex) => {
      const nextAdIndex = adIndex + 1;

      if (nextAdIndex > NUMBER_OF_ADS) {
        return 1;
      }

      return nextAdIndex;
    });

    // Number 5 is an image
    if (adIndex() === 5) {
      const img = document.createElement("img");

      img.src = `${CDN_URL}/videos/ads/5.png`;
      popUp.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.src = `${CDN_URL}/videos/ads/${adIndex()}-cropped.mp4`;
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.style.pointerEvents = "none";
      popUp.appendChild(video);
    }

    popUp.className = styles.popUp;
    const width = isMobileSizedScreen() ? 300 : 400;
    const height = isMobileSizedScreen() ? 162 : 216;

    positionPopup(popUp, width, height);

    popUp.onclick = () => {
      playSoundEffect("click-medium.mp3");
      playSoundEffect("click-glass.mp3");
      popUp.remove();
    };

    document.body.appendChild(popUp);
    playSoundEffect(`popup-${randomNumberBetween(1, 3)}.mp3`);
  };

  createEffect(() => {
    const introDone = state.sceneDone("intro");
    const adsScene = state.ads();
    const show = introDone && adsScene;

    if (!show) {
      return;
    }

    const interval = setInterval(() => {
      if (popUpsShown() >= 6) {
        clearInterval(interval);
        state.setAds(false);
        setPopUpsShown(0);
      } else {
        showRandomPopUp();
      }
    }, 500);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return <></>;
}
