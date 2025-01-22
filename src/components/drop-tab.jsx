import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { randomNumberBetween, playSoundEffect } from "../utils";
import styles from "./drop-tab.module.css";

export default function DropTab() {
  const [open, setOpen] = createSignal(false);
  const [aids, setAids] = createSignal(false);
  const [frozen, setFrozen] = createSignal(0);
  const [clickingIce, setClickingIce] = createSignal(false);
  const [duckHunt, setDuckHunt] = createSignal(false);
  const [shooting, setShooting] = createSignal(false);

  onMount(() => {
    const preloadImages = () => {
      const imagesToPreload = [
        "/images/rougarou.gif",
        "/images/ice.jpg",
        "/images/duck.gif",
        "/images/duck-dead.png",
      ];
      imagesToPreload.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    };

    preloadImages();
  });

  createEffect(() => {
    if (!aids()) {
      return;
    }

    let popUpsShown = 0;

    const showRandomPopUp = () => {
      popUpsShown = popUpsShown + 1;

      const popUp = document.createElement("div");
      const img = document.createElement("img");
      img.src = `/images/ad.png`;
      popUp.appendChild(img);
      popUp.className = styles.popUp;
      popUp.style.top = `${randomNumberBetween(0, window.innerHeight)}px`;
      popUp.style.left = `${randomNumberBetween(0, window.innerWidth)}px`;
      popUp.onclick = () => {
        playSoundEffect("click-medium.mp3");
        popUp.remove();
      };

      document.body.appendChild(popUp);
      playSoundEffect(`popup-${randomNumberBetween(1, 3)}.mp3`);
    };

    showRandomPopUp();

    const interval = setInterval(() => {
      showRandomPopUp();

      if (popUpsShown >= 10) {
        clearInterval(interval);
        setAids(false);
      }
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  createEffect(() => {
    if (!duckHunt()) {
      return;
    }

    const onShoot = () => {
      if (shooting()) {
        return;
      }

      setShooting(true);
      playSoundEffect("gunshot.mp3");

      setTimeout(() => {
        setShooting(false);
      }, 250);
    };

    document.addEventListener("click", onShoot);

    let ducksFlown = 0;

    const spawnDuck = () => {
      ducksFlown = ducksFlown + 1;

      const duck = document.createElement("div");
      const img = document.createElement("img");
      img.src = `/images/duck.gif`;
      const deadImg = document.createElement("img");
      deadImg.src = `/images/duck-dead.png`;
      deadImg.className = styles.deadDuck;
      duck.appendChild(img);
      duck.appendChild(deadImg);
      duck.className = styles.duck;
      duck.style.top = `${randomNumberBetween(0, window.innerHeight - 300)}px`;

      const fly = setInterval(() => {
        const currentLeft = parseInt(duck.style.left) || 0;
        duck.style.left = `${currentLeft + window.innerWidth * 0.02}px`;

        if (currentLeft > window.innerWidth) {
          clearInterval(fly);
          duck.remove();
        }
      }, 100);

      duck.onclick = () => {
        if (!duckHunt()) {
          return;
        }

        img.style.opacity = 0;
        deadImg.style.opacity = 1;
        duck.style.animation = "none";
        clearInterval(fly);
        playSoundEffect("quack-dead.mp3");
        setTimeout(() => {
          duck.remove();
        }, 1000);
      };

      document.body.appendChild(duck);
      playSoundEffect(`quack.mp3`);
    };

    const interval = setInterval(() => {
      spawnDuck();

      if (ducksFlown >= 20) {
        clearInterval(interval);
        setDuckHunt(false);
      }
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);

      document.removeEventListener("click", onShoot);
    });
  });

  const spawnRougarou = () => {
    const rougarou = document.createElement("div");
    const img = document.createElement("img");
    img.src = `/images/rougarou.gif`;
    rougarou.appendChild(img);
    rougarou.className = styles.rougarou;
    rougarou.onanimationend = () => {
      rougarou.remove();
    };

    document.body.appendChild(rougarou);
    playSoundEffect(`wolf.mp3`);
  };

  return (
    <div class={styles.dropTab}>
      <Show when={frozen() > 0}>
        <Portal>
          <div
            id="ice"
            class={styles.ice}
            onClick={(event) => {
              if (clickingIce()) {
                return;
              }

              setClickingIce(true);
              event.target.classList.add(styles.shake);
              playSoundEffect("pick.mp3");
            }}
            onAnimationEnd={(event) => {
              event.target.classList.remove(styles.shake);
              setFrozen((frozen) => {
                const next = Math.max(frozen - 1, 0);
                if (next === 0) {
                  playSoundEffect("glass.mp3");
                }
                return next;
              });
              setTimeout(() => {
                setClickingIce(false);
              }, 500);
            }}
          >
            <img src={"/images/ice.jpg"} />
          </div>
        </Portal>
      </Show>
      <Show when={duckHunt()}>
        <Portal>
          <img
            classList={{ [styles.shotgun]: true, [styles.show]: !shooting() }}
            src={"/images/shotgun-1.png"}
          />
          <img
            classList={{ [styles.shotgun]: true, [styles.show]: shooting() }}
            src={"/images/shotgun-2.png"}
          />
        </Portal>
      </Show>
      <button class={styles.toggle} onClick={() => setOpen(true)}>
        Drop Tab
      </button>
      <div classList={{ [styles.options]: true, [styles.open]: open() }}>
        <button class={styles.close} onClick={() => setOpen(false)}>
          X
        </button>
        <button
          onClick={() => {
            setFrozen(3);
            playSoundEffect("witch.mp3");
          }}
        >
          Evil Witch
        </button>
        <button onClick={() => spawnRougarou()}>Rougarou Attack</button>
        <button onClick={() => setAids(true)}>PC Aids</button>
        <button>Duckie</button>
        <button
          onClick={() => {
            setDuckHunt(true);
            playSoundEffect("cock.wav");
          }}
        >
          Duck Hunt
        </button>
        <button>Change Color Scheme</button>
      </div>
    </div>
  );
}
