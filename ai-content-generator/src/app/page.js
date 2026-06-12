"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";
import PromptDock from "@/components/PromptDock/PromptDock";
import Lightbox from "@/components/Lightbox/Lightbox";
import { DEFAULT_PROMPT } from "@/lib/constants";
import styles from "./page.module.css";

const INITIAL_IMAGES = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&h=500&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=700&h=700&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=500&fit=crop",
];

function buildInitialItems() {
  return INITIAL_IMAGES.map((src, index) => ({
    id: `initial-${index}`,
    type: "image",
    src,
    alt: `Sample portrait ${index + 1}`,
  }));
}

export default function HomePage() {
  const [contentType, setContentType] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [resultsPrompt, setResultsPrompt] = useState(DEFAULT_PROMPT);
  const [imageCount, setImageCount] = useState(8);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [model, setModel] = useState("Model");
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [items, setItems] = useState(buildInitialItems);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = useCallback(({ src, alt }) => setLightbox({ src, alt }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const handlePromptCardClick = useCallback(() => {
    setPrompt("");
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), type: contentType, count: imageCount, aspectRatio, model }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Generation failed.");
      setItems(data.items);
      setResultsPrompt(prompt.trim());
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, contentType, imageCount, aspectRatio, model]);

  useEffect(() => {
    const handler = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleGenerate(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleGenerate]);

  return (
    <div className={styles.shell}>
      <Sidebar
        onHistoryImageClick={openLightbox}
        contentType={contentType}
        onContentTypeChange={setContentType}
        imageCount={imageCount}
        onImageCountChange={setImageCount}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        model={model}
        onModelChange={setModel}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        steps={steps}
        onStepsChange={setSteps}
        guidance={guidance}
        onGuidanceChange={setGuidance}
      />

      <div className={styles.workspace}>
        <div className={`${styles.content} ${styles.contentWithDock}`}>
          {error && (
            <div className={styles.error} role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <GalleryGrid
            prompt={prompt.trim() || resultsPrompt}
            items={items}
            isGenerating={isGenerating}
            expectedCount={imageCount}
            onImageClick={openLightbox}
            onPromptCardClick={prompt.trim() ? handlePromptCardClick : undefined}
          />
        </div>

        <PromptDock
          value={prompt}
          onChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
    </div>
  );
}
