import { createFileRoute } from "@tanstack/react-router";
import { Card, Btn, Select, Input } from "@/components/ui-bits";

export const Route = createFileRoute("/cong/dieu-chinh")({ component: Page });

function Page() {
  return (
    <div className="max-w-2xl">
      <Card>
        <h3 className="font-semibold mb-4">Điều chỉnh công giáo viên</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Giáo viên"><Select><option>Cô Lý</option><option>Cô Mai</option><option>Cô Hạnh</option></Select></Field>
          <Field label="Ngày"><Input type="date" defaultValue="2026-06-06" /></Field>
          <Field label="Loại điều chỉnh">
            <Select>
              <option>Nghỉ nguyên ngày</option>
              <option>Nghỉ nửa ngày</option>
              <option>Dạy thay</option>
              <option>Tăng ca</option>
              <option>Làm Chủ nhật</option>
              <option>Điều chỉnh khác</option>
            </Select>
          </Field>
          <Field label="Số công điều chỉnh"><Input defaultValue="-1" /></Field>
          <Field label="Lý do (bắt buộc)" full><Input placeholder="VD: Nghỉ ốm có giấy bác sĩ" /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Btn variant="secondary">Hủy</Btn>
          <Btn>Lưu điều chỉnh</Btn>
        </div>
        <p className="text-xs text-muted-foreground mt-4">* Mọi điều chỉnh sẽ lưu log: người sửa, thời gian, lý do.</p>
      </Card>
    </div>
  );
}

function Field({ label, children, full }: any) {
  return <div className={full ? "col-span-2" : ""}><label className="text-xs text-muted-foreground block mb-1">{label}</label>{children}</div>;
}
