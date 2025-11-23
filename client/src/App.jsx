import { useState } from "react";
import PDFViewer from "./features/pdf/PDFViewer";
import LessonNavigation from "./features/lessons/LessonNavigation";
import { SAMPLE_LESSONS } from "./constants/lessons";
import { Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";

/**
 * Main App Component
 *
 * State management has been migrated from Context API to Zustand.
 * No need for AnnotationProvider wrapper anymore.
 *
 * TODO: Backend Integration Points
 * =================================
 * 1. Replace SAMPLE_LESSONS with API call on component mount
 * 2. Add authentication state management
 * 3. Implement user profile/settings
 * 4. Add error boundaries for better error handling
 * 5. Implement loading states
 */

function App() {
  const [currentLesson, setCurrentLesson] = useState(SAMPLE_LESSONS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  // TODO: Fetch lessons from backend on mount
  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     try {
  //       const response = await lessonService.fetchAll();
  //       setLessons(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch lessons:', error);
  //     }
  //   };
  //   fetchLessons();
  // }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Lesson Navigation */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-0"
        } overflow-hidden border-r`}
      >
        <LessonNavigation
          lessons={SAMPLE_LESSONS}
          currentLesson={currentLesson}
          onLessonSelect={handleLessonSelect}
        />
      </div>

      {/* Main Content - PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-card flex items-center gap-4">
          {/* Toggle Sidebar Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-primary/10"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentLesson.description}
              </p>
            )}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer
            pdfUrl={currentLesson.pdfUrl}
            currentLesson={currentLesson}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
