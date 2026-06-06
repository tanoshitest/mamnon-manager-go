import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn, Select } from "@/components/ui-bits";
import { phieuThu, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/phieu-thu/danh-sach")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <Select><option>Tất cả hình thức</option><option>Tiền mặt</option><option>Chuyển khoản</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Xuất Excel</Btn>
      </PageToolbar>
      <DataTable
        headers={["Số phiếu", "Ngày", "Học sinh", "Lớp", "Người nộp", "Nội dung", "Phải thu", "Thực thu", "Hình thức", "Người thu", "Trạng thái", "Thao tác"]}
        rows={phieuThu.map(p => [
          <span className="font-mono font-medium">{p.so}</span>, p.ngay, p.hs, p.lop, p.nguoiNop, p.noiDung,
          formatVnd(p.phaiThu), <span className="font-semibold">{formatVnd(p.thucThu)}</span>,
          <Badge tone="info">{p.hinhThuc}</Badge>, p.nguoiThu,
          <Badge tone="success">{p.trangThai}</Badge>,
          <div className="flex gap-1"><Btn variant="ghost">In</Btn><Btn variant="danger">Hủy</Btn></div>,
        ])}
      />
    </div>
  );
}
