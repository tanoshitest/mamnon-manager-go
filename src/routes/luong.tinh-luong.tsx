import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select, Card } from "@/components/ui-bits";
import { phieuLuong, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/luong/tinh-luong")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm"><b>Công thức:</b> Thực nhận = Lương cơ bản / Công chuẩn × Số công thực tế + Phụ cấp + Dạy thay + Tăng ca − Tạm ứng − Khoản trừ</p>
      </Card>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Tính lại</Btn>
        <Btn variant="success">Chốt lương</Btn>
      </PageToolbar>
      <DataTable
        headers={["Giáo viên", "Công tự động", "Điều chỉnh", "Tổng công", "Lương cơ bản", "Phụ cấp", "Tạm ứng", "Trừ", "Thực nhận"]}
        rows={phieuLuong.map(p => [
          <span className="font-medium">{p.gv}</span>, p.congTd,
          <span className={p.congDc !== 0 ? "text-warning-foreground" : ""}>{p.congDc > 0 ? `+${p.congDc}` : p.congDc}</span>,
          <span className="font-semibold">{p.tong}</span>,
          formatVnd(p.luongCb), formatVnd(p.phuCap), formatVnd(p.tamUng), formatVnd(p.tru),
          <span className="font-bold text-success">{formatVnd(p.thucNhan)}</span>,
        ])}
      />
    </div>
  );
}
