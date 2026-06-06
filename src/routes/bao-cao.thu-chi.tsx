import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, DataTable, Input, PageToolbar, Select } from "@/components/ui-bits";
import { formatVnd, phieuBaoPhi, phieuLuong } from "@/lib/mock-data";

export const Route = createFileRoute("/bao-cao/thu-chi")({ component: Page });

type CashType = "Thu" | "Chi";
type CashRow = {
  ma: string;
  ngay: string;
  loai: CashType;
  nhom: "Thu học phí" | "Chi lương" | "Chi mặt bằng" | "Chi phí";
  noiDung: string;
  soTien: number;
  nguon: "Tự động" | "Nhập tay";
  nguoi: string;
  ghiChu: string;
};

type CashForm = {
  ngay: string;
  loai: CashType;
  nhom: CashRow["nhom"];
  noiDung: string;
  soTien: string;
  nguoi: string;
  ghiChu: string;
};

const PAGE_SIZE = 10;
const MONTHS = ["04/2026", "05/2026", "06/2026"];

const manualTransactions: CashRow[] = [
  { ma: "TC014", ngay: "2026-06-04", loai: "Chi", nhom: "Chi mặt bằng", noiDung: "Thanh toán tiền thuê mặt bằng tháng 06", soTien: 18000000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "Hợp đồng HHD-2026" },
  { ma: "TC015", ngay: "2026-06-05", loai: "Chi", nhom: "Chi phí", noiDung: "Mua thực phẩm tuần 1", soTien: 3200000, nguon: "Nhập tay", nguoi: "Bếp trưởng", ghiChu: "Có hóa đơn" },
  { ma: "TC016", ngay: "2026-06-08", loai: "Chi", nhom: "Chi phí", noiDung: "Điện nước tháng 05", soTien: 1850000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "Thanh toán qua ngân hàng" },
  { ma: "TC017", ngay: "2026-06-10", loai: "Chi", nhom: "Chi phí", noiDung: "Văn phòng phẩm và đồ dùng lớp", soTien: 1250000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "" },
  { ma: "TC018", ngay: "2026-06-12", loai: "Chi", nhom: "Chi phí", noiDung: "Sửa điều hòa phòng Lá", soTien: 900000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "Bảo trì định kỳ" },
  { ma: "TC019", ngay: "2026-06-18", loai: "Chi", nhom: "Chi phí", noiDung: "Mua đồ chơi vận động", soTien: 2450000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "Khu vui chơi" },
  { ma: "TC020", ngay: "2026-06-24", loai: "Chi", nhom: "Chi phí", noiDung: "Vệ sinh, khử khuẩn lớp học", soTien: 760000, nguon: "Nhập tay", nguoi: "Admin", ghiChu: "" },
];

