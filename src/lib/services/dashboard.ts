import { prisma } from "@/lib/db";

export async function getDashboardData() {
  const [maps, patches, squads, latestNotes, rotationEvents] = await Promise.all([
    prisma.map.findMany({
      where: {
        inRotation: true,
      },
      include: {
        sites: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.patchNote.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
    }),
    prisma.squad.findMany({
      include: {
        members: true,
        playbookCards: true,
        notes: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
    }),
    prisma.savedNote.findMany({
      include: {
        map: true,
        site: true,
        squad: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
    }),
    prisma.mapRotationEvent.findMany({
      orderBy: {
        effectiveDate: "desc",
      },
      take: 2,
    }),
  ]);

  return {
    maps,
    patches,
    squads,
    latestNotes,
    rotationEvents,
  };
}
