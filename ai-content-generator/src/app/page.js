"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";
import Lightbox from "@/components/Lightbox/Lightbox";
import { useTheme } from "@/context/ThemeContext";
import logoImage from "@/assets/logo.png";
import {
  IMAGE_COUNT_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  MODEL_OPTIONS,
  STYLE_OPTIONS,
  ADVANCED_OPTIONS,
  HISTORY_ITEMS,
  DEFAULT_PROMPT,
} from "@/lib/constants";
import styles from "./page.module.css";

const INITIAL_IMAGES = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
];

function buildInitialItems() {
  return INITIAL_IMAGES.map((src, index) => ({
    id: `initial-${index}`,
    type: "image",
    src,
    alt: `Sample portrait ${index + 1}`,
  }));
}

/* ── Thumbtack pin ───────────────────────────────── */
function Pin({ color = "red", style: extraStyle }) {
  const cls = {
    red:    styles.pinRed,
    blue:   styles.pinBlue,
    gold:   styles.pinGold,
    orange: styles.pinOrange,
  }[color] || styles.pinRed;
  return <span className={`${styles.pin} ${cls}`} style={extraStyle} aria-hidden="true" />;
}

/* ── Main page ─────────────────────────────────────── */
export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contentType, setContentType]       = useState("image");
  const [prompt, setPrompt]                 = useState("");
  const [resultsPrompt, setResultsPrompt]   = useState(DEFAULT_PROMPT);
  const [imageCount, setImageCount]         = useState(8);
  const [aspectRatio, setAspectRatio]       = useState("1:1");
  const [model, setModel]                   = useState("Flux Pro");
  const [selectedStyle, setSelectedStyle]   = useState("Photorealistic");
  const [steps, setSteps]                   = useState(30);
  const [guidance, setGuidance]             = useState(7.5);
  const [items, setItems]                   = useState(buildInitialItems);
  const [isGenerating, setIsGenerating]     = useState(false);
  const [error, setError]                   = useState("");
  const [lightbox, setLightbox]             = useState(null);
  const [advOpen, setAdvOpen]               = useState(false);
  const [stylesOpen, setStylesOpen]         = useState(false);

  const promptRef = useRef(null);
  const charCount = prompt.length;

  const openLightbox  = useCallback(({ src, alt }) => setLightbox({ src, alt }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError("");
    try {
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prompt: prompt.trim(), type: contentType, count: imageCount, aspectRatio, model }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed.");
      setItems(data.items);
      setResultsPrompt(prompt.trim());
    } catch (err) {
      const msg = err.message || "Something went wrong. Please try again.";
      setError(msg);
      setTimeout(() => setError(""), 5500);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, contentType, imageCount, aspectRatio, model]);

  /* ⌘/Ctrl + Enter */
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleGenerate(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleGenerate]);

  /* Auto-grow textarea */
  useEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`;
  }, [prompt]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className={styles.shell}>

      {/* ── Mobile top bar (≤900px) ─────────────────── */}
      <header className={styles.mobileBar}>
        <div className={styles.mobileBarLeft}>
          <Image src={logoImage} alt="Logo" width={28} height={28} className={styles.mobileBarLogo} priority />
        </div>
        <div className={styles.mobileBarRight}>
          <button className={styles.mobileBarBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? "☀" : "☾"}
          </button>
          <button
            className={styles.mobileBarBtn}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "≡"}
          </button>
        </div>
      </header>

      {/* ── Wooden frame + Cork surface ─────────────── */}
      <div className={styles.frameOuter}>
        <div className={styles.woodFrame}>
          <div className={styles.cork}>

            {/* Cork grain & light overlays */}
            <div className={styles.corkGrain}  aria-hidden="true" />
            <div className={styles.lightRays}  aria-hidden="true" />

            {/* == BOARD HEADER == */}
            <header className={styles.boardHeader}>
              {/* Logo note */}
              <div className={`${styles.pinnedNote} ${styles.notePaper}`} style={{ "--rot": "-1.5deg" }}>
                <Pin color="blue" />
                <Image src={logoImage} alt="Logo" width={22} height={22} className={styles.noteLogo} />
              </div>

              {/* Studio label */}
              <div className={`${styles.pinnedNote} ${styles.noteYellow}`} style={{ "--rot": "-2.5deg" }}>
                <Pin />
                <span className={styles.noteTiny}>AI content generation</span>
              </div>

              {/* Theme toggle */}
              <button
                className={`${styles.pinnedNote} ${styles.noteBlue}`}
                style={{ "--rot": "1.8deg" }}
                onClick={toggleTheme}
                aria-label="Toggle light/dark mode"
              >
                <Pin color="blue" />
                <span className={styles.noteTiny}>{isDark ? "Light mode" : "Dark mode"}</span>
              </button>

              {/* Error note */}
              {error && (
                <div
                  className={`${styles.pinnedNote} ${styles.noteError}`}
                  style={{ "--rot": "-1deg" }}
                  role="alert"
                  aria-live="assertive"
                >
                  <Pin />
                  <span className={styles.noteTiny}>{error}</span>
                </div>
              )}
            </header>

            {/* == BOARD MAIN (three columns) == */}
            <div className={`${styles.boardMain} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>

              {/* ── LEFT: Controls as sticky notes ── */}
              <aside className={styles.leftCol} aria-label="Generation controls">

                {/* Mode note */}
                <div className={`${styles.stickyNote} ${styles.noteYellow}`} style={{ "--rot": "-2deg" }}>
                  <Pin />
                  <span className={styles.noteHeading}>Create</span>
                  <div className={styles.typeToggle} role="tablist">
                    {["image", "video"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={contentType === t}
                        className={`${styles.typeBtn} ${contentType === t ? styles.typeBtnActive : ""}`}
                        onClick={() => { setContentType(t); setMobileMenuOpen(false); }}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings note */}
                <div className={`${styles.stickyNote} ${styles.notePaper}`} style={{ "--rot": "1.5deg" }}>
                  <Pin color="blue" />
                  <span className={styles.noteHeading}>Settings</span>

                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}># Images</span>
                    <div className={styles.chipRow}>
                      {IMAGE_COUNT_OPTIONS.map((n) => (
                        <button
                          key={n} type="button"
                          className={`${styles.chip} ${imageCount === n ? styles.chipActive : ""}`}
                          onClick={() => setImageCount(n)}
                        >{n}</button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>Ratio</span>
                    <div className={styles.chipRow}>
                      {ASPECT_RATIO_OPTIONS.map((r) => (
                        <button
                          key={r} type="button"
                          className={`${styles.chip} ${aspectRatio === r ? styles.chipActive : ""}`}
                          onClick={() => setAspectRatio(r)}
                        >{r}</button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.settingRow}>
                    <label className={styles.settingLabel} htmlFor="model-sel">Model</label>
                    <select
                      id="model-sel"
                      className={styles.noteSelect}
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      {MODEL_OPTIONS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Styles note */}
                <div className={`${styles.stickyNote} ${styles.noteGreen}`} style={{ "--rot": "2deg" }}>
                  <Pin color="gold" />
                  <button
                    className={styles.noteHeadingBtn}
                    onClick={() => setStylesOpen(v => !v)}
                    aria-expanded={stylesOpen}
                  >
                    Styles <span className={styles.advToggle}>{stylesOpen ? "−" : "+"}</span>
                  </button>
                  {stylesOpen && (
                    <div className={styles.advBody}>
                      <div className={styles.styleGrid}>
                        {STYLE_OPTIONS.map((s) => (
                          <button
                            key={s} type="button"
                            className={`${styles.styleChip} ${selectedStyle === s ? styles.styleChipActive : ""}`}
                            onClick={() => setSelectedStyle(s)}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advance note */}
                <div className={`${styles.stickyNote} ${styles.noteBlue}`} style={{ "--rot": "-1deg" }}>
                  <Pin color="blue" />
                  <button
                    className={styles.noteHeadingBtn}
                    onClick={() => setAdvOpen(v => !v)}
                    aria-expanded={advOpen}
                  >
                    Advance <span className={styles.advToggle}>{advOpen ? "−" : "+"}</span>
                  </button>
                  {advOpen && (
                    <div className={styles.advBody}>
                      <div className={styles.settingRow}>
                        <label className={styles.settingLabel} htmlFor="steps-sel">Steps</label>
                        <select id="steps-sel" className={styles.noteSelect} value={steps}
                          onChange={(e) => setSteps(Number(e.target.value))}>
                          {ADVANCED_OPTIONS.steps.map((v) => <option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className={styles.settingRow}>
                        <label className={styles.settingLabel} htmlFor="guid-sel">Guidance</label>
                        <select id="guid-sel" className={styles.noteSelect} value={guidance}
                          onChange={(e) => setGuidance(Number(e.target.value))}>
                          {ADVANCED_OPTIONS.guidance.map((v) => <option key={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* ── CENTER: Prompt paper ── */}
              <main className={styles.centerCol} aria-label="Prompt workspace">
                <div className={styles.centerPaper}>
                  <Pin style={{ top: "-10px", left: "50%", transform: "translateX(-50%)" }} />

                  {/* Results prompt (faded, behind textarea) */}
                  {resultsPrompt && (
                    <p className={styles.resultPrompt}>{resultsPrompt}</p>
                  )}

                  {/* Input textarea */}
                  <div className={styles.textareaWrap}>
                    <textarea
                      ref={promptRef}
                      className={styles.promptTextarea}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to create..."
                      maxLength={600}
                      rows={3}
                      aria-label="Image generation prompt"
                    />
                    <span
                      className={`${styles.charCount} ${charCount > 500 ? styles.charWarn : ""} ${charCount > 580 ? styles.charDanger : ""}`}
                      aria-live="polite"
                    >
                      {charCount}/600
                    </span>
                  </div>

                  {/* Generate button */}
                  <button
                    type="button"
                    className={`${styles.generateBtn} ${isGenerating ? styles.generateBtnLoading : ""}`}
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    aria-busy={isGenerating}
                  >
                    <span className={styles.generateBtnInner}>
                      {isGenerating && <span className={styles.progressBar} aria-hidden="true" />}
                      {isGenerating ? "Generating…" : "✦  Generate"}
                    </span>
                  </button>

                  <p className={styles.kbdHint}>⌘ Enter to generate</p>
                </div>
              </main>

              {/* ── RIGHT: Polaroid gallery ── */}
              <section className={styles.rightCol} aria-label="Generated images">
                <GalleryGrid
                  items={items}
                  isGenerating={isGenerating}
                  expectedCount={imageCount}
                  onImageClick={openLightbox}
                />
              </section>
            </div>

            {/* == BOARD BOTTOM == */}
            <footer className={styles.boardBottom}>

              {/* History box */}
              <div className={styles.historyBox}>
                <div className={styles.historyBoxTop}>
                  <Pin />
                  <span className={styles.historyLabel}>History</span>
                  <button className={styles.historyViewAll} type="button">View all</button>
                </div>
                <div className={`${styles.historyGrid} scrollbar-hidden`}>
                  {HISTORY_ITEMS.slice(0, 10).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.historyThumb}
                      onClick={() => openLightbox({ src: item.src, alt: item.alt })}
                      aria-label={item.alt}
                    >
                      <div className={styles.historyPolaroid}>
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={50}
                          height={50}
                          className={styles.historyThumbImg}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </footer>

          </div>{/* /cork */}
        </div>{/* /woodFrame */}
      </div>{/* /frameOuter */}

      {/* == DESK SHELF == */}
      <div className={styles.deskShelf}>
        <div className={styles.deskLeft}>
          <span className={styles.deskIcon} aria-hidden="true">📞</span>
          <span className={styles.deskLabel}>Contact Us</span>
        </div>
        <p className={styles.copyright}>© 2026 All Rights Reserved</p>
        <div className={styles.deskRight}>
          <span className={styles.deskIcon} aria-label="Fishbowl decoration">🐟</span>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />}
    </div>
  );
}
