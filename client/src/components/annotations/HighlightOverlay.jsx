import React from "react";
import { useAnnotations } from "../../contexts/AnnotationContext";
import { cn } from "../../lib/utils";

export default function HighlightOverlay({ pageNumber, scale, currentLesson }) {
  const { getAnnotationsByPage, setViewingAnnotation, setActivePanel } =
    useAnnotations();

  const annotations = getAnnotationsByPage(currentLesson?.id, pageNumber);

  const handleHighlightClick = (annotation) => {
    setViewingAnnotation(annotation);
    // Show appropriate panel
    if (annotation.type === "ai") {
      // Could open a view-only AI panel or history
      setActivePanel("history");
    } else {
      // Could open a view-only note panel or history
      setActivePanel("history");
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {annotations.map((annotation) => {
        const highlightColor =
          annotation.type === "note"
            ? "bg-green-400/30 hover:bg-green-400/40 border-green-500"
            : "bg-violet-400/30 hover:bg-violet-400/40 border-violet-500";

        // Simple highlight rendering - in real app, use annotation.position
        // for accurate positioning
        return (
          <div
            key={annotation.id}
            className={cn(
              "absolute rounded pointer-events-auto cursor-pointer transition-colors border-2",
              highlightColor
            )}
            onClick={() => handleHighlightClick(annotation)}
            style={{
              // This is a placeholder - real implementation would use position data
              left: `${Math.random() * 60 + 10}%`,
              top: `${Math.random() * 70 + 10}%`,
              width: "30%",
              height: "20px",
            }}
            title={
              annotation.type === "note"
                ? annotation.heading
                : `AI: ${annotation.action}`
            }
          />
        );
      })}
    </div>
  );
}
