import { createFileRoute } from "@tanstack/react-router";
import { WorkdayReport } from "./bao-cao";

export const Route = createFileRoute("/bao-cao/cham-cong")({ component: Page });

function Page() {
  return (
    <div className="h-full">
      <WorkdayReport />
    </div>
  );
}
