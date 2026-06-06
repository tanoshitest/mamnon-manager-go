import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageToolbar, Select } from "@/components/ui-bits";
import { giaoVien, hocSinh, lopHoc } from "@/lib/mock-data";

export const Route = createFileRoute("/bao-cao")({ component: Page });

type AttendCell = "MEAL" | "NO_MEAL" | "ABSENT" | "-";
type WorkCell = "OFF" | "AM" | "PM" | "MEAL" | "NORMAL" | "SUN" | "DUTY" | "-";

const MONTHS = ["01/2026", "02/2026", "03/2026", "04/2026", "05/2026", "06/2026"];
const DOW_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function seedRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

function genStudentMonth(idx: number, year: number, month: number): Record<number, AttendCell> {
  const rng = seedRng(idx * 1000 + year * 12 + month);
  const total = new Date(year, month, 0).getDate();
  const result: Record<number, AttendCell> = {};
  for (let d = 1; d <= total; d++) {
    const r = rng();
    result[d] = r < 0.68 ? "MEAL" : r < 0.9 ? "NO_MEAL" : "ABSENT";
  }
  return result;
}

function genTeacherWorkMonth(idx: number, year: number, month: number): { days: Record<number, WorkCell>; note: string } {
  const rng = seedRng(idx * 991 + year * 12 + month + 900);
  const total = new Date(year, month, 0).getDate();
  const days: Record<number, WorkCell> = {};
  let hasAbsence = false;
  let hasSunday = false;
  let hasDuty = false;

  for (let d = 1; d <= total; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    const r = rng();

    if (dow === 0) {
      days[d] = idx % 5 === d % 5 ? "SUN" : "-";
      hasSunday ||= days[d] === "SUN";
    } else if (r < 0.04) {
      days[d] = "OFF";
      hasAbsence = true;
    } else if (r < 0.08) {
      days[d] = "AM";
      hasAbsence = true;
    } else if (r < 0.12) {
      days[d] = "PM";
      hasAbsence = true;
    } else if (r < 0.16) {
      days[d] = "MEAL";
    } else if ((d + idx) % 6 === 0) {
      days[d] = "DUTY";
      hasDuty = true;
    } else {
      days[d] = "NORMAL";
    }
  }

  return {
    days,
    note: hasAbsence ? "Có vắng/nghỉ trong tháng" : hasSunday ? "Có làm Chủ Nhật" : hasDuty ? "Có lịch trực 6h15" : "Chấm công ổn định",
  };
}

function parseYM(ym: string) {
  const [m, y] = ym.split("/").map(Number);
  return { year: y, month: m };
}

function AttCell({ val }: { val: AttendCell }) {
  if (val === "-") return <span className="text-gray-200 text-[9px] select-none leading-none">-</span>;
  if (val === "MEAL") return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white">A</span>;
  if (val === "NO_MEAL") return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[9px] font-bold text-white">K</span>;
  return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">V</span>;
}

function WorkCellView({ val }: { val: WorkCell }) {
  const classes = "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[8px] font-bold text-white";
  if (val === "-") return <span className="text-gray-200 text-[9px] select-none leading-none">-</span>;
  if (val === "OFF") return <span className={`${classes} bg-red-500`}>N</span>;
  if (val === "AM") return <span className={`${classes} bg-amber-500`}>S</span>;
  if (val === "PM") return <span className={`${classes} bg-orange-500`}>C</span>;
  if (val === "MEAL") return <span className={`${classes} bg-pink-500`}>A</span>;
  if (val === "SUN") return <span className={`${classes} bg-violet-600`}>CN</span>;
  if (val === "DUTY") return <span className={`${classes} bg-sky-600`}>T</span>;
  return <span className={`${classes} bg-green-500`}>B</span>;
}

function Page() {
  return <Outlet />;
}

export function AttendanceReport() {
  const [selectedMonth, setSelectedMonth] = useState("06/2026");
  const [selectedLop, setSelectedLop] = useState(lopHoc[1]?.ten ?? lopHoc[0]?.ten ?? "");

  const { year, month } = parseYM(selectedMonth);
  const total = new Date(year, month, 0).getDate();
  const dayNums = Array.from({ length: total }, (_, i) => i + 1);
  const classNames = useMemo(() => lopHoc.map((l) => l.ten), []);
  const filteredStudents = useMemo(
    () => hocSinh.filter((s) => s.lop === selectedLop),
    [selectedLop],
  );
  const attendanceMap = useMemo(
    () => Object.fromEntries(filteredStudents.map((s, idx) => [s.ma, genStudentMonth(idx, year, month)])),
    [filteredStudents, year, month],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <PageToolbar>
        <Select value={selectedMonth} onChange={(e: any) => setSelectedMonth(e.target.value)}>
          {MONTHS.map((m) => <option key={m}>{m}</option>)}
        </Select>
        <Select value={selectedLop} onChange={(e: any) => setSelectedLop(e.target.value)}>
          {classNames.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <div className="flex-1" />
        <AttendanceLegend />
      </PageToolbar>

      <AttMatrix
        rows={filteredStudents.map((s) => ({
          key: s.ma,
          label: s.ten,
          att: attendanceMap[s.ma] || {},
          note: summarizeAttendance(attendanceMap[s.ma] || {}),
        }))}
        dayNums={dayNums}
        year={year}
        month={month}
      />
    </div>
  );
}

function summarizeAttendance(att: Record<number, AttendCell>) {
  const values = Object.values(att);
  const absent = values.filter((value) => value === "ABSENT").length;
  const noMeal = values.filter((value) => value === "NO_MEAL").length;
  if (absent > 0 && noMeal > 0) return `Vắng ${absent} ngày · không ăn chiều ${noMeal} ngày`;
  if (absent > 0) return `Vắng ${absent} ngày`;
  if (noMeal > 0) return `Không ăn chiều ${noMeal} ngày`;
  return "Đi học ổn định";
}

export function WorkdayReport() {
  const [selectedMonth, setSelectedMonth] = useState("06/2026");
  const { year, month } = parseYM(selectedMonth);
  const total = new Date(year, month, 0).getDate();
  const dayNums = Array.from({ length: total }, (_, i) => i + 1);
  const workMap = useMemo(
    () => Object.fromEntries(giaoVien.map((gv, idx) => [gv.ma, genTeacherWorkMonth(idx, year, month)])),
    [year, month],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <PageToolbar>
        <Select value={selectedMonth} onChange={(e: any) => setSelectedMonth(e.target.value)}>
          {MONTHS.map((m) => <option key={m}>{m}</option>)}
        </Select>
        <div className="flex-1" />
        <WorkLegend />
      </PageToolbar>

      <WorkMatrix
        rows={giaoVien.map((gv) => ({
          key: gv.ma,
          label: gv.ten,
          work: workMap[gv.ma]?.days || {},
          note: workMap[gv.ma]?.note || "",
        }))}
        dayNums={dayNums}
        year={year}
        month={month}
      />
    </div>
  );
}

function AttendanceLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Học có ăn chiều</span>
      <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-sky-500" /> Học không ăn chiều</span>
      <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Vắng</span>
    </div>
  );
}

