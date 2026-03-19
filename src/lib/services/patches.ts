import { prisma } from "@/lib/db";

export async function getPatchFeedData() {
  const [patchNotes, rotationEvents] = await Promise.all([
    prisma.patchNote.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    }),
    prisma.mapRotationEvent.findMany({
      orderBy: {
        effectiveDate: "desc",
      },
    }),
  ]);

  return {
    patchNotes,
    rotationEvents,
  };
}
