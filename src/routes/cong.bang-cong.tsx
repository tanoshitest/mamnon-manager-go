import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select, Card } from "@/components/ui-bits";
import { bangCong } from "@/lib/mock-data";

export const Route = createFileRoute("/cong/bang-cong")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <Card><p className="text-sm">Bảng công được <b>tự động sinh</b> theo lịch học và phân công. Giáo viên không tự chấm công.</p></Card>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <Select><option>Tất cả giáo viên</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Tái tạo theo lịch</Btn>
      </PageToolbar>
      <DataTable
        headers={["Giáo viên", "Ngày", "Lớp", "Công tự động", "Điều chỉnh", "Tổng công", "Lý do", "Người sửa", "Thời gian"]}
        rows={bangCong.map(b => [
          <span className="font-medium">{b.gv}</span>, b.ngay, b.lop, b.congTd,
          <span className={b.dieuChinh !== 0 ? "font-semibold text-warning-foreground" : ""}>{b.dieuChinh > 0 ? `+${b.dieuChinh}` : b.dieuChinh}</span>,
          <span className="font-semibold">{b.tong}</span>,
          <span className="text-muted-foreground">{b.lyDo || "—"}</span>, b.nguoiSua || "—", b.thoiGian || "—",
        ])}
      />
    </div>
  );
}
