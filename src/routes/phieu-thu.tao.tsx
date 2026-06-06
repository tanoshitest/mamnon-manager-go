import { createFileRoute } from "@tanstack/react-router";
import { Card, Btn, Select, Input } from "@/components/ui-bits";
import { hocSinh, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/phieu-thu/tao")({ component: Page });

function Page() {
  return (
    <div className="max-w-3xl">
      <Card>
        <h3 className="font-semibold mb-4">Tạo phiếu thu mới</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Số phiếu"><Input value="PT000005" readOnly /></Field>
          <Field label="Ngày thu"><Input type="date" defaultValue="2026-06-06" /></Field>
          <Field label="Học sinh"><Select>{hocSinh.map(h => <option key={h.ma}>{h.ten} — {h.lop}</option>)}</Select></Field>
          <Field label="Người nộp"><Input defaultValue="Nguyễn Văn A" /></Field>
          <Field label="Nội dung thu" full><Input defaultValue="Học phí tháng 06/2026" /></Field>
          <Field label="Số tiền phải thu"><Input defaultValue={formatVnd(2900000)} /></Field>
          <Field label="Số tiền thực thu"><Input defaultValue={formatVnd(2900000)} /></Field>
          <Field label="Hình thức"><Select><option>Tiền mặt</option><option>Chuyển khoản</option></Select></Field>
          <Field label="Người thu"><Input defaultValue="Admin" /></Field>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <Btn variant="secondary">Hủy</Btn>
          <Btn variant="secondary">Lưu & In</Btn>
          <Btn>Lưu phiếu thu</Btn>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children, full }: any) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      {children}
    </div>
  );
}
