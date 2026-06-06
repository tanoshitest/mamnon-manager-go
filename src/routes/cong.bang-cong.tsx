import { createFileRoute } from "@tanstack/react-router";
import { Badge, Btn, Card, DataTable, PageToolbar, Select } from "@/components/ui-bits";
import { bangCong } from "@/lib/mock-data";

export const Route = createFileRoute("/cong/bang-cong")({ component: Page });

type WorkStatus =
  | "Ngày nghỉ"
  | "Vắng sáng"
  | "Vắng chiều"
  | "Vắng ăn chiều"
  | "Ngày làm bình thường"
  | "Ngày làm chủ nhật";

const attendanceRows = [
  { ...bangCong[0], trangThai: "Ngày làm bình thường" as WorkStatus, cong: 1, lichTruc: "6h15 sáng", ghiChu: "Đi làm đủ ngày, có lịch trực mở lớp" },
  { ...bangCong[1], trangThai: "Ngày nghỉ" as WorkStatus, cong: 0, lichTruc: "-", ghiChu: "Nghỉ ốm có phép" },
  { ...bangCong[2], trangThai: "Vắng sáng" as WorkStatus, cong: 0.5, lichTruc: "-", ghiChu: "Có mặt buổi chiều" },
  { ...bangCong[3], trangThai: "Vắng chiều" as WorkStatus, cong: 0.5, lichTruc: "6h15 sáng", ghiChu: "Có mặt buổi sáng" },
  { ...bangCong[4], trangThai: "Vắng ăn chiều" as WorkStatus, cong: 1, lichTruc: "-", ghiChu: "Không phụ trách suất ăn chiều" },
  { gv: "Cô Mai", ngay: "2026-06-07", lop: "Lớp Nhà Trẻ HHD1", trangThai: "Ngày làm chủ nhật" as WorkStatus, cong: 1, lichTruc: "6h15 sáng", ghiChu: "Làm Chủ Nhật theo phân công" },
  { gv: "Cô Lý", ngay: "2026-06-08", lop: "Lớp Chồi HHD1", trangThai: "Ngày làm bình thường" as WorkStatus, cong: 1, lichTruc: "-", ghiChu: "Đi làm bình thường" },
];

function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm">
          Bảng chấm công ghi nhận đủ các trường hợp: ngày nghỉ, vắng sáng, vắng chiều, vắng ăn chiều, ngày làm bình thường,
          ngày làm Chủ Nhật và lịch trực 6h15 sáng.
        </p>
      </Card>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
        <Select><option>Tất cả giáo viên</option></Select>
        <div className="flex-1" />
        <Btn variant="secondary">Tái tạo theo lịch</Btn>
      </PageToolbar>
      <DataTable
        headers={["Giáo viên", "Ngày", "Lớp", "Trạng thái chấm công", "Số công", "Lịch trực", "Ghi chú"]}
        rows={attendanceRows.map((row) => [
          <span className="font-medium">{row.gv}</span>,
          row.ngay,
          row.lop,
          <AttendanceBadge status={row.trangThai} />,
          <span className="font-semibold">{row.cong}</span>,
          row.lichTruc,
          <span className="text-muted-foreground">{row.ghiChu}</span>,
        ])}
      />
    </div>
  );
}

function AttendanceBadge({ status }: { status: WorkStatus }) {
  const tone =
    status === "Ngày nghỉ"
      ? "danger"
      : status === "Ngày làm bình thường" || status === "Ngày làm chủ nhật"
        ? "success"
        : "warning";

  return <Badge tone={tone}>{status}</Badge>;
}