function Page() {
  const [selectedMonth, setSelectedMonth] = useState("06/2026");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState<"Tất cả" | CashType>("Tất cả");
  const [selectedGroup, setSelectedGroup] = useState("Tất cả nhóm");
  const [currentPage, setCurrentPage] = useState(1);
  const [manualRows, setManualRows] = useState<CashRow[]>(manualTransactions);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<CashForm>({
    ngay: "2026-06-27",
    loai: "Chi",
    nhom: "Chi phí",
    noiDung: "",
    soTien: "",
    nguoi: "Admin",
    ghiChu: "",
  });

  useEffect(() => {
    if (!isAddOpen) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isAddOpen]);

  const rows = useMemo(() => buildCashRows(manualRows), [manualRows]);
  const groups = useMemo(() => ["Tất cả nhóm", ...Array.from(new Set(rows.map((row) => row.nhom)))], [rows]);
  const filteredRows = useMemo(() => {
    const [month, year] = selectedMonth.split("/");
    return rows.filter((row) => {
      const matchMonth = row.ngay.slice(0, 7) === `${year}-${month}`;
      const matchDate = selectedDate === "" || row.ngay === selectedDate;
      const matchType = selectedType === "Tất cả" || row.loai === selectedType;
      const matchGroup = selectedGroup === "Tất cả nhóm" || row.nhom === selectedGroup;
      return matchMonth && matchDate && matchType && matchGroup;
    });
  }, [rows, selectedDate, selectedGroup, selectedMonth, selectedType]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const totalThu = filteredRows.filter((row) => row.loai === "Thu").reduce((sum, row) => sum + row.soTien, 0);
  const totalChi = filteredRows.filter((row) => row.loai === "Chi").reduce((sum, row) => sum + row.soTien, 0);

  const handleFilter = (fn: () => void) => {
    fn();
    setCurrentPage(1);
  };

  const openAdd = () => {
    const [month, year] = selectedMonth.split("/");
    setForm({
      ngay: selectedDate || `${year}-${month}-27`,
      loai: "Chi",
      nhom: "Chi phí",
      noiDung: "",
      soTien: "",
      nguoi: "Admin",
      ghiChu: "",
    });
    setIsAddOpen(true);
  };

  const saveManualTransaction = () => {
    const amount = Number(form.soTien.replace(/[^\d]/g, ""));
    if (!form.ngay || !form.noiDung.trim() || amount <= 0) return;
    const nextNumber =
      Math.max(
        0,
        ...rows.map((row) => Number(row.ma.replace(/\D/g, ""))).filter((num) => Number.isFinite(num)),
      ) + 1;
    const newRow: CashRow = {
      ma: `TC${String(nextNumber).padStart(3, "0")}`,
      ngay: form.ngay,
      loai: form.loai,
      nhom: form.nhom,
      noiDung: form.noiDung.trim(),
      soTien: amount,
      nguon: "Nhập tay",
      nguoi: form.nguoi.trim() || "Admin",
      ghiChu: form.ghiChu.trim(),
    };
    setManualRows((items) => [...items, newRow]);
    setSelectedMonth(`${form.ngay.slice(5, 7)}/${form.ngay.slice(0, 4)}`);
    setSelectedDate("");
    setSelectedType("Tất cả");
    setSelectedGroup("Tất cả nhóm");
    setCurrentPage(1);
    setIsAddOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <PageToolbar>
        <Select value={selectedMonth} onChange={(event: any) => handleFilter(() => setSelectedMonth(event.target.value))}>
          {MONTHS.map((month) => <option key={month}>{month}</option>)}
        </Select>
        <Input type="date" value={selectedDate} onChange={(event: any) => handleFilter(() => setSelectedDate(event.target.value))} />
        <Select value={selectedType} onChange={(event: any) => handleFilter(() => setSelectedType(event.target.value))}>
          <option>Tất cả</option>
          <option>Thu</option>
          <option>Chi</option>
        </Select>
        <Select value={selectedGroup} onChange={(event: any) => handleFilter(() => setSelectedGroup(event.target.value))}>
          {groups.map((group) => <option key={group}>{group}</option>)}
        </Select>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-md border border-green-200 bg-green-50 px-2 py-1 font-semibold text-green-700">Thu: {formatVnd(totalThu)}</span>
          <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 font-semibold text-red-700">Chi: {formatVnd(totalChi)}</span>
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 font-semibold text-blue-700">Còn: {formatVnd(totalThu - totalChi)}</span>
        </div>
        <Btn onClick={openAdd}>Thêm giao dịch</Btn>
      </PageToolbar>

      <div className="min-h-0 flex-1">
        <DataTable
          headers={["Mã GD", "Ngày", "Loại", "Nhóm", "Nội dung", "Số tiền", "Nguồn", "Người cập nhật", "Ghi chú"]}
          rows={pagedRows.map((row) => [
            <span className="font-medium text-primary">{row.ma}</span>,
            row.ngay,
            <Badge tone={row.loai === "Thu" ? "success" : "danger"}>{row.loai}</Badge>,
            row.nhom,
            <span className="font-medium">{row.noiDung}</span>,
            <span className={`font-semibold ${row.loai === "Thu" ? "text-success" : "text-destructive"}`}>
              {row.loai === "Thu" ? "+" : "-"}{formatVnd(row.soTien)}
            </span>,
            <Badge tone={row.nguon === "Tự động" ? "info" : "default"}>{row.nguon}</Badge>,
            row.nguoi,
            row.ghiChu || "-",
          ])}
        />

        <div className="flex items-center justify-between px-1 py-3">
          <span className="text-xs text-gray-500">
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredRows.length)} /{" "}
            {filteredRows.length} giao dịch
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹ Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  safePage === page ? "bg-blue-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau ›
            </button>
          </div>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <div className="text-xs text-muted-foreground">Giao dịch nhập tay</div>
                <h2 className="text-lg font-semibold">Thêm giao dịch thu chi</h2>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>

            <div className="grid gap-3 p-5 md:grid-cols-2">
              <label className="space-y-1 text-sm font-medium">
                <span>Ngày giao dịch</span>
                <Input type="date" value={form.ngay} onChange={(event: any) => setForm((prev) => ({ ...prev, ngay: event.target.value }))} />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Loại</span>
                <Select
                  value={form.loai}
                  onChange={(event: any) =>
                    setForm((prev) => ({
                      ...prev,
                      loai: event.target.value,
                      nhom: event.target.value === "Thu" ? "Thu học phí" : "Chi phí",
                    }))
                  }
                >
                  <option>Thu</option>
                  <option>Chi</option>
                </Select>
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Nhóm</span>
                <Select value={form.nhom} onChange={(event: any) => setForm((prev) => ({ ...prev, nhom: event.target.value }))}>
                  {form.loai === "Thu" ? (
                    <option>Thu học phí</option>
                  ) : (
                    <>
                      <option>Chi phí</option>
                      <option>Chi mặt bằng</option>
                    </>
                  )}
                </Select>
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Số tiền</span>
                <Input
                  inputMode="numeric"
                  placeholder="Ví dụ: 1500000"
                  value={form.soTien}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, soTien: event.target.value }))}
                />
              </label>
              <label className="space-y-1 text-sm font-medium md:col-span-2">
                <span>Nội dung</span>
                <Input
                  placeholder="Ví dụ: Mua đồ dùng lớp Chồi"
                  value={form.noiDung}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, noiDung: event.target.value }))}
                />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Người cập nhật</span>
                <Input value={form.nguoi} onChange={(event: any) => setForm((prev) => ({ ...prev, nguoi: event.target.value }))} />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Ghi chú</span>
                <Input
                  placeholder="Hóa đơn, lý do, ghi chú..."
                  value={form.ghiChu}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, ghiChu: event.target.value }))}
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <Btn variant="secondary" onClick={() => setIsAddOpen(false)}>Hủy</Btn>
              <Btn onClick={saveManualTransaction}>Lưu giao dịch</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildCashRows(extraManualRows: CashRow[]): CashRow[] {
  const tuitionRows: CashRow[] = phieuBaoPhi.slice(0, 8).map((item, index) => ({
    ma: `TC${String(index + 1).padStart(3, "0")}`,
    ngay: `2026-06-${String(index + 1).padStart(2, "0")}`,
    loai: "Thu",
    nhom: "Thu học phí",
    noiDung: `Thu học phí ${item.thang} - ${item.hs}`,
    soTien: item.daThu,
    nguon: "Tự động",
    nguoi: "Hệ thống",
    ghiChu: item.trangThai,
  }));

  const salaryRows: CashRow[] = phieuLuong.map((item, index) => ({
    ma: `TC${String(index + 9).padStart(3, "0")}`,
    ngay: `2026-06-${String(index + 25).padStart(2, "0")}`,
    loai: "Chi",
    nhom: "Chi lương",
    noiDung: `Chi lương ${item.thang} - ${item.gv}`,
    soTien: item.thucNhan,
    nguon: "Tự động",
    nguoi: "Hệ thống",
    ghiChu: "Từ bảng lương đã tính",
  }));

  return [...tuitionRows, ...salaryRows, ...extraManualRows].sort((a, b) => a.ngay.localeCompare(b.ngay));
}
