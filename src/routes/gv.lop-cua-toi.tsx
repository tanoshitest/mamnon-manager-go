import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Card, Badge } from "@/components/ui-bits";
import { hocSinh } from "@/lib/mock-data";

export const Route = createFileRoute("/gv/lop-cua-toi")({ component: Page });

function Page() {
  const myClass = "Lớp Chồi HHD1";
  const students = hocSinh.filter(h => h.lop === myClass);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Lớp phụ trách</div>
            <h2 className="text-xl font-bold">{myClass}</h2>
          </div>
          <div className="text-right"><div className="text-xs text-muted-foreground">Sĩ số</div><div className="text-2xl font-bold">{students.length}</div></div>
        </div>
      </Card>
      <DataTable
        headers={["Mã", "Họ tên bé", "Ngày sinh", "Phụ huynh", "SĐT", "Trạng thái", "Dịch vụ", "Ghi chú"]}
        rows={students.map(h => [
          h.ma, <span className="font-medium">{h.ten}</span>, h.ns, h.ph, h.sdt,
          <Badge tone="success">{h.trangThai}</Badge>, h.dv, h.ghiChu,
        ])}
      />
    </div>
  );
}
