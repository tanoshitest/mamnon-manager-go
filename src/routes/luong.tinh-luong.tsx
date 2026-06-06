import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Badge, Btn, Card, DataTable, PageToolbar, Select } from "@/components/ui-bits";
import { formatVnd, giaoVien, phieuLuong } from "@/lib/mock-data";

export const Route = createFileRoute("/luong/tinh-luong")({ component: Page });

type SalarySlip = (typeof phieuLuong)[number];
type Teacher = (typeof giaoVien)[number];

function Page() {
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm">
          <b>Công thức:</b> Thực nhận = Lương theo công + phụ cấp trách nhiệm + phụ cấp xăng + thưởng - BHXH -
          tạm ứng - khoản trừ.
        </p>
      </Card>

      <PageToolbar>
        <Select>
          <option>Tháng 06/2026</option>
          <option>Tháng 05/2026</option>
        </Select>
        <div className="flex-1" />
      </PageToolbar>

      <DataTable
        headers={[
          "Giáo viên",
          "Công tự động",
          "Điều chỉnh",
          "Tổng công",
          "Lương cơ bản",
          "BHXH",
          "Phụ cấp TN",
          "Phụ cấp xăng",
          "Tạm ứng",
          "Thực nhận",
          "Trạng thái",
        ]}
        rows={phieuLuong.map((item) => {
          const teacher = teacherOf(item);
          const fuel = fuelMeta(teacher, item);
          return [
            <span className="font-medium">{item.gv}</span>,
            item.congTd,
            <span className={item.congDc !== 0 ? "text-warning-foreground" : ""}>
              {item.congDc > 0 ? `+${item.congDc}` : item.congDc}
            </span>,
            <span className="font-semibold">{item.tong}</span>,
            formatVnd(item.luongCb),
            formatVnd(item.bhxh),
            formatVnd(item.phuCap),
            formatVnd(fuel.amount),
            formatVnd(item.tamUng),
            <span className="font-bold text-success">{formatVnd(item.thucNhan)}</span>,
            <Badge tone="info">Đang tính</Badge>,
          ];
        })}
        onRowClick={(index) => setSelectedSlip(phieuLuong[index])}
      />

      {selectedSlip && <SalaryModal slip={selectedSlip} onClose={() => setSelectedSlip(null)} />}
    </div>
  );
}

