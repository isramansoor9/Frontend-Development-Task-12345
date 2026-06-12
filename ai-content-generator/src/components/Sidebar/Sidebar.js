"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import AccordionSection from "@/components/AccordionSection/AccordionSection";
import accordionStyles from "@/components/AccordionSection/AccordionSection.module.css";
import Dropdown from "@/components/Dropdown/Dropdown";
import {
  HomeIcon,
  GalleryIcon,
  VideoIcon,
  EditIcon,
  FolderIcon,
  MoonIcon,
  SunIcon,
  HistoryIcon,
  ImageIcon,
  CloseIcon,
} from "@/components/icons/Icons";
import {
  HISTORY_ITEMS,
  ADVANCED_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  IMAGE_COUNT_OPTIONS,
  MODEL_OPTIONS,
  STYLE_OPTIONS,
} from "@/lib/constants";
import logoImage from "@/assets/logo.png";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon, active: true },
  { id: "gallery", label: "Gallery", icon: GalleryIcon },
  { id: "video", label: "Video", icon: VideoIcon },
  { id: "edit", label: "Edit", icon: EditIcon },
  { id: "folders", label: "Folders", icon: FolderIcon },
];

export default function Sidebar({
  isOpen = false,
  onClose,
  onHistoryImageClick,
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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeId, setActiveId] = useState("home");

  const scrollRef = useRef(null);
  const dragState = useRef({ active: false, hasDragged: false, startY: 0, scrollTop: 0 });

  const endDrag = useCallback(() => {
    dragState.current.active = false;
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.active) return;
    const dy = e.pageY - dragState.current.startY;
    if (Math.abs(dy) > 4) dragState.current.hasDragged = true;
    if (dragState.current.hasDragged) {
      e.preventDefault();
      el.scrollTop = dragState.current.scrollTop - dy;
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    const el = scrollRef.current;
    if (!el || e.button !== 0) return;
    dragState.current = { active: true, hasDragged: false, startY: e.pageY, scrollTop: el.scrollTop };
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", endDrag);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);
    };
  }, [endDrag, handleMouseMove]);

  const closeIfMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      onClose?.();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        aria-label="Sidebar navigation and controls"
      >
      <div className={styles.logoSection}>
        <Image
          src={logoImage}
          alt="Logo"
          width={45}
          height={56}
          className={styles.logoImage}
          priority
        />
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon className={styles.closeIcon} />
        </button>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                className={`${styles.navItem} ${activeId === id ? styles.navItemActive : ""}`}
                aria-current={activeId === id ? "page" : undefined}
                onClick={() => {
                  setActiveId(id);
                  closeIfMobile();
                }}
              >
                <span className={styles.navIconWrap}>
                  <Icon className={styles.navIcon} />
                </span>
                <span className={styles.navLabel}>{label}</span>
                {activeId === id && <span className={styles.navActiveBar} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.scrollBody}>
      <div className={styles.controlsSection}>
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

        <div className={styles.quickSettings}>
          <Dropdown
            label="# Images"
            value={imageCount}
            options={IMAGE_COUNT_OPTIONS}
            formatOption={(value) => `${value}`}
            onChange={onImageCountChange}
            hideValue
            fullWidth
          />
          <Dropdown
            label=""
            value={aspectRatio}
            options={ASPECT_RATIO_OPTIONS}
            onChange={onAspectRatioChange}
            fullWidth
          />
          <Dropdown
            label="Model:"
            value={model}
            options={["Model", ...MODEL_OPTIONS]}
            onChange={onModelChange}
            boldValue
            mutedLabel
            fullWidth
          />
        </div>

        <div className={styles.accordions}>
          <AccordionSection title="Advance">
            <div className={accordionStyles.fieldRow}>
              <label className={accordionStyles.fieldLabel} htmlFor="steps-select">
                Steps
              </label>
              <select
                id="steps-select"
                className={accordionStyles.fieldSelect}
                value={steps}
                onChange={(e) => onStepsChange(Number(e.target.value))}
              >
                {ADVANCED_OPTIONS.steps.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className={accordionStyles.fieldRow}>
              <label className={accordionStyles.fieldLabel} htmlFor="guidance-select">
                Guidance
              </label>
              <select
                id="guidance-select"
                className={accordionStyles.fieldSelect}
                value={guidance}
                onChange={(e) => onGuidanceChange(Number(e.target.value))}
              >
                {ADVANCED_OPTIONS.guidance.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </AccordionSection>

          <AccordionSection title="Styles">
            <div className={accordionStyles.optionGrid}>
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`${accordionStyles.optionButton} ${
                    selectedStyle === style ? accordionStyles.optionButtonActive : ""
                  }`}
                  onClick={() => onStyleChange(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </AccordionSection>
        </div>
      </div>

      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <HistoryIcon className={styles.historyIcon} />
          <span className={styles.historyTitle}>History</span>
          <button type="button" className={styles.historyViewAll}>All</button>
        </div>

        <div
          ref={scrollRef}
          className={`${styles.historyGrid} scrollbar-hidden`}
          onMouseDown={handleMouseDown}
        >
          {HISTORY_ITEMS.slice(0, 12).map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.historyThumb}
              aria-label={item.alt}
              onClick={() => {
                if (!dragState.current.hasDragged) {
                  onHistoryImageClick?.({ src: item.src, alt: item.alt });
                }
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={48}
                height={48}
                className={styles.historyThumbImg}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon className={styles.themeIcon} /> : <MoonIcon className={styles.themeIcon} />}
          <span className={styles.themeBtnLabel}>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button type="button" className={styles.avatarBtn} aria-label="Profile">
          <Image
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop"
            alt="User profile"
            width={32}
            height={32}
            className={styles.avatarImg}
          />
        </button>
      </div>
    </aside>
    </>
  );
}
