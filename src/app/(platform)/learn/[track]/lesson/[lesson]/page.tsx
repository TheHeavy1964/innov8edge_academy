import { getLesson } from "@/lib/lessons";
import LessonClient from "./LessonClient";
import { notFound } from "next/navigation";

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ track: string, lesson: string }> 
}) {
  const { track, lesson: lessonId } = await params;
  const lessonData = await getLesson(track, lessonId);

  if (!lessonData) {
    notFound();
  }

  return <LessonClient lesson={lessonData} trackId={track} />;
}
