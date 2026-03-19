import { EmptyState } from "@/components/states/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Route not found"
      description="This tactical board or admin screen does not exist."
      hint="Check the map, site, or resource identifier in the URL."
    />
  );
}
