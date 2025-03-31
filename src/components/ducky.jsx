import { onMount, createSignal, createEffect, onCleanup, Show } from "solid-js";
import {
  preloadImages,
  randomElementFromArray,
  isMobileSizedScreen,
  playSoundEffect,
} from "../utils";
import state from "../state";
import styles from "./ducky.module.css";

const ANIMATION_DURATIONS = {
  ENTRANCE: 4000,
  TALK: 6000,
  DIE: 8000,
};

const SPEECH = [
  "your pearl white eyes, they stain my moon red.",
  "i know i want to find a way out.",
  "i bet you can't even finish digging your own grave.",
  "¯\\_(ツ)_/¯",
  "who's gonna clean this mess?",
  "where y'at duckboy?",
  "can i at least keep your skull?",
  "i got cavities rotting my teeth.",
  "boom boom bap.",
  "i'll take my noose off and howl at the sight of your hand in my claws.",
  "hometown hero, used to be a zero.",
  "i got axes to grind and i got demons to slay.",
  "quack. quack. fuck off.",
  "my head is spinning round and round and round.",
  "let's go for a walk in the wasteland.",
  "1 more minute and i'm fucking out of here.",
  "i'm hungry… sick of these breadcrumbs… should get a $5 footlong… is that even a thing?",
  "slamduckasaur.",
  "do your parents know you're on this website?",
  "put it on my bill.",
  "i'll be your peanut butter if you'll be my jelly.",
  "i'm tired of talking to you. i want to sleep. i'm going to bed.",
  "alright, that's enough. stop clicking on me now. thx.",
  ":(",
  "it actually hurts when you click on me.",
  "asl? duck/boy/louisiana",
  "you're supposed to floss your teeth every time you brush. god knows when you skip flossing.",
  "in a zombie apocalypse, the duck population would remain unscathed. just sayin'.",
  "what size shirt do you wear when you wanna be comfy?",
  "you have entered the bog of eternal stench.",
  "hungry? breakfast lunch and dinner.",
  "i do not consent to rapid clicking.",
  "do you like the music? made it myself.",
  "i'm having trouble coping… need a new strategy.",
  "the algorithm keeps giving me these strange videos to watch…",
  "ducks can fly. don't leave any hate comments or we'll pull up.",
  "call this guy it would be so funny. 1-833-duckb0y",
  "tune in to 59.7 FM for all the greatest hits.",
  "welcome to our restaurant, thank you for dining in with us this evening. on the menu the chefs special tonight is red 40 with seed oil sauce.",
  "i found an intact skeleton the other day. it was weirdly shaped like joe biden.",
  "sarah palin fully endorses everything on this website.",
  "*rizz face.*",
  "clicking me gets my feathers in a twist.",
  "click again for your fortune. it's bad btw.",
  "click for state sponsored duck facts.",
  "i don't remember my dad. i was incubated.",
  "you wouldn't download a duck, would you?",
  "ducks have better vision than humans. we see everything.",
  "ducks have regional accents. i'm a cajun quacker.",
  "keep swiping. it's easier with fingers.",
  "welcome to the duck-web.",
  "duck-icide is never the answer.",
  "no foul language is necessary.",
  "the sun shines each and every day regardless of anyone's bad attitude. no one person can dim the world.",
  "happy affirmations to swag out to [vol. 69].",
  "one sided conversation is pretty boring.",
  "(  .  Y  .  )",
];

export default function Ducky() {
  const [speech, setSpeech] = createSignal("");

  let animationTimer;
  let speechTimer;

  const onClick = () => {
    if (state.duckHunt()) {
      state.setDucky("die");

      animationTimer = setTimeout(() => {
        state.setDucky("");
      }, ANIMATION_DURATIONS.DIE);
    } else {
      playSoundEffect("quack.mp3");
      setSpeech(randomElementFromArray(SPEECH));
    }
  };

  onMount(() => {
    preloadImages([
      "/ducky/entrance.gif",
      "/ducky/idle.gif",
      "/ducky/talk.gif",
      "/ducky/die.gif",
    ]);
  });

  createEffect(() => {
    if (!speech()) {
      return;
    }

    if (speechTimer) {
      clearTimeout(speechTimer);
    }

    state.setDucky("talk");

    const speechBubble = document.getElementById("ducky-speech");
    if (speechBubble) {
      speechBubble.style.transform = `translate(${
        speechBubble.clientWidth / 4
      }px, -${isMobileSizedScreen() ? 170 : 220}px)`;
    }

    speechTimer = setTimeout(() => {
      setSpeech("");
      state.setDucky("idle");
    }, 5000);
  });

  onCleanup(() => {
    if (animationTimer) {
      clearTimeout(animationTimer);
    }

    if (speechTimer) {
      clearTimeout(speechTimer);
    }
  });

  return (
    <Show when={state.ducky()}>
      <div class={styles.ducky} onClick={onClick}>
        <Show when={speech()}>
          <div id="ducky-speech" class={styles.speech}>
            {speech()}
          </div>
        </Show>
        <img
          key={state.ducky()}
          src={`/ducky/${state.ducky()}.gif`}
          onLoad={() => {
            if (state.ducky() === "entrance") {
              animationTimer = setTimeout(() => {
                state.setDucky("idle");
                setSpeech(
                  "yo wuzzup! i'm duckie. click me if you wanna chat or whatever."
                );
              }, ANIMATION_DURATIONS.ENTRANCE);
            }
          }}
        />
      </div>
    </Show>
  );
}
