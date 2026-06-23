import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Lesson } from "@/types/lesson";

const lessonsDirectory = path.join(process.cwd(), "src/content/lessons");

export async function getLesson(trackId: string, lessonId: string): Promise<Lesson | null> {
  try {
    const fullPath = path.join(lessonsDirectory, trackId, `${lessonId}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id: lessonId,
      trackId,
      title: data.title || "Untitled Lesson",
      description: data.description || "",
      duration: data.duration || "",
      humanModeContent: data.humanModeContent || "",
      examples: data.examples || "",
      quiz: data.quiz || [],
      content,
    };
  } catch (error) {
    console.error(`Error reading lesson: ${trackId}/${lessonId}`, error);
    return null;
  }
}
