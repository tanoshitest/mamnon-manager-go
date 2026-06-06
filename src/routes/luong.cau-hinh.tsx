import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn } from "@/components/ui-bits";
import { giaoVien, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/luong/cau-hinh")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar><div className="flex-1" /><Btn>Lưu thay đổi</Btn></PageToolbar>
      <DataTable
        headers={["Giáo viên", "Lương cơ bản", "Công chuẩn", "Đơn giá/công", "Phụ cấp", "Tạm ứng", "Khoản trừ"]}
        rows={giaoVien.map(g => [
          <span className="font-medium">{g.ten}</span>,
          formatVnd(g.luongCb), g.congChuan,
          formatVnd(Math.round(g.luongCb / g.congChuan)),
          formatVnd(500000), formatVnd(0), formatVnd(0),
        ])}
      />
    </div>
  );
}
