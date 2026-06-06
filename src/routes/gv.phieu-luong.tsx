import { createFileRoute } from "@tanstack/react-router";
import { Card, Btn } from "@/components/ui-bits";
import { phieuLuong, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/gv/phieu-luong")({ component: Page });

function Page() {
  const p = phieuLuong.find(x => x.gv === "Cô Lý")!;
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="text-center border-b pb-3 mb-4">
          <div className="font-bold text-lg">PHIẾU LƯƠNG THÁNG {p.thang}</div>
          <div className="text-sm text-muted-foreground">Trường Mầm Non Hoa Hồng</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div><b>Giáo viên:</b> {p.gv}</div>
          <div><b>Tháng:</b> {p.thang}</div>
        </div>
        <table className="w-full text-sm border">
          <tbody>
            <tr className="border-b"><td className="p-2">Số công tự động</td><td className="p-2 text-right">{p.congTd}</td></tr>
            <tr className="border-b"><td className="p-2">Công điều chỉnh</td><td className="p-2 text-right">{p.congDc > 0 ? `+${p.congDc}` : p.congDc}</td></tr>
            <tr className="border-b font-semibold bg-secondary/50"><td className="p-2">Tổng công</td><td className="p-2 text-right">{p.tong}</td></tr>
            <tr className="border-b"><td className="p-2">Lương cơ bản</td><td className="p-2 text-right">{formatVnd(p.luongCb)}</td></tr>
            <tr className="border-b"><td className="p-2">Phụ cấp</td><td className="p-2 text-right">{formatVnd(p.phuCap)}</td></tr>
            <tr className="border-b"><td className="p-2">Tạm ứng</td><td className="p-2 text-right text-destructive">- {formatVnd(p.tamUng)}</td></tr>
            <tr className="border-b"><td className="p-2">Khoản trừ</td><td className="p-2 text-right text-destructive">- {formatVnd(p.tru)}</td></tr>
            <tr className="font-bold bg-success/15 text-success"><td className="p-3">THỰC NHẬN</td><td className="p-3 text-right text-lg">{formatVnd(p.thucNhan)}</td></tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary">Tải PDF demo</Btn>
          <Btn>In phiếu</Btn>
        </div>
      </Card>
    </div>
  );
}
