import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn, Select, Input } from "@/components/ui-bits";
import { hocSinh, lopHoc } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-sinh")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select><option>Tất cả lớp</option>{lopHoc.map(l => <option key={l.ma}>{l.ten}</option>)}</Select>
        <Select><option>Tất cả trạng thái</option><option>Đang học</option><option>Nghỉ</option><option>Bảo lưu</option></Select>
        <Input placeholder="Tìm học sinh..." />
        <div className="flex-1" />
        <Btn variant="secondary">Xuất Excel</Btn>
        <Btn>+ Thêm học sinh</Btn>
      </PageToolbar>
      <DataTable
        headers={["Mã HS", "Họ tên bé", "Lớp", "Ngày sinh", "Phụ huynh", "SĐT", "Trạng thái", "Gói", "Dịch vụ", "Ghi chú"]}
        rows={hocSinh.map(h => [
          h.ma, <span className="font-medium">{h.ten}</span>, h.lop, h.ns, h.ph, h.sdt,
          <Badge tone={h.trangThai === "Đang học" ? "success" : h.trangThai === "Bảo lưu" ? "warning" : "default"}>{h.trangThai}</Badge>,
          h.goi, h.dv, h.ghiChu,
        ])}
      />
    </div>
  );
}
