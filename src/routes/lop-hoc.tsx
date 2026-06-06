import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn, Select, Input } from "@/components/ui-bits";
import { lopHoc, coSo } from "@/lib/mock-data";

export const Route = createFileRoute("/lop-hoc")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select><option>Tất cả cơ sở</option>{coSo.map(c => <option key={c}>{c}</option>)}</Select>
        <Input placeholder="Tìm lớp..." />
        <div className="flex-1" />
        <Btn>+ Thêm lớp</Btn>
      </PageToolbar>
      <DataTable
        headers={["Mã lớp", "Tên lớp", "Cơ sở", "GV phụ trách", "Sĩ số", "Lịch học", "Trạng thái", "Thao tác"]}
        rows={lopHoc.map(l => [
          l.ma, <span className="font-medium">{l.ten}</span>, l.coSo, l.gv, l.soHs, l.lich,
          <Badge tone="success">{l.trangThai}</Badge>,
          <div className="flex gap-1"><Btn variant="ghost">Sửa</Btn><Btn variant="ghost">Xem</Btn></div>,
        ])}
      />
    </div>
  );
}
