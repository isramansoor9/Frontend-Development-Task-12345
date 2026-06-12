"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { CloseIcon } from "@/components/icons/Icons";
import styles from "./Lightbox.module.css";

function toHighResSrc(src) {
  try {
    const url = new URL(src);
    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("w", "1600");
      url.searchParams.delete("h");
      url.searchParams.set("q", "92");
      url.searchParams.set("fit", "max");
      return url.toString();
    }
  } catch {
    // not a valid URL, return as-is
  }
  return src;
}

export default function Lightbox({ src, alt, onClose }) {
  const hiResSrc = toHighResSrc(src);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
    >
      <div className={styles.noiseOverlay} aria-hidden="true" />

      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close preview"
      >
        <CloseIcon className={styles.closeIcon} />
      </button>

      <div
        className={styles.imageWrap}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.glowRing} aria-hidden="true" />
        <Image
          src={hiResSrc}
          alt={alt || ""}
          width={800}
          height={1000}
          className={styles.image}
          quality={95}
          priority
          style={{ objectFit: "contain", maxHeight: "88vh", maxWidth: "88vw" }}
        />
        {alt && (
          <div className={styles.caption}>
            <p className={styles.captionText}>{alt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
