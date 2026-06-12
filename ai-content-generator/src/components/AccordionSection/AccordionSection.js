"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons/Icons";
import styles from "./AccordionSection.module.css";

export default function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `accordion-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.chevronButton} aria-hidden="true">
          <ChevronDownIcon
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          />
        </span>
      </button>

      <div
        id={panelId}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}
