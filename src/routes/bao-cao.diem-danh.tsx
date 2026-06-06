import { createFileRoute } from "@tanstack/react-router";
import { AttendanceReport } from "./bao-cao";

export const Route = createFileRoute("/bao-cao/diem-danh")({ component: Page });

function Page() {
  return (
    <div className="h-full">
      <AttendanceReport />
    </div>
  );
}
