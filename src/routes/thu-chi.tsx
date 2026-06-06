import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn, Select } from "@/components/ui-bits";
import { thuChi, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/thu-chi")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <Select><option>Tất cả loại</option><option>Thu</option><option>Chi</option></Select>
        <Select><option>Tất cả nhóm</option><option>Học phí</option><option>Lương</option><option>Thực phẩm</option><option>BHXH</option><option>Điện nước</option><option>Khác</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Xuất Excel</Btn>
        <Btn>+ Thêm khoản</Btn>
      </PageToolbar>
      <DataTable
        headers={["Ngày", "Loại", "Nhóm", "Nội dung", "Số tiền", "Người thực hiện", "Ghi chú", "Hóa đơn"]}
        rows={thuChi.map(t => [
          t.ngay,
          <Badge tone={t.loai === "Thu" ? "success" : "warning"}>{t.loai}</Badge>,
          t.nhom, t.noiDung,
          <span className={`font-semibold ${t.loai === "Thu" ? "text-success" : "text-destructive"}`}>{formatVnd(t.soTien)}</span>,
          t.nguoi, t.ghiChu,
          <Btn variant="ghost">Xem ảnh</Btn>,
        ])}
      />
    </div>
  );
}
