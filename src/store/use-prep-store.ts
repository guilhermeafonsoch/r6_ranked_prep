"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { RecentPlan } from "@/lib/types";

type PrepStore = {
  recentPlans: RecentPlan[];
  addRecentPlan: (plan: RecentPlan) => void;
};

export const usePrepStore = create<PrepStore>()(
  persist(
    (set, get) => ({
      recentPlans: [],
      addRecentPlan: (plan) => {
        const next = [
          plan,
          ...get().recentPlans.filter(
            (item) =>
              !(
                item.mapSlug === plan.mapSlug &&
                item.siteSlug === plan.siteSlug &&
                item.side === plan.side
              ),
          ),
        ].slice(0, 6);

        set({
          recentPlans: next,
        });
      },
    }),
    {
      name: "ranked-prep-recent-plans",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
