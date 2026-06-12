"use client";

import { SparkleIcon, ImageIcon, VideoIcon, SettingsIcon } from "@/components/icons/Icons";
import { IMAGE_COUNT_OPTIONS, ASPECT_RATIO_OPTIONS, MODEL_OPTIONS } from "@/lib/constants";
import styles from "./PromptBar.module.css";

export default function PromptBar({
  contentType,
  onContentTypeChange,
  prompt,
  imageCount,
  onImageCountChange,
  aspectRatio,
  onAspectRatioChange,
  model,
  onModelChange,
  onGenerate,
  isGenerating,
  settingsOpen,
  onSettingsToggle,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
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

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Count</span>
            <div className={styles.chips}>
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
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Ratio</span>
            <div className={styles.chips}>
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
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel} htmlFor="model-select">Model</label>
            <select
              id="model-select"
              className={styles.modelSelect}
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.settingsBtn} ${settingsOpen ? styles.settingsBtnActive : ""}`}
            onClick={onSettingsToggle}
            aria-pressed={settingsOpen}
            aria-label="Toggle settings"
            title="Advanced settings"
          >
            <SettingsIcon className={styles.settingsIcon} />
          </button>

          <button
            type="button"
            className={`${styles.generateBtn} ${isGenerating ? styles.generating : ""}`}
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            aria-label={isGenerating ? "Generating..." : "Generate"}
          >
            <SparkleIcon className={styles.sparkleIcon} />
            <span>{isGenerating ? "Generating..." : "Generate"}</span>
            {!isGenerating && <kbd className={styles.kbd}>⌘↵</kbd>}
          </button>
        </div>
      </div>
    </div>
  );
}
