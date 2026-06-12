"use client";

import { ImageIcon, VideoIcon } from "@/components/icons/Icons";
import { IMAGE_COUNT_OPTIONS, ASPECT_RATIO_OPTIONS, MODEL_OPTIONS, STYLE_OPTIONS } from "@/lib/constants";
import styles from "./ControlsSidebar.module.css";

const STYLE_PREVIEWS = {
  Photorealistic: "🌿",
  Cinematic: "🎬",
  Anime: "✨",
  "Oil Painting": "🖌️",
  Watercolor: "💧",
  "3D Render": "🔮",
};

export default function ControlsSidebar({
  contentType,
  onContentTypeChange,
  imageCount,
  onImageCountChange,
  aspectRatio,
  onAspectRatioChange,
  model,
  onModelChange,
  selectedStyle,
  onStyleChange,
  steps,
  onStepsChange,
  guidance,
  onGuidanceChange,
}) {
  return (
    <aside className={styles.sidebar} aria-label="Generation controls">
      <div className={styles.header}>
        <h2 className={styles.title}>Controls</h2>
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Type</span>
          <div className={styles.typeToggle} role="tablist" aria-label="Content type">
            <button
              type="button"
              role="tab"
              aria-selected={contentType === "image"}
              className={`${styles.typeBtn} ${contentType === "image" ? styles.typeBtnActive : ""}`}
              onClick={() => onContentTypeChange("image")}
            >
              <ImageIcon className={styles.typeIcon} />
              Image
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={contentType === "video"}
              className={`${styles.typeBtn} ${contentType === "video" ? styles.typeBtnActive : ""}`}
              onClick={() => onContentTypeChange("video")}
            >
              <VideoIcon className={styles.typeIcon} />
              Video
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <span className={styles.sectionLabel}>Count</span>
          <div className={styles.chipGrid}>
            {IMAGE_COUNT_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.chip} ${imageCount === c ? styles.chipActive : ""}`}
                onClick={() => onImageCountChange(c)}
                aria-pressed={imageCount === c}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <span className={styles.sectionLabel}>Aspect Ratio</span>
          <div className={styles.chipGrid}>
            {ASPECT_RATIO_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`${styles.chip} ${aspectRatio === r ? styles.chipActive : ""}`}
                onClick={() => onAspectRatioChange(r)}
                aria-pressed={aspectRatio === r}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel} htmlFor="controls-model">Model</label>
          <select
            id="controls-model"
            className={styles.select}
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <span className={styles.sectionLabel}>Art Style</span>
          <div className={styles.styleGrid}>
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style}
                type="button"
                className={`${styles.styleCard} ${selectedStyle === style ? styles.styleCardActive : ""}`}
                onClick={() => onStyleChange(style)}
              >
                <span className={styles.styleEmoji} aria-hidden="true">
                  {STYLE_PREVIEWS[style] || "🎨"}
                </span>
                <span className={styles.styleLabel}>{style}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sliderHeader}>
            <label className={styles.sectionLabel} htmlFor="steps-range">Steps</label>
            <span className={styles.sliderValue}>{steps}</span>
          </div>
          <input
            id="steps-range"
            type="range"
            className={styles.slider}
            min={10}
            max={100}
            step={5}
            value={steps}
            onChange={(e) => onStepsChange(Number(e.target.value))}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sliderHeader}>
            <label className={styles.sectionLabel} htmlFor="guidance-range">Guidance</label>
            <span className={styles.sliderValue}>{guidance.toFixed(1)}</span>
          </div>
          <input
            id="guidance-range"
            type="range"
            className={styles.slider}
            min={1}
            max={20}
            step={0.5}
            value={guidance}
            onChange={(e) => onGuidanceChange(Number(e.target.value))}
          />
        </section>
      </div>
    </aside>
  );
}
