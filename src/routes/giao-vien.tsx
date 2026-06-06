import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Input } from "@/components/ui-bits";
import { giaoVien, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/giao-vien")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Input placeholder="Tìm giáo viên..." />
        <div className="flex-1" />
        <Btn>+ Thêm giáo viên</Btn>
      </PageToolbar>
      <DataTable
        headers={["Mã GV", "Họ tên", "Lớp phụ trách", "SĐT", "Lương cơ bản", "Công chuẩn", "Thao tác"]}
        rows={giaoVien.map(g => [
          g.ma, <span className="font-medium">{g.ten}</span>, g.lop, g.sdt, formatVnd(g.luongCb), g.congChuan,
          <div className="flex gap-1"><Btn variant="ghost">Sửa</Btn><Btn variant="ghost">Xem công</Btn></div>,
        ])}
      />
    </div>
  );
}
