import { createFileRoute } from "@tanstack/react-router";
import { DataTable, Badge, PageToolbar, Btn } from "@/components/ui-bits";
import { dichVu, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/dich-vu")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <div className="flex-1" />
        <Btn>+ Thêm dịch vụ</Btn>
      </PageToolbar>
      <DataTable
        headers={["Mã DV", "Tên dịch vụ", "Kiểu tính", "Đơn giá", "Tính vào phiếu phí", "GV ghi nhận", "Trạng thái", "Thao tác"]}
        rows={dichVu.map(d => [
          d.ma, <span className="font-medium">{d.ten}</span>, d.kieu, formatVnd(d.gia),
          d.tinhPhi ? <Badge tone="success">Có</Badge> : <Badge>Không</Badge>,
          d.gvGhiNhan ? <Badge tone="info">Cho phép</Badge> : <Badge>Không</Badge>,
          <Badge tone="success">{d.trangThai}</Badge>,
          <div className="flex gap-1"><Btn variant="ghost">Sửa</Btn><Btn variant="ghost">Ngưng</Btn></div>,
        ])}
      />
    </div>
  );
}
