import React, { useState } from "react";
import { Sparkles, Lightbulb, FileText, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useAnnotations } from "../../contexts/AnnotationContext";

const AI_ACTIONS = [
  {
    id: "simplify",
    label: "Simplify",
    icon: Lightbulb,
    description: "Make it easier to understand",
    color: "text-blue-600",
  },
  {
    id: "refine",
    label: "Refine",
    icon: Sparkles,
    description: "Improve and enhance the text",
    color: "text-purple-600",
  },
  {
    id: "examples",
    label: "Examples",
    icon: BookOpen,
    description: "Provide practical examples",
    color: "text-green-600",
  },
  {
    id: "explain",
    label: "Explain",
    icon: FileText,
    description: "Detailed explanation",
    color: "text-orange-600",
  },
];

export default function AIPanel({ open, onClose, currentLesson, pageNumber }) {
  const { selectedText, addAIAnnotation, updateAIResponse } = useAnnotations();
  const [selectedAction, setSelectedAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");

  const handleActionSelect = async (action) => {
    setSelectedAction(action.id);
    setIsProcessing(true);

    // Simulate AI processing (replace with actual AI API call)
    setTimeout(() => {
      let aiResponse = "";

      switch (action.id) {
        case "simplify":
          aiResponse = `Simplified version:\n\n${
            selectedText?.text || ""
          }\n\nThis text explains the concept in simpler terms...`;
          break;
        case "refine":
          aiResponse = `Refined version:\n\n${
            selectedText?.text || ""
          }\n\nEnhanced with better clarity and structure...`;
          break;
        case "examples":
          aiResponse = `Examples:\n\n1. Example one related to: ${
            selectedText?.text || ""
          }\n2. Example two...\n3. Example three...`;
          break;
        case "explain":
          aiResponse = `Detailed Explanation:\n\n${
            selectedText?.text || ""
          }\n\nThis concept works by...`;
          break;
        default:
          aiResponse = "Processing...";
      }

      setResponse(aiResponse);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (selectedText && selectedAction) {
      addAIAnnotation({
        text: selectedText.text,
        action: selectedAction,
        response: response,
        pageNumber: pageNumber,
        position: selectedText.position,
        lessonId: currentLesson?.id,
      });

      // Reset and close
      setSelectedAction(null);
      setResponse("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    setResponse("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        onClose={handleClose}
        className="w-[500px] max-w-[90vw] overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            AI Assistant
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

          {/* AI Actions */}
          {!selectedAction && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What would you like to do?</p>
              <div className="grid gap-2">
                {AI_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto justify-start p-4"
                      onClick={() => handleActionSelect(action)}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${action.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Response */}
          {selectedAction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="ai">
                  {AI_ACTIONS.find((a) => a.id === selectedAction)?.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAction(null);
                    setResponse("");
                  }}
                >
                  Change Action
                </Button>
              </div>

              <div className="h-auto rounded-lg border bg-background p-4 ">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <Sparkles className="h-8 w-8 animate-pulse text-violet-600 mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Processing...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {response}
                    </pre>
                  </div>
                )}
              </div>

              {!isProcessing && response && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleSave}
                  >
                    Save Annotation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleActionSelect(
                        AI_ACTIONS.find((a) => a.id === selectedAction)
                      )
                    }
                  >
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
