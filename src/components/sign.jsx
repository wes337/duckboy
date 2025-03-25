import styles from "./sign.module.css";

export default function Sign() {
  return (
    <div class={styles.sign}>
      <img src={`/images/call-sign.png`} />
    </div>
  );
}
