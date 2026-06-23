import { redirect } from "next/navigation";

/**
 * Legacy route: /learn/[track]/[lesson]
 * Redirects to the canonical MDX-powered route: /learn/[track]/lesson/[lesson]
 * This ensures old bookmarks and any stale links still work correctly.
 */
export default async function LegacyLessonRedirect({
  params,
}: {
  params: Promise<{ track: string; lesson: string }>;
}) {
  const { track, lesson } = await params;
  redirect(`/learn/${track}/lesson/${lesson}`);
}
