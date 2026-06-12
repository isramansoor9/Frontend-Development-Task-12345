"use client";

import { CloseIcon } from "@/components/icons/Icons";
import { STYLE_OPTIONS, ADVANCED_OPTIONS } from "@/lib/constants";
import styles from "./SettingsPanel.module.css";

const STYLE_PREVIEWS = {
  Photorealistic: "🌿",
  Cinematic: "🎬",
  Anime: "✨",
  "Oil Painting": "🖌️",
  Watercolor: "💧",
  "3D Render": "🔮",
};

export default function SettingsPanel({
  open,
  onClose,
  selectedStyle,
  onStyleChange,
  steps,
  onStepsChange,
  guidance,
  onGuidanceChange,
}) {
  return (
    <>
      {open && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.panel} glass ${open ? styles.panelOpen : ""}`}
        aria-label="Advanced settings"
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerDot} aria-hidden="true" />
            <h2 className={styles.title}>Settings</h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close settings"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ "--dot-color": "var(--color-purple)" }} />
              Art Style
            </h3>
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

          <div className={styles.divider} />

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ "--dot-color": "var(--color-cyan)" }} />
              Sampling
            </h3>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <label className={styles.sliderLabel} htmlFor="steps-input">
                  Inference Steps
                </label>
                <span className={styles.sliderValue}>{steps}</span>
              </div>
              <input
                id="steps-input"
                type="range"
                className={styles.slider}
                min={10}
                max={100}
                step={5}
                value={steps}
                onChange={(e) => onStepsChange(Number(e.target.value))}
                aria-label="Inference steps"
              />
              <div className={styles.sliderTicks}>
                <span>10</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <label className={styles.sliderLabel} htmlFor="guidance-input">
                  Guidance Scale
                </label>
                <span className={styles.sliderValue}>{guidance.toFixed(1)}</span>
              </div>
              <input
                id="guidance-input"
                type="range"
                className={styles.slider}
                min={1}
                max={20}
                step={0.5}
                value={guidance}
                onChange={(e) => onGuidanceChange(Number(e.target.value))}
                aria-label="Guidance scale"
              />
              <div className={styles.sliderTicks}>
                <span>1</span>
                <span>10</span>
                <span>20</span>
              </div>
            </div>
          </section>

          <div className={styles.divider} />

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ "--dot-color": "var(--color-pink)" }} />
              Quality Presets
            </h3>
            <div className={styles.presetGrid}>
              {[
                { id: "draft", label: "Draft", desc: "Fast preview", color: "var(--color-cyan)" },
                { id: "balanced", label: "Balanced", desc: "Recommended", color: "var(--color-purple)", active: true },
                { id: "quality", label: "Quality", desc: "Best output", color: "var(--color-pink)" },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`${styles.presetCard} ${preset.active ? styles.presetCardActive : ""}`}
                  style={{ "--preset-color": preset.color }}
                >
                  <span className={styles.presetLabel}>{preset.label}</span>
                  <span className={styles.presetDesc}>{preset.desc}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerNote}>
            Settings apply to next generation
          </p>
        </div>
      </aside>
    </>
  );
}
