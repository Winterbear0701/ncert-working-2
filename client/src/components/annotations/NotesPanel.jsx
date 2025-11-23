import React, { useState } from "react";
import { StickyNote, Save } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useAnnotations } from "../../contexts/AnnotationContext";

export default function NotesPanel({
  open,
  onClose,
  currentLesson,
  pageNumber,
}) {
  const { selectedText, addNote } = useAnnotations();
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (selectedText && heading.trim()) {
      addNote({
        text: selectedText.text,
        heading: heading.trim(),
        content: content.trim(),
        pageNumber: pageNumber,
        position: selectedText.position,
        lessonId: currentLesson?.id,
      });

      // Reset and close
      setHeading("");
      setContent("");
      onClose();
    }
  };

  const handleClose = () => {
    setHeading("");
    setContent("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        onClose={handleClose}
        className="w-[500px] max-w-[90vw]"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-green-600" />
            Take a Note
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Selected Text */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Selected Text
            </p>
            <p className="text-sm leading-relaxed">{selectedText?.text}</p>
          </div>

          {/* Note Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Heading <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter a heading for your note..."
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Your Notes (Optional)
              </label>
              <Textarea
                placeholder="Add your thoughts, insights, or additional context..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="pt-4 flex gap-2">
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleSave}
                disabled={!heading.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Note: Your note will be highlighted in{" "}
              <span className="font-semibold text-green-600">green</span> on the
              PDF. Click on any highlight to view its details.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
