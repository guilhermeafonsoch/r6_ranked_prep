"use client";

import { ErrorState } from "@/components/states/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Something interrupted the prep flow"
      description={error.message || "An unexpected error happened while rendering the app."}
      reset={reset}
    />
  );
}
