import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageToolbar, Btn, Select } from "@/components/ui-bits";
import { diemDanhHomNay, lopHoc } from "@/lib/mock-data";

export const Route = createFileRoute("/diem-danh")({ component: Page });

function Page() {
  return (
    <div>
      <PageToolbar>
        <Select>{lopHoc.map(l => <option key={l.ma}>{l.ten}</option>)}</Select>
        <input type="date" defaultValue="2026-06-06" className="text-sm border rounded-md px-2 py-1.5 bg-background" />
        <div className="flex-1" />
        <Btn variant="secondary">Đánh dấu tất cả có mặt</Btn>
        <Btn variant="secondary">Sao chép từ hôm qua</Btn>
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
          <input defaultValue={d.ghiChu} placeholder="Ghi chú..." className="border rounded px-2 py-1 text-sm w-full" />,
        ])}
      />
    </div>
  );
}
