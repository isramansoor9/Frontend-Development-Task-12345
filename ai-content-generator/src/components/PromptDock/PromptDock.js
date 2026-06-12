"use client";

import { useRef, useEffect } from "react";
import { SparkleIcon } from "@/components/icons/Icons";
import styles from "./PromptDock.module.css";

export const PROMPT_PLACEHOLDER =
  "describe your imaginations to be converted to piece of art";

export default function PromptDock({
  value,
  onChange,
  onGenerate,
  isGenerating,
  variant = "fixed",
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [value]);

  return (
    <div className={variant === "inline" ? styles.dockInline : styles.dock}>
      <div className={styles.inner}>
        <div className={styles.inputBox}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={PROMPT_PLACEHOLDER}
            rows={1}
            aria-label="Generation prompt"
          />
        </div>

        <button
          type="button"
          className={`${styles.generateBtn} ${isGenerating ? styles.generating : ""}`}
          onClick={onGenerate}
          disabled={isGenerating || !value.trim()}
          aria-label={isGenerating ? "Generating..." : "Generate"}
        >
          <SparkleIcon className={styles.sparkleIcon} />
          <span>{isGenerating ? "Creating..." : "Generate"}</span>
        </button>
      </div>
    </div>
  );
}
