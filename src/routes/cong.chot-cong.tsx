import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select, Card, Badge } from "@/components/ui-bits";
import { giaoVien } from "@/lib/mock-data";

export const Route = createFileRoute("/cong/chot-cong")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <div className="flex-1" />
        <Btn variant="success">Chốt công tháng</Btn>
      </PageToolbar>
      <Card><p className="text-sm">Sau khi chốt, bảng công sẽ <b>khóa</b> và làm cơ sở để tính lương. Cần Admin mở khóa nếu muốn sửa.</p></Card>
      <DataTable
        headers={["Giáo viên", "Lớp", "Công tự động", "Điều chỉnh", "Tổng công", "Trạng thái"]}
        rows={giaoVien.map((g, i) => [
          <span className="font-medium">{g.ten}</span>, g.lop, [24, 25, 26, 25, 26][i], [0, -1, 2, 0, 1][i],
          <span className="font-semibold">{[24, 24, 28, 25, 27][i]}</span>,
          i < 3 ? <Badge tone="success">Đã chốt</Badge> : <Badge tone="warning">Chưa chốt</Badge>,
        ])}
      />
    </div>
  );
}
