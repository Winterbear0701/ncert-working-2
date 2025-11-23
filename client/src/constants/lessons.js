import { lessons as lessonPDFs } from "../assets/index.js";

/**
 * Lessons Configuration
 *
 * TODO: Move this to backend API
 * Replace static data with dynamic API call: GET /api/lessons
 *
 * Backend should return:
 * - Lesson metadata (id, title, description, number)
 * - PDF URLs (from cloud storage like S3, Azure Blob, etc.)
 * - Additional fields (author, duration, difficulty, tags, etc.)
 */

export const SAMPLE_LESSONS = [
  {
    id: 1,
    number: 1,
    title: "Locating Places on the Earth",
    description:
      "Directions on maps, latitude, longitude, time zones, and the International Date Line.",
    pdfUrl: lessonPDFs.lesson1,
    // TODO: Add when backend is ready
    // author: "John Doe",
    // duration: "45 mins",
    // difficulty: "beginner",
    // tags: ["geography", "maps"],
  },
  {
    id: 2,
    number: 2,
    title: "Oceans and Continents",
    description:
      "Identification of continents, oceans, climate, and their effect on patterns of life and resources.",
    pdfUrl: lessonPDFs.lesson2,
  },
  {
    id: 3,
    number: 3,
    title: "Landforms and Life",
    description:
      "Types of landforms, their features, and how they shape local to global livelihoods.",
    pdfUrl: lessonPDFs.lesson3,
  },
  {
    id: 4,
    number: 4,
    title: "Timeline and Sources of History",
    description:
      "Measuring time in history and recognizing sources and life of early humans.",
    pdfUrl: lessonPDFs.lesson4,
  },
  {
    id: 5,
    number: 5,
    title: "The Beginning of Indian Civilization",
    description:
      "Distinctive features of important towns (e.g., Harappa) and continuity of civilization.",
    pdfUrl: lessonPDFs.lesson5,
  },
  {
    id: 6,
    number: 6,
    title: "India, That Is Bharat",
    description: "Roots of India's name, unity in diversity, and heritage.",
    pdfUrl: lessonPDFs.lesson6,
  },
  {
    id: 7,
    number: 7,
    title: "India's Cultural Roots",
    description: "Tracing the roots and traditions that shaped Indian society.",
    pdfUrl: lessonPDFs.lesson7,
  },
  {
    id: 8,
    number: 8,
    title: "Unity in Diversity",
    description:
      "How diversity enriches our country through food, festivals, textiles, and epics.",
    pdfUrl: lessonPDFs.lesson8,
  },
  {
    id: 9,
    number: 9,
    title: "Family and Community",
    description:
      "Importance and role of family and community in nation-building.",
    pdfUrl: lessonPDFs.lesson9,
  },
  {
    id: 10,
    number: 10,
    title: "Grassroot Democracy (Governance)",
    description:
      "Levels and parts of governance, power sharing, and the Constitution.",
    pdfUrl: lessonPDFs.lesson10,
  },
  {
    id: 11,
    number: 11,
    title: "Grassroot Democracy – Local Government in Rural Areas",
    description:
      "Functioning of rural administration and local self-government.",
    pdfUrl: lessonPDFs.lesson11,
  },
  {
    id: 12,
    number: 12,
    title: "Grassroot Democracy – Local Government in Urban Areas",
    description: "Role of urban local bodies and civic administration.",
    pdfUrl: lessonPDFs.lesson12,
  },
  {
    id: 13,
    number: 13,
    title: "The Value of Work",
    description:
      "Difference between economic and non-economic activity, value of community work.",
    pdfUrl: lessonPDFs.lesson13,
  },
  {
    id: 14,
    number: 14,
    title: "Economic Activities Around Us",
    description:
      "Production, trade, consumption, and differentiating economic sectors.",
    pdfUrl: lessonPDFs.lesson14,
  },
];
