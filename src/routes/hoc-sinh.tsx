import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Info, Settings2, Trash2 } from "lucide-react";
import { Badge, Btn, DataTable, Input, PageToolbar, Select } from "@/components/ui-bits";
import { Checkbox } from "@/components/ui/checkbox";
import { hocSinh, lopHoc } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-sinh")({ component: Page });

type HocSinh = (typeof hocSinh)[number];

const NO_SERVICE = "Chưa đăng ký";
const inputCls =
  "w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-400 transition-colors";

function SvcRow({
  checked,
  onToggle,
  label,
  price,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  price?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-md border transition-all ${
        checked ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2 min-w-0">
          <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none h-4 w-4" />
          <span className="font-semibold text-gray-800 text-xs leading-tight">{label}</span>
        </div>
        {price && <span className="font-bold text-blue-600 text-xs whitespace-nowrap">{price}</span>}
      </div>
      {children && <div className="px-2 pb-2 border-t border-dashed border-gray-200 pt-1.5">{children}</div>}
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-600 mb-0.5">{children}</label>;
}

function Page() {
  const [students, setStudents] = useState<HocSinh[]>(hocSinh);
  const [selectedClass, setSelectedClass] = useState("Tất cả lớp");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [editForm, setEditForm] = useState<HocSinh | null>(null);
  const [popupMode, setPopupMode] = useState<"add" | "edit">("edit");
  const [tempServices, setTempServices] = useState<string[]>([]);
  const [confirmDeleteMa, setConfirmDeleteMa] = useState<string | null>(null);
  const confirmDeleteStudent = students.find((s) => s.ma === confirmDeleteMa);

  useEffect(() => {
    if (editForm === null && confirmDeleteMa === null) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [editForm, confirmDeleteMa]);

  const openAddForm = () => {
    const next = students.length + 1;
    setPopupMode("add");
    setEditForm({
      ma: `HS${String(next).padStart(3, "0")}`,
      ten: "",
      lop: lopHoc[0].ten,
      ns: "",
      ph: "",
      sdt: "",
      trangThai: "Đang học",
      goi: "Tháng",
      dv: NO_SERVICE,
      ghiChu: "",
    });
    setTempServices([]);
  };

  const handleOpenStudent = (student: HocSinh) => {
    setPopupMode("edit");
    setEditForm({ ...student });
    const services =
      student.dv && student.dv !== NO_SERVICE && student.dv !== "-"
        ? student.dv.split(", ").map((service) => service.trim())
        : [];
    setTempServices(services);
  };

  const closePopup = () => setEditForm(null);

  const deleteStudent = (ma: string) => setStudents((items) => items.filter((item) => item.ma !== ma));

  const handleSaveAll = () => {
    if (!editForm) return;
    const dv = tempServices.length > 0 ? tempServices.join(", ") : NO_SERVICE;
    if (popupMode === "add") {
      setStudents((prev) => [{ ...editForm, dv }, ...prev]);
    } else {
      setStudents((prev) => prev.map((student) => (student.ma === editForm.ma ? { ...editForm, dv } : student)));
    }
    closePopup();
  };

  const toggle = (name: string) =>
    setTempServices((prev) => (prev.includes(name) ? prev.filter((service) => service !== name) : [...prev, name]));

  const isAnChieu = tempServices.includes("Ăn chiều");
  const isDuaRuoc = tempServices.includes("Đưa rước");
  const isPhuPhi = tempServices.includes("Phụ phí");
  const isGiuNgoai = tempServices.includes("Giữ ngoài giờ");
  const isGiuCN = tempServices.includes("Giữ ngày Chủ Nhật");

  const isDongPhuc = tempServices.some((service) => service.startsWith("Đồng phục"));
  const dongPhucBo = [4, 3, 2, 1].find((n) => tempServices.includes(`Đồng phục (${n} bộ)`)) ?? 1;
  const toggleDongPhuc = () => {
    if (isDongPhuc) setTempServices((prev) => prev.filter((service) => !service.startsWith("Đồng phục")));
    else setTempServices((prev) => [...prev, "Đồng phục (1 bộ)"]);
  };
  const changeDongPhuc = (n: number) =>
    setTempServices((prev) => [
      ...prev.filter((service) => !service.startsWith("Đồng phục")),
      `Đồng phục (${n} bộ)`,
    ]);

  const isCoSoVC = tempServices.some((service) => service.startsWith("Cơ sở vật chất"));
  const coSoOpt = tempServices.includes("Cơ sở vật chất (6 tháng)") ? "6 tháng" : "Năm";
  const toggleCoSoVC = () => {
    if (isCoSoVC) setTempServices((prev) => prev.filter((service) => !service.startsWith("Cơ sở vật chất")));
    else setTempServices((prev) => [...prev, "Cơ sở vật chất (Năm)"]);
  };
  const changeCoSo = (opt: "Năm" | "6 tháng") =>
    setTempServices((prev) => [
      ...prev.filter((service) => !service.startsWith("Cơ sở vật chất")),
      `Cơ sở vật chất (${opt})`,
    ]);

  const isTamBe = tempServices.some((service) => service.startsWith("Tắm bé"));
  const tamBeOpt = tempServices.includes("Tắm bé (Theo lần)") ? "Theo lần" : "Theo tháng";
  const toggleTamBe = () => {
    if (isTamBe) setTempServices((prev) => prev.filter((service) => !service.startsWith("Tắm bé")));
    else setTempServices((prev) => [...prev, "Tắm bé (Theo tháng)"]);
  };
  const changeTamBe = (opt: "Theo tháng" | "Theo lần") =>
    setTempServices((prev) => [
      ...prev.filter((service) => !service.startsWith("Tắm bé")),
      `Tắm bé (${opt})`,
    ]);

  const isCamera = tempServices.some((service) => service.startsWith("Camera"));
  const camOpt = tempServices.includes("Camera (3 cam)")
    ? "3 cam"
    : tempServices.includes("Camera (2 cam)")
      ? "2 cam"
      : "1 cam";
  const toggleCamera = () => {
    if (isCamera) setTempServices((prev) => prev.filter((service) => !service.startsWith("Camera")));
    else setTempServices((prev) => [...prev, "Camera (1 cam)"]);
  };
  const changeCam = (opt: "1 cam" | "2 cam" | "3 cam") =>
    setTempServices((prev) => [...prev.filter((service) => !service.startsWith("Camera")), `Camera (${opt})`]);

  const filteredStudents = students.filter((student) => {
    const matchClass = selectedClass === "Tất cả lớp" || student.lop === selectedClass;
    const matchStatus = selectedStatus === "Tất cả trạng thái" || student.trangThai === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      student.ten.toLowerCase().includes(q) ||
      student.ma.toLowerCase().includes(q) ||
      student.ph.toLowerCase().includes(q) ||
      student.sdt.includes(searchQuery);
    return matchClass && matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedStudents = filteredStudents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); };

  return (
    <div>
      <PageToolbar>
        <Select value={selectedClass} onChange={(e: any) => handleFilterChange(() => setSelectedClass(e.target.value))}>
          <option value="Tất cả lớp">Tất cả lớp</option>
          {lopHoc.map((lop) => (
            <option key={lop.ma} value={lop.ten}>
              {lop.ten}
            </option>
          ))}
        </Select>
        <Select value={selectedStatus} onChange={(e: any) => handleFilterChange(() => setSelectedStatus(e.target.value))}>
          <option value="Tất cả trạng thái">Tất cả trạng thái</option>
          <option value="Đang học">Đang học</option>
          <option value="Bảo lưu">Bảo lưu</option>
          <option value="Nghỉ học">Nghỉ học</option>
        </Select>
        <Input placeholder="Tìm học sinh..." value={searchQuery} onChange={(e: any) => handleFilterChange(() => setSearchQuery(e.target.value))} />
        <div className="flex-1" />
        <Btn onClick={openAddForm}>+ Thêm học sinh</Btn>
      </PageToolbar>

      <DataTable
        headers={["Mã HS", "Họ tên bé", "Lớp", "Phụ huynh", "SĐT", "Trạng thái", "Gói", "Ghi chú", "Thao tác"]}
        onRowClick={(index) => handleOpenStudent(pagedStudents[index])}
        rows={pagedStudents.map((student) => [
          <span className="font-medium text-primary">{student.ma}</span>,
          <span className="font-semibold">{student.ten}</span>,
          student.lop,
          student.ph,
          student.sdt,
          <Badge tone={student.trangThai === "Đang học" ? "success" : student.trangThai === "Bảo lưu" ? "warning" : "default"}>
            {student.trangThai}
          </Badge>,
          student.goi,
          student.ghiChu || "-",
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDeleteMa(student.ma);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Xóa học sinh"
          >
            <Trash2 className="h-4 w-4" />
          </button>,
        ])}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3">
          <span className="text-xs text-gray-500">
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredStudents.length)} / {filteredStudents.length} học sinh
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

      {editForm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePopup} />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[calc(100vh-1rem)] flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-base font-bold flex-shrink-0">
                  {popupMode === "add" ? "+" : (editForm.ten?.[0] ?? "B")}
                </span>
                <span>{popupMode === "add" ? "Thêm học sinh mới" : editForm.ten}</span>
                {popupMode === "edit" && <span className="text-base font-normal text-gray-400">- {editForm.ma}</span>}
                <button
                  onClick={closePopup}
                  className="ml-auto p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  aria-label="Đóng"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="grid h-full grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="px-6 py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-bold text-gray-800">Thông tin học sinh</span>
                  </div>

                  <div>
                    <FieldLabel>Họ và tên bé</FieldLabel>
                    <input
                      className={inputCls}
                      value={editForm.ten}
                      onChange={(e) => setEditForm((form) => form && { ...form, ten: e.target.value })}
                      placeholder="Nhập họ tên..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Lớp học</FieldLabel>
                      <select
                        className={inputCls}
                        value={editForm.lop}
                        onChange={(e) => setEditForm((form) => form && { ...form, lop: e.target.value })}
                      >
                        {lopHoc.map((lop) => (
                          <option key={lop.ma} value={lop.ten}>
                            {lop.ten}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Ngày sinh</FieldLabel>
                      <input
                        type="date"
                        className={inputCls}
                        value={editForm.ns}
                        onChange={(e) => setEditForm((form) => form && { ...form, ns: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Phụ huynh</FieldLabel>
                      <input
                        className={inputCls}
                        value={editForm.ph}
                        onChange={(e) => setEditForm((form) => form && { ...form, ph: e.target.value })}
                        placeholder="Tên phụ huynh..."
                      />
                    </div>
                    <div>
                      <FieldLabel>Số điện thoại</FieldLabel>
                      <input
                        className={inputCls}
                        value={editForm.sdt}
                        onChange={(e) => setEditForm((form) => form && { ...form, sdt: e.target.value })}
                        placeholder="0900..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Trạng thái</FieldLabel>
                      <select
                        className={inputCls}
                        value={editForm.trangThai}
                        onChange={(e) => setEditForm((form) => form && { ...form, trangThai: e.target.value })}
                      >
                        <option>Đang học</option>
                        <option>Bảo lưu</option>
                        <option>Nghỉ học</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Gói học phí</FieldLabel>
                      <select
                        className={inputCls}
                        value={editForm.goi}
                        onChange={(e) => setEditForm((form) => form && { ...form, goi: e.target.value })}
                      >
                        <option>Tháng</option>
                        <option>Quý</option>
                        <option>Năm</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Học phí / tháng</FieldLabel>
                    <div className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 font-mono">
                      800.000 đ
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Ghi chú</FieldLabel>
                    <textarea
                      rows={1}
                      className={inputCls + " resize-none"}
                      value={editForm.ghiChu ?? ""}
                      onChange={(e) => setEditForm((form) => form && { ...form, ghiChu: e.target.value })}
                      placeholder="Ghi chú thêm..."
                    />
                  </div>
                </div>

                <div className="px-6 py-3 space-y-2 bg-gray-50/60 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-bold text-gray-800">Dịch vụ</span>
                    </div>
                    {tempServices.length > 0 && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {tempServices.length} dịch vụ
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <SvcRow checked={isAnChieu} onToggle={() => toggle("Ăn chiều")} label="Ăn chiều" price="15.000đ/ngày" />
                    <SvcRow checked={isDuaRuoc} onToggle={() => toggle("Đưa rước")} label="Đưa rước" price="300.000đ/tháng" />
                    <SvcRow checked={isPhuPhi} onToggle={() => toggle("Phụ phí")} label="Phụ phí" price="100.000đ/tháng" />
                  </div>

                  <SvcRow
                    checked={isCoSoVC}
                    onToggle={toggleCoSoVC}
                    label="Cơ sở vật chất"
                    price={isCoSoVC ? (coSoOpt === "Năm" ? "300.000đ/năm" : "150.000đ/6 tháng") : "300k/năm - 150k/6th"}
                  >
                    <div className="flex gap-4 pt-0.5">
                      {(["Năm", "6 tháng"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCoSoVC) toggleCoSoVC();
                            changeCoSo(opt);
                          }}
                        >
                          <input type="radio" name="coSoOpt" checked={isCoSoVC && coSoOpt === opt} onChange={() => {}} className="accent-blue-500 h-3.5 w-3.5" />
                          <span className={`text-xs ${isCoSoVC && coSoOpt === opt ? "font-bold text-blue-600" : "text-gray-500"}`}>
                            {opt === "Năm" ? "Cả năm - 300.000đ" : "6 tháng - 150.000đ"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </SvcRow>

                  <SvcRow checked={isDongPhuc} onToggle={toggleDongPhuc} label="Đồng phục">
                    <div className="grid grid-cols-4 gap-2 pt-0.5">
                      {[1, 2, 3, 4].map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDongPhuc) toggleDongPhuc();
                            changeDongPhuc(n);
                          }}
                        >
                          <input type="radio" name="dongPhucOpt" checked={isDongPhuc && dongPhucBo === n} onChange={() => {}} className="accent-blue-500 h-3.5 w-3.5" />
                          <span className={`text-xs ${isDongPhuc && dongPhucBo === n ? "font-bold text-blue-600" : "text-gray-500"}`}>{n} bộ</span>
                        </label>
                      ))}
                    </div>
                  </SvcRow>

                  <div className="rounded-md border border-gray-200 bg-white p-2">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phụ phí ngoài giờ</div>
                    <div className="grid grid-cols-2 gap-2">
                      <SvcRow checked={isGiuNgoai} onToggle={() => toggle("Giữ ngoài giờ")} label="Giữ ngoài giờ" price="30.000đ/buổi" />
                      <SvcRow checked={isGiuCN} onToggle={() => toggle("Giữ ngày Chủ Nhật")} label="Giữ Chủ Nhật" price="100.000đ/ngày" />
                    </div>
                  </div>

                  <SvcRow
                    checked={isTamBe}
                    onToggle={toggleTamBe}
                    label="Tắm bé"
                    price={isTamBe ? (tamBeOpt === "Theo tháng" ? "200.000đ/tháng" : "10.000đ/lần") : "200k/tháng - 10k/lần"}
                  >
                    <div className="flex gap-4 pt-0.5">
                      {(["Theo tháng", "Theo lần"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isTamBe) toggleTamBe();
                            changeTamBe(opt);
                          }}
                        >
                          <input type="radio" name="tamBeOpt" checked={isTamBe && tamBeOpt === opt} onChange={() => {}} className="accent-blue-500 h-3.5 w-3.5" />
                          <span className={`text-xs ${isTamBe && tamBeOpt === opt ? "font-bold text-blue-600" : "text-gray-500"}`}>
                            {opt === "Theo tháng" ? "Theo tháng - 200.000đ" : "Theo lần - 10.000đ"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </SvcRow>

                  <SvcRow
                    checked={isCamera}
                    onToggle={toggleCamera}
                    label="Camera giám sát"
                    price={isCamera ? (camOpt === "1 cam" ? "50.000đ/tháng" : camOpt === "2 cam" ? "75.000đ/tháng" : "100.000đ/tháng") : "50k - 100k/tháng"}
                  >
                    <div className="flex gap-4 pt-0.5">
                      {([
                        ["1 cam", "1 Cam - 50.000đ"],
                        ["2 cam", "2 Cam - 75.000đ"],
                        ["3 cam", "3 Cam - 100.000đ"],
                      ] as const).map(([val, label]) => (
                        <label
                          key={val}
                          className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCamera) toggleCamera();
                            changeCam(val);
                          }}
                        >
                          <input type="radio" name="camOpt" checked={isCamera && camOpt === val} onChange={() => {}} className="accent-blue-500 h-3.5 w-3.5" />
                          <span className={`text-xs ${isCamera && camOpt === val ? "font-bold text-blue-600" : "text-gray-500"}`}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </SvcRow>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 flex-shrink-0 flex justify-end gap-3 bg-white rounded-b-xl">
              <Btn variant="secondary" onClick={closePopup} className="px-6">
                Hủy
              </Btn>
              <Btn onClick={handleSaveAll} className="px-8">
                {popupMode === "add" ? "Thêm học sinh" : "Lưu thay đổi"}
              </Btn>
            </div>
          </div>
        </div>
      )}

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
                Bạn có chắc muốn xóa học sinh <span className="font-semibold text-gray-800">{confirmDeleteStudent?.ten}</span> không? Hành động này không thể hoàn tác.
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
                onClick={() => {
                  if (confirmDeleteMa) deleteStudent(confirmDeleteMa);
                  setConfirmDeleteMa(null);
                }}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                OK, xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
