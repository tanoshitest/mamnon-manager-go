import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Card } from "@/components/ui-bits";
import { diemDanhHomNay } from "@/lib/mock-data";

export const Route = createFileRoute("/gv/diem-danh")({ component: Page });

function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Lớp · Ngày</div>
            <h2 className="text-lg font-bold">Lớp Chồi HHD1 · 06/06/2026</h2>
          </div>
        </div>
      </Card>
      <PageToolbar>
        <Btn variant="secondary">Đánh dấu tất cả có mặt</Btn>
        <Btn variant="secondary">Sao chép từ hôm qua</Btn>
        <div className="flex-1" />
        <Btn>Lưu điểm danh</Btn>
      </PageToolbar>
      <DataTable
        headers={["Họ tên bé", "Có mặt", "Vắng có phép", "Vắng không phép", "Ăn chiều", "Giữ ngoài giờ", "Học CN", "Ghi chú"]}
        rows={diemDanhHomNay.map(d => [
          <span className="font-medium">{d.hs}</span>,
          <input type="checkbox" defaultChecked={d.coMat} />,
          <input type="checkbox" defaultChecked={d.vangPhep} />,
          <input type="checkbox" defaultChecked={d.vangKhong} />,
          <input type="checkbox" defaultChecked={d.anChieu} />,
          <input type="checkbox" defaultChecked={d.ngoaiGio} />,
          <input type="checkbox" defaultChecked={d.cnhat} />,
          <input defaultValue={d.ghiChu} placeholder="Ghi chú tình trạng bé..." className="border rounded px-2 py-1 text-sm w-full" />,
        ])}
      />
    </div>
  );
}
