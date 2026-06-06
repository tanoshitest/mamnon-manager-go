import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, Card } from "@/components/ui-bits";
import { phieuThuHuy, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/phieu-thu/da-huy")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <Card><p className="text-sm text-muted-foreground">Phiếu thu đã hủy được lưu lại để kiểm tra. Không thể xóa khỏi hệ thống.</p></Card>
      <DataTable
        headers={["Số phiếu", "Ngày tạo", "Học sinh", "Lớp", "Số tiền", "Lý do hủy", "Người hủy", "Thời gian hủy", "Trạng thái"]}
        rows={phieuThuHuy.map(p => [
          <span className="font-mono">{p.so}</span>, p.ngay, p.hs, p.lop, formatVnd(p.thucThu),
          <span className="text-destructive">{p.lyDoHuy}</span>, p.nguoiHuy, p.thoiGianHuy,
          <Badge tone="danger">Đã hủy</Badge>,
        ])}
      />
    </div>
  );
}
