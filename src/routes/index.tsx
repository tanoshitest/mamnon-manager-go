import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { StatCard, Card, DataTable, Badge } from "@/components/ui-bits";
import { formatVnd, hocSinh, lopHoc, giaoVien, phieuBaoPhi, thuChi, phieuLuong } from "@/lib/mock-data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { role } = useRole();
  if (role === "teacher") return <TeacherHome />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const tongPhaiThu = phieuBaoPhi.reduce((s, x) => s + x.tong, 0);
  const daThu = phieuBaoPhi.reduce((s, x) => s + x.daThu, 0);
  const conNo = tongPhaiThu - daThu;
  const tongChi = thuChi.filter(x => x.loai === "Chi").reduce((s, x) => s + x.soTien, 0);
  const luongDuKien = phieuLuong.reduce((s, x) => s + x.thucNhan, 0);
  const loiNhuan = daThu - tongChi - luongDuKien;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng học sinh" value={hocSinh.length} hint="Toàn trường" tone="info" />
        <StatCard label="Tổng lớp" value={lopHoc.length} tone="info" />
        <StatCard label="Tổng giáo viên" value={giaoVien.length} tone="info" />
        <StatCard label="HS có mặt hôm nay" value="78" tone="success" />
        <StatCard label="HS vắng hôm nay" value="9" tone="warning" />
        <StatCard label="Lớp chưa điểm danh" value="1" tone="danger" />
        <StatCard label="Học phí phải thu tháng" value={formatVnd(tongPhaiThu)} tone="default" />
        <StatCard label="Đã thu" value={formatVnd(daThu)} tone="success" />
        <StatCard label="Còn nợ" value={formatVnd(conNo)} tone="danger" />
        <StatCard label="Tổng chi tháng" value={formatVnd(tongChi)} tone="warning" />
        <StatCard label="Lương GV dự kiến" value={formatVnd(luongDuKien)} tone="info" />
        <StatCard label="Lợi nhuận tạm tính" value={formatVnd(loiNhuan)} tone={loiNhuan >= 0 ? "success" : "danger"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-3">Lớp học hôm nay</h3>
          <DataTable
            headers={["Lớp", "Giáo viên", "Sĩ số", "Trạng thái"]}
            rows={lopHoc.map(l => [l.ten, l.gv, l.soHs, <Badge tone="success">{l.trangThai}</Badge>])}
          />
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Thu chi gần đây</h3>
          <DataTable
            headers={["Ngày", "Loại", "Nội dung", "Số tiền"]}
            rows={thuChi.slice(0, 5).map(t => [
              t.ngay,
              <Badge tone={t.loai === "Thu" ? "success" : "warning"}>{t.loai}</Badge>,
              t.noiDung,
              formatVnd(t.soTien),
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

function TeacherHome() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-2">Chào Cô Lý 👋</h2>
      <p className="text-muted-foreground">Sử dụng menu bên trái để truy cập lớp của bạn, điểm danh, lịch dạy và phiếu lương.</p>
    </Card>
  );
}
