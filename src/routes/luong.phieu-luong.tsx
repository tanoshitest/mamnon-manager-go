import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select } from "@/components/ui-bits";
import { phieuLuong, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/luong/phieu-luong")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">In phiếu lương</Btn>
        <Btn variant="secondary">Gửi Zalo demo</Btn>
      </PageToolbar>
      <DataTable
        headers={["Giáo viên", "Tháng", "Tổng công", "Lương cơ bản", "Phụ cấp", "Tạm ứng", "Trừ", "Thực nhận", "Thao tác"]}
        rows={phieuLuong.map(p => [
          <span className="font-medium">{p.gv}</span>, p.thang, p.tong,
          formatVnd(p.luongCb), formatVnd(p.phuCap), formatVnd(p.tamUng), formatVnd(p.tru),
          <span className="font-bold text-success">{formatVnd(p.thucNhan)}</span>,
          <Btn variant="ghost">In</Btn>,
        ])}
      />
    </div>
  );
}
