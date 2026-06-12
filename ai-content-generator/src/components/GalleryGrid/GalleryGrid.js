import Image from "next/image";
import PromptCard from "@/components/PromptCard/PromptCard";
import styles from "./GalleryGrid.module.css";

function SkeletonCard({ className = "" }) {
  return (
    <div className={`${styles.card} ${styles.skeleton} ${className}`}>
      <div className={`${styles.skeletonFill} skeleton-pulse`} />
    </div>
  );
}

function MediaCard({ item, onClick }) {
  if (item.type === "video") {
    return (
      <article className={styles.card}>
        <video
          className={styles.media}
          src={item.src}
          poster={item.poster}
          controls
          preload="metadata"
          aria-label={item.alt}
        >
          <track kind="captions" />
        </video>
      </article>
    );
  }

  return (
    <article
      className={`${styles.card} ${onClick ? styles.cardClickable : ""}`}
      onClick={onClick ? () => onClick({ src: item.src, alt: item.alt }) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ")
                onClick({ src: item.src, alt: item.alt });
            }
          : undefined
      }
      aria-label={onClick ? `View ${item.alt} full size` : undefined}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className={styles.image}
        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
        style={{ objectFit: "cover" }}
      />
      <div className={styles.hoverOverlay} aria-hidden="true">
        <div className={styles.hoverBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View
        </div>
      </div>
    </article>
  );
}

export default function GalleryGrid({
  prompt,
  items,
  isGenerating,
  expectedCount,
  onImageClick,
  onPromptCardClick,
}) {
  if (isGenerating) {
    return (
      <section className={styles.section} aria-label="Generating" aria-live="polite" aria-busy="true">
        <PromptCard prompt={prompt} onClick={onPromptCardClick} />
        <div className={styles.grid}>
          {Array.from({ length: expectedCount }, (_, i) => (
            <SkeletonCard
              key={i}
              className={
                i === 0 ? styles.cellSpan2 :
                i === 3 ? styles.cellTall :
                i === 5 ? styles.cellSpan2 : ""
              }
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Generated results" aria-live="polite">
      <PromptCard prompt={prompt} onClick={onPromptCardClick} />
      <div className={styles.grid}>
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`${styles.cell} ${
              i === 0 ? styles.cellSpan2 :
              i === 3 ? styles.cellTall :
              i === 5 ? styles.cellSpan2 : ""
            }`}
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <MediaCard item={item} onClick={onImageClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
