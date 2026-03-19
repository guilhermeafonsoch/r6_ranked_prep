import { prisma } from "@/lib/db";

export async function getPlaybookIndexData() {
  const [squads, maps] = await Promise.all([
    prisma.squad.findMany({
      include: {
        members: true,
        notes: true,
        playbookCards: {
          include: {
            map: true,
            site: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.map.findMany({
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
  ]);

  return {
    squads,
    maps,
  };
}

export async function getPlaybookDetailData(squadId: string) {
  const [squad, maps, users] = await Promise.all([
    prisma.squad.findUnique({
      where: {
        id: squadId,
      },
      include: {
        owner: true,
        members: true,
        notes: {
          include: {
            map: true,
            site: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        playbookCards: {
          include: {
            map: true,
            site: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    }),
    prisma.map.findMany({
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
    prisma.user.findMany({
      orderBy: {
        displayName: "asc",
      },
    }),
  ]);

  return {
    squad,
    maps,
    users,
  };
}
