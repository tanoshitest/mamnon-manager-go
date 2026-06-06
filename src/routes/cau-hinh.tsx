import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge, Btn, DataTable, Input, PageToolbar, Select } from "@/components/ui-bits";
import { dichVu, formatVnd } from "@/lib/mock-data";

export const Route = createFileRoute("/cau-hinh")({ component: Page });

function Page() {
  return (
    <div>
      <ServiceConfig />
    </div>
  );
}

function ServiceConfig() {
  const [services, setServices] = useState(dichVu);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteMa, setDeleteMa] = useState<string | null>(null);
  const [form, setForm] = useState({
    ma: "",
    ten: "",
    kieu: "Theo tháng",
    gia: "",
    tinhPhi: true,
    gvGhiNhan: false,
    trangThai: "Đang dùng",
  });
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedServices = services.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const deleteService = services.find((item) => item.ma === deleteMa);

  useEffect(() => {
    if (!isAddOpen && deleteMa === null) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [deleteMa, isAddOpen]);

  const openAdd = () => {
    const nextNumber = services.length + 1;
    setForm({
      ma: `DV${String(nextNumber).padStart(2, "0")}`,
      ten: "",
      kieu: "Theo tháng",
      gia: "",
      tinhPhi: true,
      gvGhiNhan: false,
      trangThai: "Đang dùng",
    });
    setIsAddOpen(true);
  };

  const saveService = () => {
    const price = Number(form.gia.replace(/[^\d]/g, ""));
    if (!form.ma.trim() || !form.ten.trim() || price <= 0) return;
    setServices((items) => [
      {
        ma: form.ma.trim(),
        ten: form.ten.trim(),
        kieu: form.kieu,
        gia: price,
        tinhPhi: form.tinhPhi,
        gvGhiNhan: form.gvGhiNhan,
        trangThai: form.trangThai,
      },
      ...items,
    ]);
    setCurrentPage(1);
    setIsAddOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteMa) return;
    setServices((items) => items.filter((item) => item.ma !== deleteMa));
    setDeleteMa(null);
    setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil((services.length - 1) / PAGE_SIZE))));
  };

  return (
    <div>
      <PageToolbar>
        <div className="flex-1" />
        <Btn onClick={openAdd}>Thêm dịch vụ</Btn>
      </PageToolbar>

      <DataTable
        headers={[
          "Mã DV",
          "Tên dịch vụ",
          "Kiểu tính",
          "Đơn giá",
          "Tính vào học phí",
          "GV ghi nhận",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={pagedServices.map((item) => [
          item.ma,
          <span className="font-medium">{item.ten}</span>,
          item.kieu,
          formatVnd(item.gia),
          item.tinhPhi ? <Badge tone="success">Có</Badge> : <Badge>Không</Badge>,
          item.gvGhiNhan ? <Badge tone="info">Cho phép</Badge> : <Badge>Không</Badge>,
          <Badge tone="success">{item.trangThai}</Badge>,
          <div className="flex gap-1">
            <Btn variant="ghost">Sửa</Btn>
            <button
              onClick={() => setDeleteMa(item.ma)}
              className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
              title="Xóa dịch vụ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>,
        ])}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3">
          <span className="text-xs text-gray-500">
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, services.length)} /{" "}
            {services.length} dịch vụ
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
      )}

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <div className="text-xs text-muted-foreground">Dịch vụ</div>
                <h2 className="text-lg font-semibold">Thêm dịch vụ mới</h2>
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
                <span>Mã dịch vụ</span>
                <Input value={form.ma} onChange={(event: any) => setForm((prev) => ({ ...prev, ma: event.target.value }))} />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Tên dịch vụ</span>
                <Input
                  placeholder="Ví dụ: Sữa tươi"
                  value={form.ten}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, ten: event.target.value }))}
                />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Kiểu tính</span>
                <Select value={form.kieu} onChange={(event: any) => setForm((prev) => ({ ...prev, kieu: event.target.value }))}>
                  <option>Theo ngày</option>
                  <option>Theo tháng</option>
                  <option>Theo lần</option>
                  <option>Theo buổi</option>
                  <option>Theo năm</option>
                  <option>Theo bộ</option>
                </Select>
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Đơn giá</span>
                <Input
                  inputMode="numeric"
                  placeholder="Ví dụ: 50000"
                  value={form.gia}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, gia: event.target.value }))}
                />
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>Tính vào học phí</span>
                <Select
                  value={form.tinhPhi ? "Có" : "Không"}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, tinhPhi: event.target.value === "Có" }))}
                >
                  <option>Có</option>
                  <option>Không</option>
                </Select>
              </label>
              <label className="space-y-1 text-sm font-medium">
                <span>GV ghi nhận</span>
                <Select
                  value={form.gvGhiNhan ? "Cho phép" : "Không"}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, gvGhiNhan: event.target.value === "Cho phép" }))}
                >
                  <option>Cho phép</option>
                  <option>Không</option>
                </Select>
              </label>
              <label className="space-y-1 text-sm font-medium md:col-span-2">
                <span>Trạng thái</span>
                <Select
                  value={form.trangThai}
                  onChange={(event: any) => setForm((prev) => ({ ...prev, trangThai: event.target.value }))}
                >
                  <option>Đang dùng</option>
                  <option>Tạm ngưng</option>
                </Select>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <Btn variant="secondary" onClick={() => setIsAddOpen(false)}>Hủy</Btn>
              <Btn onClick={saveService}>Lưu dịch vụ</Btn>
            </div>
          </div>
        </div>
      )}

      {deleteService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setDeleteMa(null)} />
          <div className="relative w-full max-w-md rounded-lg border bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-500">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Xóa dịch vụ</h2>
                <p className="text-sm text-gray-500">Thao tác này chỉ xóa trong dữ liệu demo.</p>
              </div>
            </div>
            <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm">
              <div className="font-semibold">{deleteService.ten}</div>
              <div className="text-gray-500">{deleteService.ma} · {formatVnd(deleteService.gia)}</div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setDeleteMa(null)}>Hủy</Btn>
              <Btn variant="danger" onClick={confirmDelete}>Xóa</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
