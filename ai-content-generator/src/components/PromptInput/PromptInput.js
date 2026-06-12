"use client";

import { useRef, useEffect } from "react";
import styles from "./PromptInput.module.css";

export const PROMPT_PLACEHOLDER =
  "describe your imaginations to be converted to piece of art";

export default function PromptInput({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
  }, [value]);

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="prompt-input">
        Your prompt
      </label>
      <div className={styles.box}>
        <textarea
          id="prompt-input"
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PROMPT_PLACEHOLDER}
          rows={1}
          aria-label="Generation prompt"
        />
      </div>
    </div>
  );
}
