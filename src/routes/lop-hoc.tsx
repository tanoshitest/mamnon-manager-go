import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge, Btn, Card, DataTable, Input, PageToolbar, Select } from "@/components/ui-bits";
import { coSo, formatVnd, giaoVien, hocSinh, lopHoc } from "@/lib/mock-data";

export const Route = createFileRoute("/lop-hoc")({ component: Page });

type LopHoc = (typeof lopHoc)[number];
type FormState = Pick<LopHoc, "ma" | "ten" | "coSo" | "gv" | "lich" | "chuKyThu" | "hocPhi" | "trangThai">;
type AttendanceStatus = "Học có ăn chiều" | "Học không ăn chiều" | "Vắng";

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const emptyForm = (next: number): FormState => ({
  ma: `L${String(next).padStart(2, "0")}`,
  ten: "",
  coSo: coSo[0],
  gv: giaoVien[0]?.ten ?? "Chưa gán",
  lich: "T2-T6",
  chuKyThu: "Theo tháng",
  hocPhi: 2500000,
  trangThai: "Hoạt động",
});

const today = new Date().toISOString().slice(0, 10);

function Page() {
  const [classes, setClasses] = useState<LopHoc[]>(lopHoc);
  const [facility, setFacility] = useState("Tất cả cơ sở");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [editing, setEditing] = useState<FormState | null>(null);
  const [confirmDeleteMa, setConfirmDeleteMa] = useState<string | null>(null);
  const [selectedMa, setSelectedMa] = useState(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("ma"),
  );
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const confirmDeleteClass = classes.find((item) => item.ma === confirmDeleteMa);

  const selectedClass = classes.find((item) => item.ma === selectedMa);
  const filteredClasses = classes.filter((item) => {
    const matchFacility = facility === "Tất cả cơ sở" || item.coSo === facility;
    const matchKeyword = [item.ma, item.ten, item.gv].join(" ").toLowerCase().includes(keyword.toLowerCase());
    return matchFacility && matchKeyword;
  });

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedClasses = filteredClasses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const startAdd = () => {
    setEditing(emptyForm(classes.length + 1));
  };

  const startEdit = (lop: LopHoc) => {
    setEditing({
      ma: lop.ma,
      ten: lop.ten,
      coSo: lop.coSo,
      gv: lop.gv,
      lich: lop.lich,
      chuKyThu: lop.chuKyThu,
      hocPhi: lop.hocPhi,
      trangThai: lop.trangThai,
    });
  };

  const saveClass = () => {
    if (!editing || !editing.ten.trim()) return;
    setClasses((items) => {
      const exists = items.some((item) => item.ma === editing.ma);
      if (exists) {
        return items.map((item) =>
          item.ma === editing.ma ? { ...item, ...editing, ten: editing.ten.trim() } : item,
        );
      }
      return [{ ...editing, ten: editing.ten.trim(), soHs: 0 }, ...items];
    });
    setEditing(null);
  };

  const deleteClass = (ma: string) => {
    setClasses((items) => items.filter((item) => item.ma !== ma));
    if (selectedMa === ma) openList();
  };

  const openDetail = (ma: string) => {
    setSelectedMa(ma);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/lop-hoc?ma=${encodeURIComponent(ma)}`);
    }
  };

  const openList = () => {
    setSelectedMa(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/lop-hoc");
    }
  };

  if (selectedClass) {
    return (
      <ClassDetail
        lop={selectedClass}
        onBack={openList}
        onEdit={() => startEdit(selectedClass)}
        editing={editing}
        setEditing={setEditing}
        saveClass={saveClass}
        attendanceDate={attendanceDate}
        setAttendanceDate={setAttendanceDate}
        attendance={attendance}
        setAttendance={setAttendance}
      />
    );
  }

  return (
    <div>
      <PageToolbar>
        <Select value={facility} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(() => setFacility(event.target.value))}>
          <option>Tất cả cơ sở</option>
          {coSo.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Input value={keyword} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(() => setKeyword(event.target.value))} placeholder="Tìm lớp..." />
        <div className="flex-1" />
        <Btn onClick={startAdd}>Thêm lớp</Btn>
      </PageToolbar>

      {editing && (
        <ClassForm form={editing} setForm={setEditing} onSave={saveClass} onCancel={() => setEditing(null)} />
      )}

      <DataTable
        headers={[
          "Mã lớp",
          "Tên lớp",
          "Cơ sở",
          "Giáo viên",
          "Sĩ số",
          "Lịch học",
          "Chu kỳ thu học phí",
          "Học phí mặc định",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={pagedClasses.map((lop) => [
          lop.ma,
          <span className="font-medium">{lop.ten}</span>,
          lop.coSo,
          lop.gv,
          lop.soHs,
          lop.lich,
          lop.chuKyThu,
          formatVnd(lop.hocPhi),
          <Badge tone={lop.trangThai === "Hoạt động" ? "success" : "default"}>{lop.trangThai}</Badge>,
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDeleteMa(lop.ma); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Xóa lớp"
          >
            <Trash2 className="h-4 w-4" />
          </button>,
        ])}
        onRowClick={(index) => openDetail(pagedClasses[index].ma)}
      />

      {/* Confirm Delete Popup */}
      {confirmDeleteMa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteMa(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">Xác nhận xóa</div>
              <div className="text-sm text-gray-500">
                Bạn có chắc muốn xóa lớp <span className="font-semibold text-gray-800">{confirmDeleteClass?.ten}</span> không? Hành động này không thể hoàn tác.
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmDeleteMa(null)}
                className="flex-1 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => { if (confirmDeleteMa) deleteClass(confirmDeleteMa); setConfirmDeleteMa(null); }}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                OK, xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3">
          <span className="text-xs text-gray-500">
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredClasses.length)} / {filteredClasses.length} lớp
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ‹ Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      safePage === p
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Sau ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  form: FormState;
  setForm: (form: FormState | null) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (patch: Partial<FormState>) => setForm({ ...form, ...patch });
  const selectedTeachers = teacherNames(form.gv);
  const selectedDays = scheduleDays(form.lich);
  const toggleTeacher = (teacherName: string) => {
    const next = selectedTeachers.includes(teacherName)
      ? selectedTeachers.filter((item) => item !== teacherName)
      : [...selectedTeachers, teacherName];
    update({ gv: next.length ? next.join(", ") : "Chưa gán" });
  };
  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((item) => item !== day)
      : [...selectedDays, day].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
    update({ lich: compactSchedule(next) });
  };

  return (
    <Card className="mb-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Mã lớp">
          <Input value={form.ma} onChange={(event: React.ChangeEvent<HTMLInputElement>) => update({ ma: event.target.value })} />
        </Field>
        <Field label="Tên lớp">
          <Input value={form.ten} onChange={(event: React.ChangeEvent<HTMLInputElement>) => update({ ten: event.target.value })} placeholder="Nhập tên lớp" />
        </Field>
        <Field label="Cơ sở">
          <Select value={form.coSo} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => update({ coSo: event.target.value })}>
            {coSo.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Giáo viên">
          <div className="grid gap-1 rounded-md border bg-background p-2">
            {giaoVien.map((item) => (
              <label key={item.ma} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(item.ten)}
            disabled={false}
                  onChange={() => toggleTeacher(item.ten)}
                />
                <span>{item.ten}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Lịch học">
          <div className="flex flex-wrap gap-1 rounded-md border bg-background p-2">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center gap-1 rounded border px-2 py-1 text-sm">
                <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Chu kỳ thu">
          <Select value={form.chuKyThu} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => update({ chuKyThu: event.target.value })}>
            <option>Theo tháng</option>
            <option>Theo tuần</option>
          </Select>
        </Field>
        <Field label="Học phí">
          <Input
            type="number"
            value={form.hocPhi}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => update({ hocPhi: Number(event.target.value) })}
          />
        </Field>
        <Field label="Trạng thái">
          <Select value={form.trangThai} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => update({ trangThai: event.target.value })}>
            <option>Hoạt động</option>
            <option>Tạm ngưng</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Btn variant="secondary" onClick={onCancel}>Hủy</Btn>
        <Btn onClick={onSave} disabled={!form.ten.trim()}>Lưu lớp</Btn>
      </div>
    </Card>
  );
}

function ClassDetail({
  lop,
  onBack,
  onEdit,
  editing,
  setEditing,
  saveClass,
  attendanceDate,
  setAttendanceDate,
  attendance,
  setAttendance,
}: {
  lop: LopHoc;
  onBack: () => void;
  onEdit: () => void;
  editing: FormState | null;
  setEditing: (form: FormState | null) => void;
  saveClass: () => void;
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
  attendance: Record<string, AttendanceStatus>;
  setAttendance: (attendance: Record<string, AttendanceStatus>) => void;
}) {
  const students = useMemo(() => hocSinh.filter((item) => item.lop === lop.ten), [lop.ten]);
  const teachers = useMemo(
    () => giaoVien.filter((item) => item.lop === lop.ten || teacherNames(lop.gv).includes(item.ten)),
    [lop.gv, lop.ten],
  );
  const statusOf = (ma: string): AttendanceStatus => attendance[attendanceKey(lop.ma, attendanceDate, ma)] ?? "Học có ăn chiều";
  const counts = students.reduce(
    (result, student) => {
      result[statusOf(student.ma)] += 1;
      return result;
    },
    { "Học có ăn chiều": 0, "Học không ăn chiều": 0, Vắng: 0 } as Record<AttendanceStatus, number>,
  );
  const setStatus = (studentMa: string, status: AttendanceStatus) => {
    setAttendance({ ...attendance, [attendanceKey(lop.ma, attendanceDate, studentMa)]: status });
  };

  return (
    <div className="space-y-4">
      <PageToolbar>
        <Btn variant="secondary" onClick={onBack}>Quay lại</Btn>
        <div>
          <div className="text-xs text-muted-foreground">{lop.ma} · {lop.coSo}</div>
          <h2 className="text-xl font-semibold leading-tight">{lop.ten}</h2>
        </div>
        <div className="flex-1" />
        <Btn variant="ghost" onClick={onEdit}>Sửa lớp / gán GV</Btn>
      </PageToolbar>

      {editing && (
        <ClassForm form={editing} setForm={setEditing} onSave={saveClass} onCancel={() => setEditing(null)} />
      )}

      <Card className="py-3">
        <div className="grid gap-3 text-sm md:grid-cols-5">
          <InfoItem label="Sĩ số" value={`${students.length}/${lop.soHs}`} />
          <InfoItem
            label="Giáo viên"
            value={teachers.length ? teachers.map((item) => `${item.ten} · ${item.sdt}`).join(" / ") : lop.gv}
          />
          <InfoItem label="Lịch học" value={`${lop.lich} · ${lop.chuKyThu}`} />
          <InfoItem label="Học phí" value={formatVnd(lop.hocPhi)} />
          <InfoItem label="Điểm danh" value={`${counts["Học có ăn chiều"]} ăn chiều · ${counts["Học không ăn chiều"]} không ăn · ${counts.Vắng} vắng`} />
        </div>
      </Card>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Học viên và điểm danh</h3>
          <div className="flex-1" />
          <Input
            type="date"
            value={attendanceDate}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttendanceDate(event.target.value)}
          />
          <Btn>Lưu điểm danh</Btn>
        </div>
        <DataTable
          headers={["Mã HS", "Họ tên", "Phụ huynh", "SĐT", "Dịch vụ", "Trạng thái", "Điểm danh"]}
          rows={students.map((student) => [
            student.ma,
              <span className="font-medium">{student.ten}</span>,
            student.ph,
            student.sdt,
            <span className="text-xs text-muted-foreground">{student.dv}</span>,
            <Badge tone={student.trangThai === "Đang học" ? "success" : "warning"}>{student.trangThai}</Badge>,
            <AttendancePicker value={statusOf(student.ma)} onChange={(status) => setStatus(student.ma, status)} />,
          ])}
        />
      </section>
    </div>
  );
}

function AttendancePicker({ value, onChange }: { value: AttendanceStatus; onChange: (value: AttendanceStatus) => void }) {
  const statuses: AttendanceStatus[] = ["Học có ăn chiều", "Học không ăn chiều", "Vắng"];
  return (
    <div className="flex flex-wrap gap-1">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
            value === status ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="truncate font-semibold">{value}</div>
    </div>
  );
}

function attendanceKey(classMa: string, date: string, studentMa: string) {
  return `${classMa}:${date}:${studentMa}`;
}

function teacherNames(value: string) {
  if (!value || value === "Chưa gán") return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function scheduleDays(value: string) {
  if (!value) return [];
  const trimmed = value.trim();
  const rangeMatch = trimmed.match(/^(T[2-7]|CN)-(T[2-7]|CN)$/);
  if (rangeMatch) {
    const start = weekDays.indexOf(rangeMatch[1]);
    const end = weekDays.indexOf(rangeMatch[2]);
    if (start >= 0 && end >= start) return weekDays.slice(start, end + 1);
  }
  return trimmed
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter((item) => weekDays.includes(item));
}

function compactSchedule(days: string[]) {
  const sorted = days.filter((day, index) => days.indexOf(day) === index).sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
  if (!sorted.length) return "";
  const start = weekDays.indexOf(sorted[0]);
  const isContiguous = sorted.every((day, index) => weekDays[start + index] === day);
  return isContiguous && sorted.length > 1 ? `${sorted[0]}-${sorted[sorted.length - 1]}` : sorted.join(", ");
}

function confirmDelete(className: string) {
  return typeof window === "undefined" || window.confirm(`Xóa ${className}?`);
}
