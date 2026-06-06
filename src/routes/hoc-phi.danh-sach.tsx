import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn, Select, Card } from "@/components/ui-bits";
import { phieuBaoPhi, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-phi/danh-sach")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <Select><option>Tất cả trạng thái</option><option>Đã thu</option><option>Còn nợ</option><option>Chưa thu</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Xuất PDF demo</Btn>
      </PageToolbar>
      <DataTable
        headers={["Mã phiếu", "Học sinh", "Lớp", "Tổng phải thu", "Đã thu", "Còn nợ", "Trạng thái", "Thao tác"]}
        rows={phieuBaoPhi.map(p => [
          p.ma, <span className="font-medium">{p.hs}</span>, p.lop,
          formatVnd(p.tong), formatVnd(p.daThu), formatVnd(p.tong - p.daThu),
          <Badge tone={p.trangThai === "Đã thu" ? "success" : p.trangThai === "Còn nợ" ? "warning" : "danger"}>{p.trangThai}</Badge>,
          <div className="flex gap-1"><Btn variant="ghost">Xem</Btn><Btn variant="ghost">In</Btn></div>,
        ])}
      />

      <Card>
        <h3 className="font-semibold mb-3">Mẫu phiếu báo học phí (demo)</h3>
        <div className="border-2 border-dashed rounded-lg p-6 bg-secondary/30 max-w-2xl">
          <div className="text-center border-b pb-3 mb-3">
            <div className="font-bold text-lg">TRƯỜNG MẦM NON HOA HỒNG</div>
            <div className="text-sm text-muted-foreground">PHIẾU BÁO HỌC PHÍ THÁNG 06/2026</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div><b>Bé:</b> Nguyễn An</div>
            <div><b>Lớp:</b> Lớp Chồi HHD1</div>
          </div>
          <table className="w-full text-sm border">
            <tbody>
              <tr className="border-b"><td className="p-2">Học phí tháng</td><td className="p-2 text-right">{formatVnd(2500000)}</td></tr>
              <tr className="border-b"><td className="p-2">Tiền ăn (22 ngày)</td><td className="p-2 text-right">{formatVnd(330000)}</td></tr>
              <tr className="border-b"><td className="p-2">Phụ phí</td><td className="p-2 text-right">{formatVnd(50000)}</td></tr>
              <tr className="border-b"><td className="p-2">Dịch vụ: Camera, Ăn chiều</td><td className="p-2 text-right">{formatVnd(50000)}</td></tr>
              <tr className="border-b"><td className="p-2">Trừ ngày nghỉ (2 ngày)</td><td className="p-2 text-right text-success">- {formatVnd(30000)}</td></tr>
              <tr className="font-bold bg-secondary"><td className="p-2">TỔNG PHẢI THU</td><td className="p-2 text-right">{formatVnd(2900000)}</td></tr>
            </tbody>
          </table>
          <div className="mt-3 text-xs text-muted-foreground">
            <div>Chuyển khoản: <b>VCB · 0123456789 · TRUONG MAM NON HOA HONG</b></div>
            <div className="mt-1">Nội dung CK: <b>HP T6 - Nguyễn An - Lớp Chồi HHD1</b></div>
            <div className="mt-2 inline-block bg-foreground/10 px-3 py-2 rounded">[ QR Code Demo ]</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
