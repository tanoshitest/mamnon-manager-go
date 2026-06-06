import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui-bits";

export const Route = createFileRoute("/gv/lich-day")({ component: Page });

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const schedule: Record<string, string> = {
  "Thứ 2": "Lớp Chồi HHD1", "Thứ 3": "Lớp Chồi HHD1", "Thứ 4": "Lớp Chồi HHD1",
  "Thứ 5": "Lớp Chồi HHD1", "Thứ 6": "Lớp Chồi HHD1",
};

function Page() {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Lịch dạy tuần này · Cô Lý</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div key={d} className={`border rounded-lg p-3 ${schedule[d] ? "bg-primary/10 border-primary/40" : "bg-secondary/40"}`}>
            <div className="text-xs font-semibold text-muted-foreground">{d}</div>
            <div className="mt-2 text-sm font-medium">{schedule[d] || "Nghỉ"}</div>
            {schedule[d] && <div className="text-xs text-muted-foreground mt-1">7:30 - 17:00</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}
