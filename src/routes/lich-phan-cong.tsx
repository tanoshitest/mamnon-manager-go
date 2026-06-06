import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Badge } from "@/components/ui-bits";
import { lichPhanCong } from "@/lib/mock-data";

export const Route = createFileRoute("/lich-phan-cong")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <div className="flex-1" />
        <Btn variant="secondary">Sao chép từ tuần trước</Btn>
        <Btn>+ Thêm phân công</Btn>
      </PageToolbar>
      <DataTable
        headers={["Lớp", "Giáo viên phụ trách", "Ngày học trong tuần", "Công/ngày", "Tính công CN", "Thao tác"]}
        rows={lichPhanCong.map(l => [
          <span className="font-medium">{l.lop}</span>, l.gv, l.ngayHoc, l.congNgay,
          l.cnhat ? <Badge tone="info">Có</Badge> : <Badge>Không</Badge>,
          <div className="flex gap-1"><Btn variant="ghost">Sửa</Btn><Btn variant="ghost">Dạy thay</Btn></div>,
        ])}
      />
    </div>
  );
}
