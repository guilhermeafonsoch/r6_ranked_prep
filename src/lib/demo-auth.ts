import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  try {
    return await prisma.user.findFirst({
      where: {
        email: process.env.DEMO_USER_EMAIL ?? "captain@rankedprep.local",
      },
    });
  } catch {
    return null;
  }
}

export async function getCurrentUserWithFallback() {
  const selectedUser = await getCurrentUser();

  if (selectedUser) {
    return selectedUser;
  }

  try {
    return await prisma.user.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch {
    return null;
  }
}

export function isAdminEnabled() {
  return process.env.ENABLE_DEV_ADMIN !== "false";
}
