import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, Input, Select } from "@/components/ui-bits";

export const Route = createFileRoute("/cong/dieu-chinh")({ component: Page });

const workStatuses = [
  { label: "Ngày nghỉ", cong: "0" },
  { label: "Vắng sáng", cong: "0.5" },
  { label: "Vắng chiều", cong: "0.5" },
  { label: "Vắng ăn chiều", cong: "1" },
  { label: "Ngày làm bình thường", cong: "1" },
  { label: "Ngày làm chủ nhật", cong: "1" },
];

function Page() {
  return (
    <div className="max-w-3xl">
      <Card>
        <h3 className="mb-4 font-semibold">Điều chỉnh chấm công giáo viên</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Giáo viên">
            <Select>
              <option>Cô Lý</option>
              <option>Cô Mai</option>
              <option>Cô Hạnh</option>
            </Select>
          </Field>
          <Field label="Ngày">
            <Input type="date" defaultValue="2026-06-06" />
          </Field>
          <Field label="Trạng thái chấm công">
            <Select>
              {workStatuses.map((status) => (
                <option key={status.label}>{status.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Số công">
            <Select>
              {workStatuses.map((status) => (
                <option key={status.label} value={status.cong}>
                  {status.cong}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lịch trực">
            <Select>
              <option>Không trực</option>
              <option>6h15 sáng</option>
            </Select>
          </Field>
          <Field label="Buổi ảnh hưởng">
            <Select>
              <option>Cả ngày</option>
              <option>Buổi sáng</option>
              <option>Buổi chiều</option>
              <option>Ăn chiều</option>
              <option>Chủ nhật</option>
            </Select>
          </Field>
          <Field label="Ghi chú" full>
            <Input placeholder="VD: Nghỉ ốm có phép, vắng sáng, trực 6h15..." />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="secondary">Hủy</Btn>
          <Btn>Lưu chấm công</Btn>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          * Mọi điều chỉnh sẽ lưu lịch sử gồm người sửa, thời gian và ghi chú.
        </p>
      </Card>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