function WorkLegend() {
  const items: Array<[WorkCell, string]> = [
    ["NORMAL", "Ngày làm bình thường"],
    ["OFF", "Ngày nghỉ"],
    ["AM", "Vắng sáng"],
    ["PM", "Vắng chiều"],
    ["MEAL", "Vắng ăn chiều"],
    ["SUN", "Ngày làm chủ nhật"],
    ["DUTY", "Lịch trực 6h15 sáng"],
  ];

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500">
      {items.map(([value, label]) => (
        <span key={value} className="flex items-center gap-1">
          <WorkCellView val={value} />
          {label}
        </span>
      ))}
    </div>
  );
}

function WorkMatrix({
  rows,
  dayNums,
  year,
  month,
}: {
  rows: { key: string; label: string; work: Record<number, WorkCell>; note: string }[];
  dayNums: number[];
  year: number;
  month: number;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse text-[11px]">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="sticky left-0 z-30 w-[76px] border-r border-gray-200 bg-gray-50 px-2 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap">
              Tên
            </th>
            {dayNums.map((d) => {
              const dow = new Date(year, month - 1, d).getDay();
              const isWeekend = dow === 0 || dow === 6;
              return (
                <th
                  key={d}
                  className={`w-[28px] border-r border-gray-100 py-1 text-center font-medium last:border-r-0 ${
                    isWeekend ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  <div className="text-[9px] font-bold leading-none">{d}</div>
                  <div className="text-[8px] font-normal">{DOW_SHORT[dow]}</div>
                </th>
              );
            })}
            <th className="sticky right-0 z-30 w-[132px] border-l border-gray-200 bg-gray-50 px-2 py-1.5 text-left font-semibold text-gray-600">
              Ghi chú
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label, work, note }, rowIdx) => {
            const bg = rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60";
            return (
              <tr key={key} className={`border-b border-gray-50 transition-colors hover:bg-blue-50/20 ${bg}`}>
                <td className={`sticky left-0 z-10 max-w-[76px] truncate border-r border-gray-200 px-2 py-1.5 font-medium text-gray-800 whitespace-nowrap ${bg}`}>
                  {label}
                </td>
                {dayNums.map((d) => (
                  <td key={d} className="border-r border-gray-50 px-0 py-1 text-center last:border-r-0">
                    <WorkCellView val={work[d] ?? "-"} />
                  </td>
                ))}
                <td className={`sticky right-0 z-10 max-w-[132px] truncate border-l border-gray-200 px-2 py-1.5 text-gray-500 ${bg}`}>
                  {note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AttMatrix({
  rows,
  dayNums,
  year,
  month,
}: {
  rows: { key: string; label: string; att: Record<number, AttendCell>; note: string }[];
  dayNums: number[];
  year: number;
  month: number;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-max border-collapse text-xs">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="sticky left-0 z-30 min-w-[150px] border-r border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">
              Tên
            </th>
            {dayNums.map((d) => {
              const dow = new Date(year, month - 1, d).getDay();
              const isWeekend = dow === 0 || dow === 6;
              return (
                <th
                  key={d}
                  className={`min-w-[30px] border-r border-gray-100 py-1 text-center font-medium last:border-r-0 ${
                    isWeekend ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  <div className="text-[10px] font-bold">{d}</div>
                  <div className="text-[8px] font-normal">{DOW_SHORT[dow]}</div>
                </th>
              );
            })}
            <th className="sticky right-0 z-30 min-w-[170px] border-l border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">
              Ghi chú
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label, att, note }, rowIdx) => {
            const bg = rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60";
            return (
              <tr key={key} className={`border-b border-gray-50 transition-colors hover:bg-blue-50/20 ${bg}`}>
                <td className={`sticky left-0 z-10 border-r border-gray-200 px-3 py-1.5 font-medium text-gray-800 whitespace-nowrap ${bg}`}>
                  {label}
                </td>
                {dayNums.map((d) => (
                  <td key={d} className="border-r border-gray-50 px-0 py-1 text-center last:border-r-0">
                    <AttCell val={att[d] ?? "-"} />
                  </td>
                ))}
                <td className={`sticky right-0 z-10 max-w-[170px] truncate border-l border-gray-200 px-3 py-1.5 text-gray-500 ${bg}`}>
                  {note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