function SalaryModal({ slip, onClose }: { slip: SalarySlip; onClose: () => void }) {
  const teacher = teacherOf(slip);
  const fuel = fuelMeta(teacher, slip);
  const sundayWork = 0;
  const mealAllowance = 0;
  const responsibilityAllowance = slip.phuCap;
  const reward = (slip as SalarySlip & { thuong?: number }).thuong ?? 300000;
  const supportBhxh = 0;
  const totalGross = slip.luongCb + supportBhxh + responsibilityAllowance + fuel.amount + reward + sundayWork + mealAllowance;
  const daysOff = (slip as SalarySlip & { soNgayNghi?: number }).soNgayNghi ?? Math.max(0, (teacher?.congChuan ?? 26) - slip.tong);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-3">
      <div className="w-full max-w-6xl rounded-md border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b bg-card px-4 py-3">
          <div>
            <div className="text-xs text-muted-foreground">Phiếu lương · {slip.thang}</div>
            <h2 className="text-lg font-semibold">{slip.gv}</h2>
          </div>
          <Btn variant="secondary" onClick={onClose}>Đóng</Btn>
        </div>

        <div className="p-4">
          <div className="mx-auto max-w-5xl rounded-lg border bg-background p-4 text-sm">
            <div className="rounded-md bg-primary/5 px-4 py-3 text-center">
              <div className="text-xs font-semibold uppercase text-muted-foreground">MẦM NON HOA HƯỚNG DƯƠNG</div>
              <div className="text-xl font-bold">Phiếu chi lương</div>
            </div>

            <div className="mt-3 rounded-md border bg-card">
              <PayslipLine label="Họ và tên GV:" value={slip.gv} />
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <section className="rounded-md border bg-card">
                <PayslipSectionTitle>Thu nhập</PayslipSectionTitle>
                <PayslipLine label="Tiền lương:" value={formatVnd(slip.luongCb)} strong />
                <PayslipLine label="Tổng phụ cấp làm thêm" value={formatVnd(sundayWork + mealAllowance + responsibilityAllowance + fuel.amount + reward)} strong />
                <PayslipLine label="1. Làm chủ nhật" value={formatVnd(sundayWork)} accent />
                <PayslipLine label="2. Tiền bữa ăn chiều" value={formatVnd(mealAllowance)} accent />
                <PayslipLine label="3. Phụ cấp trách nhiệm" value={formatVnd(responsibilityAllowance)} accent />
                <PayslipLine label="4. PC xăng" value={formatVnd(fuel.amount)} accent />
                <PayslipLine label="5. Thưởng 30/4" value={formatVnd(reward)} accent />
                <PayslipLine label="Tổng bao gồm BHXH:" value={formatVnd(totalGross + slip.bhxh)} strong italic />
              </section>

              <section className="rounded-md border bg-card">
                <PayslipLine label="Các khoản giảm trừ:" value="" title />
                <PayslipLine label="Ngày công tự động" value={`${slip.congTd} ngày`} />
                <PayslipLine label="Ngày nghỉ" value={`${daysOff} ngày`} />
                <PayslipLine label="Ngày công thực tế" value={`${slip.tong} ngày`} />
                <PayslipLine label="Trừ BHXH:" value={formatVnd(slip.bhxh)} />
                <PayslipLine label="Nhóm đóng BHXH:" value="21.50%" />
                <PayslipLine label="Tạm ứng:" value={formatVnd(slip.tamUng)} />
                <PayslipLine label="Khoản trừ:" value={formatVnd(slip.tru)} />
                <PayslipLine label="Tổng:" value={formatVnd(slip.bhxh + slip.tamUng + slip.tru)} strong italic />
              </section>
            </div>

            <div className="mt-3 grid gap-3 rounded-md border bg-success/5 p-3 md:grid-cols-[1fr_2fr]">
              <InlineValue label="Thực lãnh cuối kỳ:" value={formatVnd(slip.thucNhan)} success />
              <InlineValue label="Bằng chữ:" value={moneyToWords(slip.thucNhan)} />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <SignatureBox label="NGƯỜI NHẬN" />
              <SignatureBox label="KẾ TOÁN" />
              <SignatureBox label="NHÓM TRƯỞNG" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayslipLine({
  label,
  value,
  title = false,
  accent = false,
  italic = false,
  strong = false,
  success = false,
}: {
  label: string;
  value: string;
  title?: boolean;
  accent?: boolean;
  italic?: boolean;
  strong?: boolean;
  success?: boolean;
}) {
  return (
    <div className={`grid min-h-8 grid-cols-[1.35fr_1fr] gap-3 border-b px-3 py-1.5 last:border-b-0 ${title ? "bg-secondary/50" : ""}`}>
      <div className={`text-muted-foreground ${title ? "font-bold text-foreground" : ""} ${accent ? "text-destructive" : ""} ${italic ? "italic" : ""}`}>
        {label}
      </div>
      <div className={`text-right ${strong ? "font-bold" : ""} ${success ? "text-success text-base font-bold" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function SignatureBox({ label }: { label: string }) {
  return (
    <div className="rounded-md border bg-card px-3 py-3 text-center">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="h-16" />
    </div>
  );
}

function InlineValue({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={`truncate font-semibold ${success ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}

function PayslipSectionTitle({ children }: { children: ReactNode }) {
  return <div className="border-b bg-secondary/40 px-3 py-1.5 font-semibold">{children}</div>;
}

function teacherOf(slip: SalarySlip) {
  return giaoVien.find((item) => item.ten === slip.gv);
}

function fuelMeta(teacher: Teacher | undefined, slip: SalarySlip) {
  const teacherWithFuel = teacher as
    | (Teacher & { phuCapXang?: number; khoangCachKm?: number; cong2Chieu?: number; soNgayThang?: number; binhQuanKm?: number })
    | undefined;
  const slipWithFuel = slip as SalarySlip & { phuCapXang?: number };
  const index = Math.max(0, giaoVien.findIndex((item) => item.ten === slip.gv));
  const distanceKm = teacherWithFuel?.khoangCachKm ?? [7, 6, 8, 5, 8][index] ?? 6;
  return {
    distanceKm,
    roundTripKm: teacherWithFuel?.cong2Chieu ?? distanceKm * 2,
    daysPerMonth: teacherWithFuel?.soNgayThang ?? slip.tong,
    averagePerKm: teacherWithFuel?.binhQuanKm ?? 2400,
    amount: slipWithFuel.phuCapXang ?? teacherWithFuel?.phuCapXang ?? [420000, 360000, 520000, 300000, 480000][index] ?? 360000,
  };
}

function moneyToWords(amount: number) {
  if (!amount) return "Không đồng";
  const units = ["", "nghìn", "triệu", "tỷ"];
  const chunks: number[] = [];
  let n = Math.floor(amount);
  while (n > 0) {
    chunks.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const words = chunks
    .map((chunk, index) => (chunk ? `${readThreeDigits(chunk)} ${units[index]}`.trim() : ""))
    .filter(Boolean)
    .reverse()
    .join(" ");
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} đồng`;
}

function readThreeDigits(value: number) {
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const hundred = Math.floor(value / 100);
  const ten = Math.floor((value % 100) / 10);
  const one = value % 10;
  const parts: string[] = [];
  if (hundred) parts.push(`${digits[hundred]} trăm`);
  if (ten > 1) {
    parts.push(`${digits[ten]} mươi`);
    if (one === 1) parts.push("mốt");
    else if (one === 5) parts.push("lăm");
    else if (one) parts.push(digits[one]);
  } else if (ten === 1) {
    parts.push("mười");
    if (one === 5) parts.push("lăm");
    else if (one) parts.push(digits[one]);
  } else if (one) {
    if (hundred) parts.push("lẻ");
    parts.push(digits[one]);
  }
  return parts.join(" ");
}
