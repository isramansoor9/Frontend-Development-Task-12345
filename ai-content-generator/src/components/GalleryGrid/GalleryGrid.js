import { memo, useCallback } from "react";
import Image from "next/image";
import styles from "./GalleryGrid.module.css";

/* Rotation values that feel hand-placed */
const ROTS = [-3, 1.5, -2, 2.8, -1.2, 3.2, -2.5, 1.8, -0.8, 2.2, -3.5, 1.0];

/* ── Skeleton loading polaroid ── */
function PolaroidSkeleton({ index }) {
  return (
    <div
      className={styles.polaroid}
      style={{ "--rot": `${ROTS[index % ROTS.length]}deg`, "--delay": `${index * 0.08}s` }}
      aria-hidden="true"
    >
      <div className={`${styles.photoWrap} skeleton-pulse`} />
      <div className={styles.polaroidBottom}>
        <div className={`${styles.captionSkel} skeleton-pulse`} />
      </div>
    </div>
  );
}

/* ── Single polaroid card ── */
const PolaroidCard = memo(function PolaroidCard({ item, index, onClick }) {
  const handleClick = useCallback(() => onClick?.({ src: item.src, alt: item.alt }), [item, onClick]);

  return (
    <article
      className={styles.polaroid}
      style={{ "--rot": `${ROTS[index % ROTS.length]}deg`, "--delay": `${index * 0.07}s` }}
    >
      <button
        type="button"
        className={styles.photoBtn}
        onClick={handleClick}
        aria-label={`Open full view: ${item.alt}`}
      >
        <div className={styles.photoWrap}>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className={styles.photo}
            sizes="(max-width: 640px) 42vw, (max-width: 900px) 28vw, 18vw"
            loading={index < 4 ? "eager" : "lazy"}
          />
          {/* Hover overlay */}
          <div className={styles.overlay} aria-hidden="true">
            <span className={styles.overlayIcon}>⊕</span>
          </div>
        </div>
        <div className={styles.polaroidBottom}>
          <p className={styles.caption}>
            {item.alt ? item.alt.slice(0, 28) : "untitled"}
          </p>
        </div>
      </button>
    </article>
  );
});

/* ── Gallery grid ── */
export default function GalleryGrid({
  items = [],
  isGenerating = false,
  expectedCount = 8,
  onImageClick,
}) {
  if (isGenerating) {
    return (
      <div className={styles.grid} aria-label="Generating images" aria-busy="true" aria-live="polite">
        {Array.from({ length: expectedCount }, (_, i) => (
          <PolaroidSkeleton key={`skel-${i}`} index={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={styles.empty} aria-label="No images yet">
        <span className={styles.emptyIcon}>📸</span>
        <p className={styles.emptyText}>Your images appear here</p>
      </div>
    );
  }

  return (
    <div className={styles.grid} aria-label="Generated images">
      {items.map((item, i) => (
        <PolaroidCard
          key={item.id}
          item={item}
          index={i}
          onClick={onImageClick}
        />
      ))}
    </div>
  );
}
