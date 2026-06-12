"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons/Icons";
import styles from "./Dropdown.module.css";

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  formatOption = (option) => String(option),
  getValue = (option) => option,
  boldValue = false,
  hideValue = false,
  mutedLabel = false,
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.root} ${fullWidth ? styles.rootFull : ""}`} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.triggerContent}>
          {label ? (
            <span className={mutedLabel ? styles.labelMuted : styles.label}>
              {label}
            </span>
          ) : null}
          {!hideValue && (
            <span className={boldValue ? styles.valueBold : styles.value}>
              {formatOption(value)}
            </span>
          )}
        </span>
        <span className={styles.chevronWrap} aria-hidden="true">
          <ChevronDownIcon className={styles.chevron} />
        </span>
      </button>

      {open && (
        <ul id={listId} className={styles.menu} role="listbox">
          {options.map((option) => {
            const optionValue = getValue(option);
            const selected = optionValue === value;

            return (
              <li key={String(optionValue)} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`${styles.option} ${selected ? styles.selected : ""}`}
                  onClick={() => {
                    onChange(optionValue);
                    setOpen(false);
                  }}
                >
                  {formatOption(option)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
