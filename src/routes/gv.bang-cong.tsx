import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, DataTable, PageToolbar, Select } from "@/components/ui-bits";

export const Route = createFileRoute("/gv/bang-cong")({ component: Page });

const myWorkdays = [
  { ngay: "2026-06-01", lop: "Lớp Chồi HHD1", trangThai: "Ngày nghỉ", cong: 0, lichTruc: "-", ghiChu: "Nghỉ ốm có phép" },
  { ngay: "2026-06-02", lop: "Lớp Chồi HHD1", trangThai: "Vắng sáng", cong: 0.5, lichTruc: "-", ghiChu: "Có mặt buổi chiều" },
  { ngay: "2026-06-03", lop: "Lớp Chồi HHD1", trangThai: "Vắng chiều", cong: 0.5, lichTruc: "6h15 sáng", ghiChu: "Có mặt buổi sáng" },
  { ngay: "2026-06-04", lop: "Lớp Chồi HHD1", trangThai: "Vắng ăn chiều", cong: 1, lichTruc: "-", ghiChu: "Không phụ trách ăn chiều" },
  { ngay: "2026-06-05", lop: "Lớp Chồi HHD1", trangThai: "Ngày làm bình thường", cong: 1, lichTruc: "6h15 sáng", ghiChu: "Đi làm đủ ngày" },
  { ngay: "2026-06-07", lop: "Lớp Chồi HHD1", trangThai: "Ngày làm chủ nhật", cong: 1, lichTruc: "6h15 sáng", ghiChu: "Trực lớp Chủ Nhật" },
];

function Page() {
  const tong = myWorkdays.reduce((sum, item) => sum + item.cong, 0);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Cô Lý · Tháng 06/2026</div>
            <h2 className="text-lg font-bold">Tổng công tháng: {tong}</h2>
          </div>
        </div>
      </Card>
      <PageToolbar>
        <Select><option>Tháng 06/2026</option></Select>
      </PageToolbar>
      <DataTable
        headers={["Ngày", "Lớp", "Trạng thái chấm công", "Số công", "Lịch trực", "Ghi chú"]}
        rows={myWorkdays.map((item) => [
          item.ngay,
          item.lop,
          <AttendanceBadge status={item.trangThai} />,
          <span className="font-semibold">{item.cong}</span>,
          item.lichTruc,
          <span className="text-muted-foreground">{item.ghiChu}</span>,
        ])}
      />
    </div>
  );
}

function AttendanceBadge({ status }: { status: string }) {
  const tone =
    status === "Ngày nghỉ"
      ? "danger"
      : status === "Ngày làm bình thường" || status === "Ngày làm chủ nhật"
        ? "success"
        : "warning";

  return <Badge tone={tone}>{status}</Badge>;
}
