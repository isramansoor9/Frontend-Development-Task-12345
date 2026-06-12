import styles from "./PromptCard.module.css";

export default function PromptCard({ prompt, onClick }) {
  const clickable = Boolean(onClick);

  return (
    <article
      className={`${styles.card} ${clickable ? styles.clickable : ""}`}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={clickable ? "Clear prompt input" : "Generation prompt"}
    >
      <p className={styles.text}>{prompt}</p>
      <span className={styles.modelBadge}>Model</span>
    </article>
  );
}
