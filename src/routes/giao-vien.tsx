import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Trash2, X } from "lucide-react";
import { Badge, Btn, Card, DataTable, Input, PageToolbar, Select } from "@/components/ui-bits";
import { bangCong, formatVnd, giaoVien, lopHoc, phieuLuong } from "@/lib/mock-data";

export const Route = createFileRoute("/giao-vien")({ component: Page });

type GiaoVien = (typeof giaoVien)[number];
type SalarySlip = (typeof phieuLuong)[number];
type TeacherTab = "Thông tin giáo viên" | "Lớp đang dạy" | "Báo cáo lương";
type TeacherForm = {
  ma: string;
  ten: string;
  lop: string;
  sdt: string;
  luongCb: string;
  bhxh: string;
  phuCap: string;
  phuCapXang: string;
  khoangCachKm: string;
  congChuan: string;
};

const teacherTabs: TeacherTab[] = ["Thông tin giáo viên", "Lớp đang dạy", "Báo cáo lương"];

function Page() {
  const [teachers, setTeachers] = useState<GiaoVien[]>(giaoVien);
  const [selectedMa, setSelectedMa] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TeacherTab>("Thông tin giáo viên");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLop, setSelectedLop] = useState("Tất cả lớp phụ trách");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteMa, setConfirmDeleteMa] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const PAGE_SIZE = 10;
  const selectedTeacher = teachers.find((item) => item.ma === selectedMa);
  const confirmDeleteTeacher = teachers.find((item) => item.ma === confirmDeleteMa);

  const nextTeacherCode = () => {
    const next = teachers.length + 1;
    return `GV${String(next).padStart(2, "0")}`;
  };

  const addTeacher = (form: TeacherForm) => {
    const distanceKm = Number(form.khoangCachKm) || 0;
    setTeachers([
      {
        ma: form.ma.trim() || nextTeacherCode(),
        ten: form.ten.trim() || "Giáo viên mới",
        lop: form.lop,
        sdt: form.sdt.trim() || "0900000000",
        luongCb: Number(form.luongCb) || 0,
        bhxh: Number(form.bhxh) || 0,
        phuCap: Number(form.phuCap) || 0,
        congChuan: Number(form.congChuan) || 26,
        phuCapXang: Number(form.phuCapXang) || 0,
        khoangCachKm: distanceKm,
        cong2Chieu: distanceKm * 2,
        soNgayThang: Number(form.congChuan) || 26,
        binhQuanKm: distanceKm ? Math.round((Number(form.phuCapXang) || 0) / Math.max(1, distanceKm * 2 * (Number(form.congChuan) || 26))) : 0,
      } as GiaoVien,
      ...teachers,
    ]);
    setSearchQuery("");
    setSelectedLop("Tất cả lớp phụ trách");
    setCurrentPage(1);
    setShowAddPopup(false);
  };

  const editTeacher = (ma: string) => {
    setTeachers((items) =>
      items.map((item) => (item.ma === ma ? { ...item, lop: lopHoc[0].ten } : item)),
    );
  };

  const deleteTeacher = (ma: string) => {
    setTeachers((items) => items.filter((item) => item.ma !== ma));
    if (selectedMa === ma) setSelectedMa(null);
  };

  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  const filteredTeachers = teachers.filter((t) => {
    const matchLop = selectedLop === "Tất cả lớp phụ trách" || t.lop === selectedLop;
    const q = searchQuery.toLowerCase();
    const matchSearch = t.ten.toLowerCase().includes(q) || t.ma.toLowerCase().includes(q) || t.sdt.includes(searchQuery);
    return matchLop && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedTeachers = filteredTeachers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openTeacher = (ma: string) => {
    setSelectedMa(ma);
    setActiveTab("Thông tin giáo viên");
  };

  if (selectedTeacher) {
    return (
      <TeacherDetail
        teacher={selectedTeacher}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBack={() => setSelectedMa(null)}
        onEdit={() => editTeacher(selectedTeacher.ma)}
      />
    );
  }

  return (
    <div>
      <PageToolbar>
        <Input
          placeholder="Tìm giáo viên..."
          value={searchQuery}
          onChange={(e: any) => handleFilterChange(() => setSearchQuery(e.target.value))}
        />
        <Select
          value={selectedLop}
          onChange={(e: any) => handleFilterChange(() => setSelectedLop(e.target.value))}
        >
          <option>Tất cả lớp phụ trách</option>
          {lopHoc.map((lop) => (
            <option key={lop.ma}>{lop.ten}</option>
          ))}
        </Select>
        <div className="flex-1" />
        <Btn onClick={() => setShowAddPopup(true)}>Thêm giáo viên</Btn>
      </PageToolbar>

      {showAddPopup && (
        <AddTeacherPopup
          nextCode={nextTeacherCode()}
          onClose={() => setShowAddPopup(false)}
          onSave={addTeacher}
        />
      )}

      <DataTable
        headers={[
          "Mã GV",
          "Họ tên",
          "Lớp phụ trách",
          "SĐT",
          "Lương cơ bản",
          "BHXH",
          "Phụ cấp trách nhiệm",
          "Phụ cấp xăng",
          "Công chuẩn",
          "Thao tác",
        ]}
        rows={pagedTeachers.map((teacher, index) => [
          teacher.ma,
          <span className="font-medium">{teacher.ten}</span>,
          teacher.lop,
          teacher.sdt,
          formatVnd(teacher.luongCb),
          formatVnd(teacher.bhxh),
          formatVnd(teacher.phuCap),
          formatVnd(fuelAllowance(teacher, teachers.indexOf(teacher))),
          teacher.congChuan,
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDeleteMa(teacher.ma); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Xóa giáo viên"
          >
            <Trash2 className="h-4 w-4" />
          </button>,
        ])}
        onRowClick={(index) => openTeacher(pagedTeachers[index].ma)}
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
                Bạn có chắc muốn xóa giáo viên <span className="font-semibold text-gray-800">{confirmDeleteTeacher?.ten}</span> không? Hành động này không thể hoàn tác.
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
                onClick={() => { if (confirmDeleteMa) deleteTeacher(confirmDeleteMa); setConfirmDeleteMa(null); }}
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
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredTeachers.length)} / {filteredTeachers.length} giáo viên
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

function AddTeacherPopup({
  nextCode,
  onClose,
  onSave,
}: {
  nextCode: string;
  onClose: () => void;
  onSave: (form: TeacherForm) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      ma: String(data.get("ma") ?? ""),
      ten: String(data.get("ten") ?? ""),
      lop: String(data.get("lop") ?? ""),
      sdt: String(data.get("sdt") ?? ""),
      luongCb: String(data.get("luongCb") ?? ""),
      bhxh: String(data.get("bhxh") ?? ""),
      phuCap: String(data.get("phuCap") ?? ""),
      phuCapXang: String(data.get("phuCapXang") ?? ""),
      khoangCachKm: String(data.get("khoangCachKm") ?? ""),
      congChuan: String(data.get("congChuan") ?? ""),
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <div className="text-xs text-muted-foreground">Quản lý giáo viên</div>
            <h2 className="text-lg font-semibold">Thêm giáo viên</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form id="add-teacher-form" onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
          <FormField label="Mã GV">
            <Input name="ma" defaultValue={nextCode} />
          </FormField>
          <FormField label="Họ tên">
            <Input name="ten" defaultValue="Cô mới" />
          </FormField>
          <FormField label="Lớp phụ trách">
            <Select name="lop" defaultValue={lopHoc[0]?.ten ?? "Chưa gán lớp"}>
              <option>Chưa gán lớp</option>
              {lopHoc.map((lop) => (
                <option key={lop.ma}>{lop.ten}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Số điện thoại">
            <Input name="sdt" defaultValue="0900000000" />
          </FormField>
          <FormField label="Lương cơ bản">
            <Input name="luongCb" type="number" defaultValue="7500000" />
          </FormField>
          <FormField label="BHXH">
            <Input name="bhxh" type="number" defaultValue="600000" />
          </FormField>
          <FormField label="Phụ cấp trách nhiệm">
            <Input name="phuCap" type="number" defaultValue="500000" />
          </FormField>
          <FormField label="Phụ cấp xăng">
            <Input name="phuCapXang" type="number" defaultValue="420000" />
          </FormField>
          <FormField label="Khoảng cách từ nhà đến nhóm (km)">
            <Input name="khoangCachKm" type="number" defaultValue="7" />
          </FormField>
          <FormField label="Công chuẩn">
            <Input name="congChuan" type="number" defaultValue="26" />
          </FormField>
        </form>

        <div className="flex items-center justify-end gap-2 border-t bg-secondary/30 px-5 py-3">
          <Btn variant="secondary" onClick={onClose}>Hủy</Btn>
          <button
            type="submit"
            form="add-teacher-form"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Lưu giáo viên
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function TeacherDetail({
  teacher,
  activeTab,
  setActiveTab,
  onBack,
  onEdit,
}: {
  teacher: GiaoVien;
  activeTab: TeacherTab;
  setActiveTab: (tab: TeacherTab) => void;
  onBack: () => void;
  onEdit: () => void;
}) {
  const teacherIndex = giaoVien.findIndex((item) => item.ma === teacher.ma);
  const fuel = fuelMeta(teacher, teacherIndex);
  const [salaryMonth, setSalaryMonth] = useState("06/2026");
  const [workPage, setWorkPage] = useState(0);
  const [showSalarySlip, setShowSalarySlip] = useState(false);
  const selectedSalary = phieuLuong.find((item) => item.gv === teacher.ten && item.thang === salaryMonth);
  const classes = useMemo(
    () => lopHoc.filter((lop) => lop.gv.split(",").map((item) => item.trim()).includes(teacher.ten) || lop.ten === teacher.lop),
    [teacher],
  );
  const primaryClassName = classes[0]?.ten ?? teacher.lop;
  const workHistory = useMemo(
    () => buildWorkHistory(teacher, primaryClassName, salaryMonth, teacherIndex),
    [primaryClassName, salaryMonth, teacher, teacherIndex],
  );
  const workedDays = workHistory.filter((item) => item.status === "worked").length;
  const absentDays = workHistory.filter((item) => item.status === "absent").length;
  const reportSalary = selectedSalary ?? buildSalarySlip(teacher, salaryMonth, workHistory, fuel.amount);
  const reportTotalWork = selectedSalary?.tong ?? workHistory.reduce((sum, item) => sum + item.tong, 0);
  const rowsPerPage = 10;
  const totalWorkPages = Math.max(1, Math.ceil(workHistory.length / rowsPerPage));
  const visibleWorkHistory = workHistory.slice(workPage * rowsPerPage, workPage * rowsPerPage + rowsPerPage);

  return (
    <div className={activeTab === "Báo cáo lương" ? "space-y-3" : "space-y-4"}>
      <PageToolbar>
        <Btn variant="secondary" onClick={onBack}>Quay lại</Btn>
        <div>
          <div className="text-xs text-muted-foreground">{teacher.ma} · {teacher.sdt}</div>
          <h2 className="text-xl font-semibold leading-tight">{teacher.ten}</h2>
        </div>
        <div className="flex-1" />
        <Btn variant="ghost" onClick={onEdit}>Sửa thông tin</Btn>
      </PageToolbar>

      <div className="flex border-b">
        {teacherTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Thông tin giáo viên" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card>
            <h3 className="mb-3 font-semibold">Thông tin giáo viên</h3>
            <InfoGrid
              items={[
                ["Mã giáo viên", teacher.ma],
                ["Họ tên", teacher.ten],
                ["Số điện thoại", teacher.sdt],
                ["Lớp phụ trách", teacher.lop],
                ["Công chuẩn", `${teacher.congChuan} ngày`],
              ]}
            />
          </Card>
          <Card>
            <h3 className="mb-3 font-semibold">Thông tin lương</h3>
            <InfoGrid
              items={[
                ["Lương cơ bản", formatVnd(teacher.luongCb)],
                ["Đóng BHXH", formatVnd(teacher.bhxh)],
                ["Phụ cấp trách nhiệm", formatVnd(teacher.phuCap)],
                ["Phụ cấp xăng", formatVnd(fuel.amount)],
                ["Khoảng cách", `${fuel.distanceKm} km · cộng 2 chiều ${fuel.roundTripKm} km`],
              ]}
            />
          </Card>
        </div>
      )}

      {activeTab === "Lớp đang dạy" && (
        <DataTable
          headers={["Mã lớp", "Tên lớp", "Cơ sở", "Lịch học", "Sĩ số", "Học phí"]}
          rows={classes.map((lop) => [
            lop.ma,
            <span className="font-medium">{lop.ten}</span>,
            lop.coSo,
            lop.lich,
            lop.soHs,
            formatVnd(lop.hocPhi),
          ])}
        />
      )}

      {activeTab === "Báo cáo lương" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Select
              value={salaryMonth}
              onChange={(event) => {
                setSalaryMonth(event.target.value);
                setWorkPage(0);
              }}
            >
              <option value="06/2026">Tháng 06/2026</option>
              <option value="05/2026">Tháng 05/2026</option>
            </Select>
            <Btn onClick={() => setShowSalarySlip(true)}>Phiếu lương</Btn>
            <div className="flex-1" />
            <Badge tone="info">Đi làm: {workedDays}</Badge>
            <Badge tone="warning">Nghỉ: {absentDays}</Badge>
          </div>

          <WorkHistoryTable rows={visibleWorkHistory} />
          <div className="flex items-center justify-end gap-2 text-sm leading-none">
            <Btn variant="secondary" disabled={workPage === 0} onClick={() => setWorkPage((page) => Math.max(0, page - 1))}>
              Trước
            </Btn>
            <span className="text-muted-foreground">
              Trang {workPage + 1}/{totalWorkPages} · {reportTotalWork} công
            </span>
            <Btn
              variant="secondary"
              disabled={workPage >= totalWorkPages - 1}
              onClick={() => setWorkPage((page) => Math.min(totalWorkPages - 1, page + 1))}
            >
              Sau
            </Btn>
          </div>

          {showSalarySlip && <TeacherSalaryModal slip={reportSalary} onClose={() => setShowSalarySlip(false)} />}
        </div>
      )}
    </div>
  );
}

type WorkHistoryItem = {
  ngay: string;
  thu: string;
  lop: string;
  trangThai: string;
  status: "worked" | "absent" | "off";
  tong: number;
  lichSu: string;
};

function WorkHistoryTable({ rows }: { rows: WorkHistoryItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            {["Ngày", "Thứ", "Lớp", "Trạng thái", "Công", "Lịch sử"].map((header) => (
              <th key={header} className="border-b px-3 py-2 text-left font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.ngay} className="hover:bg-secondary/50">
              <td className="border-b px-3 py-2">{item.ngay}</td>
              <td className="border-b px-3 py-2">{item.thu}</td>
              <td className="border-b px-3 py-2">{item.lop}</td>
              <td className="border-b px-3 py-2">
                <Badge tone={item.status === "worked" ? "success" : item.status === "absent" ? "warning" : "info"}>
                  {item.trangThai}
                </Badge>
              </td>
              <td className="border-b px-3 py-2">{item.tong}</td>
              <td className="border-b px-3 py-2">{item.lichSu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildSalarySlip(teacher: GiaoVien, salaryMonth: string, workHistory: WorkHistoryItem[], fuelAmount: number): SalarySlip {
  const scheduledDays = workHistory.filter((item) => item.status !== "off").length;
  const actualDays = workHistory.reduce((sum, item) => sum + item.tong, 0);
  const advance = 0;
  const deduction = 0;
  const reward = 300000;
  const takeHome = Math.round((teacher.luongCb / teacher.congChuan) * actualDays + teacher.phuCap + fuelAmount + reward - teacher.bhxh - advance - deduction);

  return {
    gv: teacher.ten,
    thang: salaryMonth,
    congTd: scheduledDays,
    congDc: actualDays - scheduledDays,
    tong: actualDays,
    luongCb: teacher.luongCb,
    bhxh: teacher.bhxh,
    phuCap: teacher.phuCap,
    tamUng: advance,
    tru: deduction,
    thucNhan: takeHome,
  };
}

function TeacherSalaryModal({ slip, onClose }: { slip: SalarySlip; onClose: () => void }) {
  const teacherIndex = Math.max(0, giaoVien.findIndex((item) => item.ten === slip.gv));
  const teacher = giaoVien[teacherIndex];
  const fuel = fuelMeta(teacher, teacherIndex);
  const reward = 300000;
  const sundayWork = 0;
  const mealAllowance = 0;
  const supportBhxh = 0;
  const totalAllowance = sundayWork + mealAllowance + slip.phuCap + fuel.amount + reward;
  const totalGross = slip.luongCb + supportBhxh + totalAllowance;
  const daysOff = Math.max(0, (teacher?.congChuan ?? 26) - slip.tong);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-2">
      <div className="w-full max-w-5xl rounded-md border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div>
            <div className="text-xs text-muted-foreground">Phiếu lương · {slip.thang}</div>
            <h2 className="text-base font-semibold">{slip.gv}</h2>
          </div>
          <Btn variant="secondary" onClick={onClose}>Đóng</Btn>
        </div>

        <div className="p-3">
          <div className="mx-auto rounded-lg border bg-background p-3 text-xs">
            <div className="rounded-md bg-primary/5 px-3 py-2 text-center">
              <div className="font-semibold uppercase text-muted-foreground">Mầm non Hoa Hướng Dương</div>
              <div className="text-lg font-bold">Phiếu chi lương</div>
            </div>

            <div className="mt-2 rounded-md border bg-card">
              <PayslipLine label="Họ và tên GV:" value={slip.gv} />
            </div>

            <div className="mt-2 grid gap-2 lg:grid-cols-2">
              <section className="rounded-md border bg-card">
                <PayslipSectionTitle>Thu nhập</PayslipSectionTitle>
                <PayslipLine label="Tiền lương:" value={formatVnd(slip.luongCb)} strong />
                <PayslipLine label="Tổng phụ cấp làm thêm" value={formatVnd(totalAllowance)} strong />
                <PayslipLine label="1. Làm chủ nhật" value={formatVnd(sundayWork)} />
                <PayslipLine label="2. Tiền bữa ăn chiều" value={formatVnd(mealAllowance)} />
                <PayslipLine label="3. Phụ cấp trách nhiệm" value={formatVnd(slip.phuCap)} />
                <PayslipLine label="4. PC xăng" value={formatVnd(fuel.amount)} />
                <PayslipLine label="5. Thưởng 30/4" value={formatVnd(reward)} />
                <PayslipLine label="Tổng bao gồm BHXH:" value={formatVnd(totalGross + slip.bhxh)} strong italic />
              </section>

              <section className="rounded-md border bg-card">
                <PayslipSectionTitle>Các khoản giảm trừ</PayslipSectionTitle>
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

            <div className="mt-2 flex items-center gap-5 rounded-md border bg-success/5 px-3 py-2">
              <InlineValue label="Thực lãnh cuối kỳ:" value={formatVnd(slip.thucNhan)} success />
              <InlineValue label="Bằng chữ:" value={moneyToWords(slip.thucNhan)} />
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
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
  italic = false,
  strong = false,
  success = false,
}: {
  label: string;
  value: string;
  title?: boolean;
  italic?: boolean;
  strong?: boolean;
  success?: boolean;
}) {
  return (
    <div className={`grid min-h-7 grid-cols-[1.3fr_1fr] gap-2 border-b px-3 py-1 last:border-b-0 ${title ? "bg-secondary/50" : ""}`}>
      <div className={`text-muted-foreground ${title ? "font-bold text-foreground" : ""} ${italic ? "italic" : ""}`}>{label}</div>
      <div className={`text-right ${strong ? "font-bold" : ""} ${success ? "text-success font-bold" : ""}`}>{value}</div>
    </div>
  );
}

function PayslipSectionTitle({ children }: { children: ReactNode }) {
  return <div className="border-b bg-secondary/40 px-3 py-1 font-semibold">{children}</div>;
}

function InlineValue({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={`truncate font-semibold ${success ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}

function SignatureBox({ label }: { label: string }) {
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-center">
      <div className="font-semibold text-muted-foreground">{label}</div>
      <div className="h-10" />
    </div>
  );
}

function buildWorkHistory(teacher: GiaoVien, className: string, salaryMonth: string, teacherIndex: number): WorkHistoryItem[] {
  const { month, year } = parseSalaryMonth(salaryMonth);
  const totalDays = new Date(year, month, 0).getDate();
  const currentClass = lopHoc.find((lop) => lop.ten === className || lop.gv.includes(teacher.ten));
  const teachingDays = scheduleToDaySet(currentClass?.lich ?? "T2-T6");
  const manualWorkdays = new Map(
    bangCong
      .filter((item) => item.gv === teacher.ten && item.ngay.startsWith(`${year}-${pad2(month)}-`))
      .map((item) => [item.ngay, item]),
  );
  const sampleAbsentDay = Math.min(totalDays, 7 + Math.max(teacherIndex, 0) * 3);

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month - 1, day);
    const ngay = `${year}-${pad2(month)}-${pad2(day)}`;
    const manual = manualWorkdays.get(ngay);

    if (manual) {
      const isAbsent = manual.tong <= 0;
      const editor = manual.nguoiSua ? ` · ${manual.nguoiSua}${manual.thoiGian ? ` ${manual.thoiGian}` : ""}` : "";
      return {
        ngay,
        thu: weekdayName(date),
        lop: manual.lop,
        trangThai: isAbsent ? "Nghỉ" : "Đi làm",
        status: isAbsent ? "absent" : "worked",
        tong: manual.tong,
        lichSu: manual.lyDo ? `${manual.lyDo}${editor}` : "Chấm công tự động theo lịch lớp",
      };
    }

    if (!teachingDays.has(date.getDay())) {
      return {
        ngay,
        thu: weekdayName(date),
        lop: currentClass?.ten ?? className,
        trangThai: "Không lịch",
        status: "off",
        tong: 0,
        lichSu: "Không có lịch dạy trong ngày này",
      };
    }

    const isSampleAbsent = day === sampleAbsentDay;
    return {
      ngay,
      thu: weekdayName(date),
      lop: currentClass?.ten ?? className,
      trangThai: isSampleAbsent ? "Nghỉ" : "Đi làm",
      status: isSampleAbsent ? "absent" : "worked",
      tong: isSampleAbsent ? 0 : 1,
      lichSu: isSampleAbsent ? "Nghỉ có phép · Admin cập nhật cuối ngày" : "Đi làm theo lịch lớp · hệ thống ghi nhận",
    };
  });
}

function parseSalaryMonth(salaryMonth: string) {
  const [month, year] = salaryMonth.split("/").map(Number);
  return { month, year };
}

function scheduleToDaySet(schedule: string) {
  const days = new Set<number>();
  const normalized = schedule.toUpperCase();
  if (normalized.includes("T2")) days.add(1);
  if (normalized.includes("T3")) days.add(2);
  if (normalized.includes("T4")) days.add(3);
  if (normalized.includes("T5")) days.add(4);
  if (normalized.includes("T6")) days.add(5);
  if (normalized.includes("T7")) days.add(6);
  if (normalized.includes("CN")) days.add(0);
  if (normalized.includes("T2-T6")) [1, 2, 3, 4, 5].forEach((day) => days.add(day));
  if (normalized.includes("T2-T7")) [1, 2, 3, 4, 5, 6].forEach((day) => days.add(day));
  return days;
}

function weekdayName(date: Date) {
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
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

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <div className="text-xs uppercase text-muted-foreground">{label}</div>
          <div className="font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}

function fuelMeta(teacher: GiaoVien, index: number) {
  const source = teacher as GiaoVien & {
    phuCapXang?: number;
    khoangCachKm?: number;
    cong2Chieu?: number;
    soNgayThang?: number;
    binhQuanKm?: number;
  };
  const distanceKm = source.khoangCachKm ?? [7, 6, 8, 5, 8][Math.max(index, 0)] ?? 6;
  return {
    distanceKm,
    roundTripKm: source.cong2Chieu ?? distanceKm * 2,
    daysPerMonth: source.soNgayThang ?? teacher.congChuan,
    averagePerKm: source.binhQuanKm ?? 2400,
    amount: source.phuCapXang ?? [420000, 360000, 520000, 300000, 480000][Math.max(index, 0)] ?? 360000,
  };
}

function fuelAllowance(teacher: GiaoVien, index: number) {
  return fuelMeta(teacher, index).amount;
}

function totalIncome(teacher: GiaoVien, salary: (typeof phieuLuong)[number] | undefined, fuelAmount: number) {
  return teacher.luongCb + teacher.phuCap + fuelAmount + ((salary as { thuong?: number } | undefined)?.thuong ?? 300000);
}
