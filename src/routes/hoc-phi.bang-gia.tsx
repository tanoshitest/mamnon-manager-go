import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Card } from "@/components/ui-bits";
import { formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-phi/bang-gia")({ component: Page });

const bangGia = [
  { lop: "Lớp Nhà Trẻ HHD1", hocPhi: 2300000, an: 15000, phu: 50000 },
  { lop: "Lớp Chồi HHD1", hocPhi: 2500000, an: 15000, phu: 50000 },
  { lop: "Lớp Mầm HHD2", hocPhi: 2800000, an: 15000, phu: 50000 },
  { lop: "Lớp Lá HHD2", hocPhi: 3000000, an: 15000, phu: 50000 },
  { lop: "Lớp Bán Trú", hocPhi: 2700000, an: 15000, phu: 50000 },
];

function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-muted-foreground">Cấu hình mức học phí, tiền ăn, phụ phí cho từng lớp. Áp dụng khi tạo phiếu báo học phí.</p>
      </Card>
      <PageToolbar>
        <div className="flex-1" />
        <Btn>Lưu thay đổi</Btn>
      </PageToolbar>
      <DataTable
        headers={["Lớp", "Học phí/tháng", "Tiền ăn/ngày", "Phụ phí/tháng", "Thao tác"]}
        rows={bangGia.map(b => [
          <span className="font-medium">{b.lop}</span>,
          formatVnd(b.hocPhi), formatVnd(b.an), formatVnd(b.phu),
          <Btn variant="ghost">Sửa</Btn>,
        ])}
      />
    </div>
  );
}
