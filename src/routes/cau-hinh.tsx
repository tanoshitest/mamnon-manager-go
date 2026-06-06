import { createFileRoute } from "@tanstack/react-router";
import { Card, Btn, Input } from "@/components/ui-bits";

export const Route = createFileRoute("/cau-hinh")({ component: Page });

function Page() {
  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <h3 className="font-semibold mb-4">Thông tin trường</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tên trường" full><Input defaultValue="Trường Mầm Non Hoa Hồng" /></Field>
          <Field label="Cơ sở chính"><Input defaultValue="HHD1 - 123 Lê Lợi" /></Field>
          <Field label="Cơ sở 2"><Input defaultValue="HHD2 - 456 Trần Hưng Đạo" /></Field>
          <Field label="Hotline"><Input defaultValue="0909 123 456" /></Field>
          <Field label="Email"><Input defaultValue="info@mamnonhoahong.vn" /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4">Thông tin chuyển khoản</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ngân hàng"><Input defaultValue="Vietcombank" /></Field>
          <Field label="Số tài khoản"><Input defaultValue="0123456789" /></Field>
          <Field label="Chủ tài khoản" full><Input defaultValue="TRUONG MAM NON HOA HONG" /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4">Quy tắc công</h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Tự động sinh công theo lịch học</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Tính công Chủ nhật mặc định</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Bắt buộc lý do khi điều chỉnh công</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Cho phép giáo viên xem phiếu lương cá nhân</label>
        </div>
      </Card>

      <div className="flex justify-end"><Btn>Lưu cấu hình</Btn></div>
    </div>
  );
}

function Field({ label, children, full }: any) {
  return <div className={full ? "col-span-2" : ""}><label className="text-xs text-muted-foreground block mb-1">{label}</label>{children}</div>;
}
