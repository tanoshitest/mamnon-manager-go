import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select, Card } from "@/components/ui-bits";
import { phieuBaoPhi, lopHoc, coSo, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-phi/tao-phieu")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold mb-3">Bước 1 · Chọn kỳ tính phí</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <Select><option>Tháng 06/2026</option><option>Tháng 05/2026</option></Select>
          <Select><option>Tất cả cơ sở</option>{coSo.map(c => <option key={c}>{c}</option>)}</Select>
          <Select><option>Tất cả lớp</option>{lopHoc.map(l => <option key={l.ma}>{l.ten}</option>)}</Select>
          <Btn>Tải dữ liệu</Btn>
        </div>
      </Card>

      <PageToolbar>
        <div className="flex-1" />
        <Btn variant="secondary">In phiếu theo lớp</Btn>
        <Btn variant="secondary">Xuất PDF demo</Btn>
        <Btn variant="secondary">Gửi Zalo demo</Btn>
        <Btn>Tạo phiếu báo học phí</Btn>
      </PageToolbar>

      <DataTable
        headers={["Học sinh", "Lớp", "Học phí", "Tiền ăn", "Phụ phí", "Dịch vụ", "Trừ nghỉ", "Nợ cũ", "Tổng phải thu", "Đã thu", "Còn nợ"]}
        rows={phieuBaoPhi.map(p => [
          <span className="font-medium">{p.hs}</span>, p.lop,
          formatVnd(p.hocPhi), formatVnd(p.an), formatVnd(p.phu), formatVnd(p.dv),
          formatVnd(p.tru), formatVnd(p.no),
          <span className="font-semibold">{formatVnd(p.tong)}</span>,
          formatVnd(p.daThu),
          <span className={p.tong - p.daThu > 0 ? "text-destructive font-semibold" : ""}>{formatVnd(p.tong - p.daThu)}</span>,
        ])}
      />
    </div>
  );
}
