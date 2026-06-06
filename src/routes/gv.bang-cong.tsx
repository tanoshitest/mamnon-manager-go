import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Card, Select, PageToolbar } from "@/components/ui-bits";
import { bangCong } from "@/lib/mock-data";

export const Route = createFileRoute("/gv/bang-cong")({ component: Page });

function Page() {
  const mine = bangCong.filter(b => b.gv === "Cô Lý");
  const tong = mine.reduce((s, x) => s + x.tong, 0);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div><div className="text-xs text-muted-foreground">Cô Lý · Tháng 06/2026</div><h2 className="text-lg font-bold">Tổng công tháng: {tong}</h2></div>
        </div>
      </Card>
      <PageToolbar><Select><option>Tháng 06/2026</option></Select></PageToolbar>
      <DataTable
        headers={["Ngày", "Lớp", "Công tự động", "Điều chỉnh", "Tổng", "Lý do"]}
        rows={mine.map(b => [
          b.ngay, b.lop, b.congTd,
          <span className={b.dieuChinh !== 0 ? "text-warning-foreground font-semibold" : ""}>{b.dieuChinh > 0 ? `+${b.dieuChinh}` : b.dieuChinh}</span>,
          <span className="font-semibold">{b.tong}</span>,
          <span className="text-muted-foreground">{b.lyDo || "—"}</span>,
        ])}
      />
    </div>
  );
}
