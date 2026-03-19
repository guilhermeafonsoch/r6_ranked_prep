"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUserWithFallback } from "@/lib/demo-auth";
import {
  playbookCardSchema,
  savedNoteSchema,
  squadMemberSchema,
  squadSchema,
} from "@/lib/validation/forms";
import { parseCsv, parseJsonText, parseLines } from "@/lib/utils";

function revalidatePlaybookPaths(squadId?: string | null) {
  revalidatePath("/playbook");
  if (squadId) {
    revalidatePath(`/playbook/${squadId}`);
  }
}

export async function saveSquadAction(formData: FormData) {
  const user = await getCurrentUserWithFallback();

  if (!user) {
    throw new Error("Demo user not found.");
  }

  const parsed = squadSchema.parse({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name"),
  });

  if (parsed.id) {
    await prisma.squad.update({
      where: { id: parsed.id },
      data: { name: parsed.name },
    });

    revalidatePlaybookPaths(parsed.id);
    return;
  }

  const squad = await prisma.squad.create({
    data: {
      ownerId: user.id,
      name: parsed.name,
    },
  });

  revalidatePlaybookPaths(squad.id);
}

export async function deleteSquadAction(formData: FormData) {
  const squadId = String(formData.get("id") ?? "");
  if (!squadId) {
    throw new Error("Squad id is required.");
  }

  await prisma.squad.delete({
    where: { id: squadId },
  });

  revalidatePath("/playbook");
}

export async function saveSquadMemberAction(formData: FormData) {
  const parsed = squadMemberSchema.parse({
    id: (formData.get("id") as string) || undefined,
    squadId: formData.get("squadId"),
    userId: (formData.get("userId") as string) || undefined,
    nickname: formData.get("nickname"),
    preferredRolesText: formData.get("preferredRolesText"),
    comfortOperatorsText: formData.get("comfortOperatorsText"),
  });

  const data = {
    squadId: parsed.squadId,
    userId: parsed.userId || null,
    nickname: parsed.nickname,
    preferredRoles: parseCsv(parsed.preferredRolesText),
    comfortOperators: parseCsv(parsed.comfortOperatorsText),
  };

  if (parsed.id) {
    await prisma.squadMember.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    await prisma.squadMember.create({ data });
  }

  revalidatePlaybookPaths(parsed.squadId);
}

export async function deleteSquadMemberAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const squadId = String(formData.get("squadId") ?? "");

  if (!id || !squadId) {
    throw new Error("Member id and squad id are required.");
  }

  await prisma.squadMember.delete({
    where: { id },
  });

  revalidatePlaybookPaths(squadId);
}

export async function savePlaybookCardAction(formData: FormData) {
  const parsed = playbookCardSchema.parse({
    id: (formData.get("id") as string) || undefined,
    squadId: formData.get("squadId"),
    mapId: formData.get("mapId"),
    siteId: formData.get("siteId"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    preferredCompText: formData.get("preferredCompText"),
    assignedRolesText: formData.get("assignedRolesText"),
    checklistText: formData.get("checklistText"),
  });

  const data = {
    squadId: parsed.squadId,
    mapId: parsed.mapId,
    siteId: parsed.siteId,
    title: parsed.title,
    summary: parsed.summary,
    preferredComp: parseCsv(parsed.preferredCompText),
    assignedRoles: parseJsonText(parsed.assignedRolesText, []),
    checklist: parseLines(parsed.checklistText),
  };

  if (parsed.id) {
    await prisma.playbookCard.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    await prisma.playbookCard.create({ data });
  }

  revalidatePlaybookPaths(parsed.squadId);
}

export async function deletePlaybookCardAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const squadId = String(formData.get("squadId") ?? "");

  if (!id || !squadId) {
    throw new Error("Playbook card id and squad id are required.");
  }

  await prisma.playbookCard.delete({
    where: { id },
  });

  revalidatePlaybookPaths(squadId);
}

export async function saveNoteAction(formData: FormData) {
  const user = await getCurrentUserWithFallback();

  if (!user) {
    throw new Error("Demo user not found.");
  }

  const parsed = savedNoteSchema.parse({
    id: (formData.get("id") as string) || undefined,
    squadId: (formData.get("squadId") as string) || undefined,
    mapId: formData.get("mapId"),
    siteId: formData.get("siteId"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  const data = {
    userId: user.id,
    squadId: parsed.squadId || null,
    mapId: parsed.mapId,
    siteId: parsed.siteId,
    title: parsed.title,
    body: parsed.body,
  };

  if (parsed.id) {
    await prisma.savedNote.update({
      where: { id: parsed.id },
      data,
    });
  } else {
    await prisma.savedNote.create({ data });
  }

  revalidatePlaybookPaths(parsed.squadId);
}

export async function deleteNoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const squadId = String(formData.get("squadId") ?? "");

  if (!id) {
    throw new Error("Note id is required.");
  }

  await prisma.savedNote.delete({
    where: { id },
  });

  revalidatePlaybookPaths(squadId || undefined);
}
