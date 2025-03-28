import { For } from "solid-js";
import styles from "./social-media-links.module.css";

const links = [
  { name: "youtube", href: "https://www.youtube.com/@whereyatduckboy" },
  { name: "ig", href: "https://www.instagram.com/whereyatduckboy" },
  {
    name: "spotify",
    href: "https://open.spotify.com/artist/7LcRxOTDhbQ19ulgIVOWpu",
  },
  { name: "soundcloud", href: "https://soundcloud.com/whereyatduckboy" },
];

export default function SocialMediaLinks() {
  return (
    <div class={styles.socialMediaLinks}>
      <For each={links}>
        {(link) => {
          return (
            <a href={link.href} target="_blank">
              <img src={`/images/${link.name}-icon.png`} alt={link.name} />
            </a>
          );
        }}
      </For>
    </div>
  );
}
