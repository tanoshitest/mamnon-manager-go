import { createFileRoute } from "@tanstack/react-router";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Printer, QrCode, X } from "lucide-react";
import { Badge, Btn, Card, DataTable, PageToolbar, Select } from "@/components/ui-bits";
import { formatVnd, hocSinh, phieuBaoPhi } from "@/lib/mock-data";

export const Route = createFileRoute("/hoc-phi/danh-sach")({ component: Page });

type FeeRecord = (typeof phieuBaoPhi)[number];
type EditableFee = { hocPhi: number; an: number; phu: number; dv: number; tru: number; no: number; daThu: number; thuThem: number };

function Page() {
  const [month, setMonth] = useState("06/2026");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [fees, setFees] = useState<FeeRecord[]>(phieuBaoPhi);
  const [editingMa, setEditingMa] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditableFee | null>(null);
  const [activePopupTab, setActivePopupTab] = useState<"capnhat" | "phieu">("capnhat");
  const [noticeFee, setNoticeFee] = useState<FeeRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const rows = hocSinh.map((student) => {
    const fee = fees.find((item) => item.hs === student.ten);
    return { student, fee };
  });

  const filteredRows = rows.filter(({ fee }) => {
    if (statusFilter === "Tất cả trạng thái") return true;
    if (!fee) return statusFilter === "Chưa tạo phí";
    return fee.trangThai === statusFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const editingFee = editingMa ? fees.find((f) => f.ma === editingMa) ?? null : null;

  const openEdit = (fee: FeeRecord) => {
    setEditingMa(fee.ma);
    setEditForm({ hocPhi: fee.hocPhi, an: fee.an, phu: fee.phu, dv: fee.dv, tru: fee.tru, no: fee.no, daThu: fee.daThu, thuThem: 0 });
    setActivePopupTab("capnhat");
  };

  const closeEdit = () => { setEditingMa(null); setEditForm(null); };

  const saveFee = () => {
    if (!editForm || !editingFee) return;
    const tong = editForm.hocPhi + editForm.an + editForm.phu + editForm.dv - editForm.tru + editForm.no;
    const newDaThu = editForm.daThu + editForm.thuThem;
    const conNo = tong - newDaThu;
    const trangThai = newDaThu === 0 ? "Chưa thu" : conNo <= 0 ? "Đã thu đủ" : "Còn nợ 1 phần";
    setFees((prev) => prev.map((f) => f.ma === editingFee.ma ? { ...f, ...editForm, daThu: newDaThu, tong, trangThai } : f));
    closeEdit();
  };

  const numField = (key: keyof EditableFee, label: string) => (
    <div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <input
        type="number"
        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-400 transition-colors"
        value={editForm?.[key] ?? 0}
        onChange={(e) => setEditForm((f) => f && { ...f, [key]: Number(e.target.value) })}
      />
    </div>
  );

  return (
    <div>
      <PageToolbar>
        <Select
          value={month}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => { setMonth(event.target.value); setCurrentPage(1); }}
        >
          <option>06/2026</option>
          <option>05/2026</option>
          <option>04/2026</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e: any) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option>Tất cả trạng thái</option>
          <option>Đã thu đủ</option>
          <option>Còn nợ 1 phần</option>
          <option>Chưa thu</option>
          <option>Chưa tạo phí</option>
        </Select>
        <div className="flex-1" />
        <Btn variant="secondary">Tạo học phí tháng</Btn>
        <Btn>Thu tiền</Btn>
      </PageToolbar>

      <DataTable
        headers={["Học sinh", "Lớp", "Tháng", "Tổng phải thu", "Đã thu", "Còn nợ", "Tình trạng"]}
        onRowClick={(index) => {
          const fee = pagedRows[index].fee;
          if (fee) openEdit(fee);
        }}
        rows={pagedRows.map(({ student, fee }) => [
          <span className="font-medium">{student.ten}</span>,
          student.lop,
          month,
          fee ? formatVnd(fee.tong) : "-",
          fee ? formatVnd(fee.daThu) : "-",
          fee ? formatVnd(fee.tong - fee.daThu) : "-",
          fee ? (
            <StatusBadge status={fee.trangThai} />
          ) : (
            <Badge tone="default">Chưa tạo phí</Badge>
          ),
        ])}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-3">
          <span className="text-xs text-gray-500">
            Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredRows.length)} / {filteredRows.length} học sinh
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

      {/* Edit popup */}
      {editingFee && editForm && (() => {
        const student = hocSinh.find((s) => s.ten === editingFee.hs);
        const dvNote = student?.dv && student.dv !== "-" ? student.dv : null;
        const tong = editForm.hocPhi + editForm.an + editForm.phu + editForm.dv - editForm.tru + editForm.no;
        const newDaThu = editForm.daThu + editForm.thuThem;
        const conNo = tong - newDaThu;
        const statusPreview = newDaThu === 0 ? "Chưa thu" : conNo <= 0 ? "Đã thu đủ" : "Còn nợ 1 phần";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeEdit} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div>
                  <div className="font-bold text-gray-900 text-sm">{editingFee.hs} · {editingFee.lop}</div>
                  <div className="text-xs text-gray-500">Học phí tháng {editingFee.thang} · {editingFee.ma}</div>
                </div>
                <button onClick={closeEdit} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {(["capnhat", "phieu"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePopupTab(tab)}
                    className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                      activePopupTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {tab === "capnhat" ? "Cập nhật" : "Phiếu báo học phí"}
                  </button>
                ))}
              </div>

              {/* Tab: Cập nhật */}
              {activePopupTab === "capnhat" && (
                <div className="px-5 py-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Các khoản phí</div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {numField("hocPhi", "Học phí")}
                    {numField("an", "Tiền ăn")}
                    {numField("phu", "Phụ phí")}
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">
                        Dịch vụ{dvNote ? <span className="ml-1 text-blue-500 font-normal normal-case">({dvNote})</span> : null}
                      </div>
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-400 transition-colors"
                        value={editForm.dv}
                        onChange={(e) => setEditForm((f) => f && { ...f, dv: Number(e.target.value) })}
                      />
                    </div>
                    {numField("tru", "Giảm trừ")}
                    {numField("no", "Công nợ cũ")}
                  </div>

                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng phải thu</span>
                      <span className="font-bold text-gray-900">{formatVnd(tong)}</span>
                    </div>
                    {editForm.daThu > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Đã thu trước</span>
                        <span className="font-semibold text-green-600">{formatVnd(editForm.daThu)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-1.5">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Thu thêm lần này</div>
                      <input
                        type="number" min={0}
                        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-400 transition-colors"
                        value={editForm.thuThem}
                        onChange={(e) => setEditForm((f) => f && { ...f, thuThem: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-gray-500">Còn nợ</span>
                      <span className={`font-bold ${conNo > 0 ? "text-red-500" : "text-green-600"}`}>{formatVnd(Math.max(0, conNo))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái</span>
                      <StatusBadge status={statusPreview} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Btn className="flex-1" onClick={saveFee}>Lưu</Btn>
                    <Btn variant="secondary" onClick={closeEdit}>Hủy</Btn>
                  </div>
                </div>
              )}

              {/* Tab: Phiếu báo học phí */}
              {activePopupTab === "phieu" && (
                <div className="px-5 py-4">
                  {/* School header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-sm text-gray-900">TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG</div>
                      <div className="text-xs text-gray-500">HHD1 · HHD2 · Hotline: 0909 123 456</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-blue-600">PHIẾU BÁO HỌC PHÍ</div>
                      <div className="text-xs text-gray-500">Tháng {editingFee.thang}</div>
                    </div>
                  </div>

                  {/* Student info */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs mb-3">
                    <div><span className="text-gray-500">Học sinh: </span><span className="font-semibold">{editingFee.hs}</span></div>
                    <div><span className="text-gray-500">Lớp: </span><span className="font-semibold">{editingFee.lop}</span></div>
                    <div><span className="text-gray-500">Mã phiếu: </span><span className="font-semibold">{editingFee.ma}</span></div>
                    <div><span className="text-gray-500">Tình trạng: </span><StatusBadge status={editingFee.trangThai} /></div>
                  </div>

                  {/* Fee breakdown */}
                  <div className="rounded-lg border border-gray-100 overflow-hidden text-xs mb-3">
                    {[
                      ["Học phí", formatVnd(editingFee.hocPhi), false],
                      ["Tiền ăn", formatVnd(editingFee.an), false],
                      ["Phụ phí", formatVnd(editingFee.phu), false],
                      ["Dịch vụ" + (dvNote ? ` (${dvNote})` : ""), formatVnd(editingFee.dv), false],
                      ["Giảm trừ", `- ${formatVnd(editingFee.tru)}`, false, "text-green-600"],
                      ["Công nợ cũ", formatVnd(editingFee.no), false],
                    ].map(([label, val, , color]) => (
                      <div key={label as string} className="flex justify-between px-3 py-1.5 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{label}</span>
                        <span className={color as string || ""}>{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between px-3 py-2 bg-gray-50 font-bold">
                      <span>Tổng phải thu</span>
                      <span>{formatVnd(editingFee.tong)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-1.5 border-t border-gray-200">
                      <span className="text-gray-500">Đã thu</span>
                      <span className="text-green-600 font-semibold">{formatVnd(editingFee.daThu)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-1.5">
                      <span className="text-gray-500">Còn nợ</span>
                      <span className={`font-bold ${editingFee.tong > editingFee.daThu ? "text-red-500" : "text-green-600"}`}>
                        {formatVnd(Math.max(0, editingFee.tong - editingFee.daThu))}
                      </span>
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="rounded-lg border border-gray-100 bg-blue-50/50 px-3 py-2 text-xs space-y-1">
                    <div className="font-semibold text-blue-700 mb-1">Thông tin chuyển khoản</div>
                    <div className="flex justify-between"><span className="text-gray-500">Ngân hàng</span><span className="font-medium">Vietcombank</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Số tài khoản</span><span className="font-medium">0123456789</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Chủ tài khoản</span><span className="font-medium">TRUONG MAM NON HOA HUONG DUONG</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Nội dung</span><span className="font-medium">HP {editingFee.thang} {editingFee.hs}</span></div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Btn className="flex-1" onClick={() => exportCompactPdf(editingFee, dvNote)}>Xuất PDF</Btn>
                    <Btn variant="secondary" onClick={closeEdit}>Đóng</Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {noticeFee && <TuitionNoticeModal fee={noticeFee} onClose={() => setNoticeFee(null)} />}
    </div>
  );
}


async function exportCompactPdf(fee: FeeRecord, dvNote: string | null) {
  try {
    const [pdfMakeModule, pdfFontsModule] = await Promise.all([
      import("pdfmake/build/pdfmake.js"),
      import("pdfmake/build/vfs_fonts.js"),
    ]);
    const pdfMake = ((pdfMakeModule as any).default ?? pdfMakeModule) as any;
    const vfs = (pdfFontsModule as any).default?.vfs ?? (pdfFontsModule as any).vfs ?? (pdfFontsModule as any).default?.pdfMake?.vfs ?? (pdfFontsModule as any).pdfMake?.vfs;
    if (vfs) pdfMake.vfs = vfs;

    const border = "#e5e7eb";
    const muted = "#6b7280";
    const green = "#16a34a";
    const red = "#dc2626";
    const blue = "#2563eb";
    const conNo = Math.max(0, fee.tong - fee.daThu);
    const dvLabel = "Dịch vụ" + (dvNote ? ` (${dvNote})` : "");

    const row = (label: string, value: string, labelColor = muted, valueColor = "#111827", bold = false) => ([
      { text: label, color: labelColor, fontSize: 9, margin: [0, 4, 0, 4] },
      { text: value, color: valueColor, bold, fontSize: 9, alignment: "right", margin: [0, 4, 0, 4] },
    ]);

    const dd = {
      pageSize: "A5",
      pageMargins: [32, 32, 32, 32],
      defaultStyle: { font: "Roboto", fontSize: 9, color: "#111827" },
      content: [
        // Header
        {
          columns: [
            { width: "*", stack: [
              { text: "TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG", bold: true, fontSize: 11 },
              { text: "HHD1 · HHD2 · Hotline: 0909 123 456", color: muted, fontSize: 8, margin: [0, 3, 0, 0] },
            ]},
            { width: "auto", stack: [
              { text: "PHIẾU BÁO HỌC PHÍ", bold: true, fontSize: 11, color: blue, alignment: "right" },
              { text: `Tháng ${fee.thang}`, color: muted, fontSize: 8, alignment: "right", margin: [0, 3, 0, 0] },
            ]},
          ],
          margin: [0, 0, 0, 10],
        },
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 481, y2: 0, lineColor: border }], margin: [0, 0, 0, 8] },
        // Student info
        {
          table: { widths: ["*", "*"], body: [
            [
              { text: [{text: "Học sinh: ", color: muted}, {text: fee.hs, bold: true}], fontSize: 9, margin: [6, 5, 6, 5] },
              { text: [{text: "Lớp: ", color: muted}, {text: fee.lop, bold: true}], fontSize: 9, margin: [6, 5, 6, 5] },
            ],
            [
              { text: [{text: "Mã phiếu: ", color: muted}, {text: fee.ma, bold: true}], fontSize: 9, margin: [6, 5, 6, 5] },
              { text: [{text: "Tình trạng: ", color: muted}, {text: fee.trangThai, bold: true, color: fee.trangThai === "Đã thu đủ" ? green : fee.trangThai === "Còn nợ 1 phần" ? "#b45309" : red}], fontSize: 9, margin: [6, 5, 6, 5] },
            ],
          ]},
          layout: { hLineColor: () => border, vLineColor: () => border, hLineWidth: () => 0.5, vLineWidth: () => 0.5 },
          margin: [0, 0, 0, 8],
        },
        // Fee rows
        {
          table: { widths: ["*", "auto"], body: [
            row("Học phí", formatVnd(fee.hocPhi)),
            row("Tiền ăn", formatVnd(fee.an)),
            row("Phụ phí", formatVnd(fee.phu)),
            row(dvLabel, formatVnd(fee.dv)),
            row("Giảm trừ", `- ${formatVnd(fee.tru)}`, muted, green),
            row("Công nợ cũ", formatVnd(fee.no)),
            row("Tổng phải thu", formatVnd(fee.tong), "#111827", "#111827", true),
            row("Đã thu", formatVnd(fee.daThu), muted, green),
            row("Còn nợ", formatVnd(conNo), muted, conNo > 0 ? red : green, true),
          ]},
          layout: { hLineColor: () => border, vLineColor: () => "transparent", hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 0.5 : 0.3), vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0 },
          margin: [0, 0, 0, 8],
        },
        // Bank
        { canvas: [{ type: "rect", x: 0, y: 0, w: 481, h: 1, color: "#dbeafe" }] },
        { text: "Thông tin chuyển khoản", bold: true, color: blue, fontSize: 9, margin: [0, 6, 0, 4] },
        {
          table: { widths: ["*", "auto"], body: [
            row("Ngân hàng", "Vietcombank"),
            row("Số tài khoản", "0123456789"),
            row("Chủ tài khoản", "TRUONG MAM NON HOA HUONG DUONG"),
            row("Nội dung", `HP ${fee.thang} ${fee.hs}`),
          ]},
          layout: { hLineColor: () => border, vLineColor: () => "transparent", hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 0.5 : 0.3), vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0 },
        },
      ],
    };

    const pdf = pdfMake.createPdf(dd);
    const blob = await pdf.getBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phieu-hoc-phi-${fee.ma}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    console.error(e);
    alert("Xuất PDF thất bại. Vui lòng thử lại.");
  }
}

function TuitionNoticeModal({ fee, onClose }: { fee: FeeRecord; onClose: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState("");
  const transferAmount = fee.tong - fee.daThu > 0 ? fee.tong - fee.daThu : fee.tong;
  const transferContent = `HP ${fee.thang} ${fee.hs}`.replace(/\s+/g, " ").trim();

  useEffect(() => {
    const payload = createVietQrPayload({
      bankBin: "970436",
      accountNumber: "0123456789",
      amount: transferAmount,
      message: transferContent,
    });

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [transferAmount, transferContent]);

  const exportPdf = async () => {
    if (!qrDataUrl || isExportingPdf) return;
    setIsExportingPdf(true);
    setExportError("");
    try {
      const [pdfMakeModule, pdfFontsModule] = await Promise.all([
        import("pdfmake/build/pdfmake.js"),
        import("pdfmake/build/vfs_fonts.js"),
      ]);
      const pdfMake = ((pdfMakeModule as any).default ?? pdfMakeModule) as any;
      const vfs =
        (pdfFontsModule as any).default?.vfs ??
        (pdfFontsModule as any).vfs ??
        (pdfFontsModule as any).default?.pdfMake?.vfs ??
        (pdfFontsModule as any).pdfMake?.vfs;

      if (vfs) {
        pdfMake.vfs = vfs;
      }

      const pdf = pdfMake.createPdf(
        createTuitionPdfDefinition({ fee, transferAmount, transferContent, qrDataUrl }),
      );

      const blob = await pdf.getBlob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `phieu-bao-hoc-phi-${fee.ma}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setIsExportingPdf(false);
    } catch (error) {
      console.error("Export tuition PDF failed", error);
      setExportError("Không tải được PDF. Vui lòng thử lại hoặc kiểm tra quyền tải xuống của Chrome.");
      setIsExportingPdf(false);
      alert("Không xuất được PDF. Vui lòng thử lại hoặc báo kỹ thuật kiểm tra console.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 p-4 flex items-center justify-center">
      <div className="w-full max-w-7xl max-h-[92vh] overflow-y-auto rounded-lg bg-white shadow-xl border">
        <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <QrCode className="h-5 w-5 text-primary" />
            Phiếu báo học phí
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-secondary"
            aria-label="Đóng phiếu báo học phí"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-white p-6">
          <div className="tuition-print-area mx-auto max-w-[1120px] rounded-md border bg-white p-7 text-foreground">
            <div className="flex items-start justify-between gap-8 border-b pb-5">
              <div>
                <div className="text-2xl font-bold leading-tight">TRƯỜNG MẦM NON HOA HỒNG</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  HHD1 · HHD2 · Hotline: 0909 123 456
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold text-primary">PHIẾU BÁO HỌC PHÍ</div>
                <div className="mt-2 text-sm text-muted-foreground">Tháng {fee.thang}</div>
              </div>
            </div>

            <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-stretch">
              <div className="min-w-0">
                <div className="grid sm:grid-cols-4 gap-4 rounded-md border p-4 text-sm">
                  <Info label="Học sinh" value={fee.hs} />
                  <Info label="Lớp" value={fee.lop} />
                  <Info label="Mã phiếu" value={fee.ma} />
                  <Info label="Tình trạng" value={fee.trangThai} />
                </div>

                <div className="mt-5 overflow-hidden rounded-md border">
                  <table className="w-full text-sm">
                    <tbody>
                      <ReceiptRow label="Học phí" value={formatVnd(fee.hocPhi)} />
                      <ReceiptRow label="Tiền ăn" value={formatVnd(fee.an)} />
                      <ReceiptRow label="Phụ phí" value={formatVnd(fee.phu)} />
                      <ReceiptRow label="Dịch vụ" value={formatVnd(fee.dv)} />
                      <ReceiptRow label="Giảm trừ" value={`- ${formatVnd(fee.tru)}`} success />
                      <ReceiptRow label="Công nợ cũ" value={formatVnd(fee.no)} />
                      <ReceiptRow label="Tổng phải thu" value={formatVnd(fee.tong)} strong />
                      <ReceiptRow label="Đã thu" value={formatVnd(fee.daThu)} success />
                      <ReceiptRow
                        label="Số tiền cần chuyển"
                        value={formatVnd(transferAmount)}
                        strong
                        danger={transferAmount > 0}
                      />
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <div className="h-16 border-b" />
                    <div className="pt-2 text-center font-medium text-foreground">
                      Người lập phiếu
                    </div>
                  </div>
                  <div>
                    <div className="h-16 border-b" />
                    <div className="pt-2 text-center font-medium text-foreground">
                      Phụ huynh xác nhận
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-md border bg-white p-5 text-sm">
                <div className="mb-3 text-center text-base font-semibold">
                  Thông tin chuyển khoản
                </div>
                <div className="mx-auto grid h-60 w-60 place-items-center border bg-white p-2">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR chuyển khoản học phí" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Đang tạo QR...</span>
                  )}
                </div>
                <div className="mt-5 space-y-3">
                  <Info label="Ngân hàng" value="Vietcombank" />
                  <Info label="Số tài khoản" value="0123456789" />
                  <Info label="Chủ tài khoản" value="TRUONG MAM NON HOA HONG" />
                  <Info label="Nội dung chuyển khoản" value={transferContent} />
                </div>
                <div className="mt-5 rounded-md border p-4 text-center">
                  <div className="text-xs text-muted-foreground">Số tiền cần chuyển</div>
                  <div className="mt-1 text-2xl font-bold text-primary">
                    {formatVnd(transferAmount)}
                  </div>
                </div>
                <p className="mt-auto pt-5 text-xs leading-relaxed text-muted-foreground">
                  Phụ huynh quét mã QR để chuyển khoản đúng số tiền và nội dung.
                </p>
              </div>
            </div>
          </div>

          <div className="no-print mt-4 flex flex-wrap items-center justify-end gap-2">
            {exportError && (
              <div className="mr-auto rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {exportError}
              </div>
            )}
            {isExportingPdf && (
              <div className="mr-auto rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
                Đang tạo PDF...
              </div>
            )}
            <Btn variant="secondary" onClick={onClose}>
              Đóng
            </Btn>
            <Btn variant="secondary" onClick={exportPdf} disabled={!qrDataUrl || isExportingPdf}>
              Xuất PDF
            </Btn>
            <Btn onClick={exportPdf} disabled={!qrDataUrl || isExportingPdf}>
              <span className="inline-flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Tải PDF
              </span>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Đã thu đủ") return <Badge tone="success">{status}</Badge>;
  if (status === "Còn nợ 1 phần") return <Badge tone="warning">{status}</Badge>;
  if (status === "Chưa thu") return <Badge tone="danger">{status}</Badge>;
  return <Badge tone="default">{status}</Badge>;
}

function Line({
  label,
  value,
  strong,
  success,
  danger,
}: {
  label: string;
  value: string;
  strong?: boolean;
  success?: boolean;
  danger?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={success ? "text-success" : danger ? "text-destructive" : ""}>{value}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  strong,
  success,
  danger,
}: {
  label: string;
  value: string;
  strong?: boolean;
  success?: boolean;
  danger?: boolean;
}) {
  return (
    <tr className={`border-b last:border-b-0 ${strong ? "border-t bg-white font-semibold" : ""}`}>
      <td className={`px-3 py-2 ${strong ? "py-3" : ""}`}>{label}</td>
      <td
        className={`px-3 py-2 text-right ${strong ? "py-3" : ""} ${success ? "text-success" : danger ? "text-destructive" : ""}`}
      >
        {value}
      </td>
    </tr>
  );
}

function createVietQrPayload({
  bankBin,
  accountNumber,
  amount,
  message,
}: {
  bankBin: string;
  accountNumber: string;
  amount: number;
  message: string;
}) {
  const beneficiary = tlv("00", bankBin) + tlv("01", accountNumber);
  const merchantAccount = tlv("00", "A000000727") + tlv("01", beneficiary) + tlv("02", "QRIBFTTA");
  const cleanMessage = removeVietnameseMarks(message).replace(/[^A-Z0-9 ./-]/gi, "").slice(0, 60);
  const additionalData = tlv("08", cleanMessage);
  const withoutCrc =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("38", merchantAccount) +
    tlv("53", "704") +
    tlv("54", String(Math.max(0, Math.round(amount)))) +
    tlv("58", "VN") +
    tlv("62", additionalData) +
    "6304";

  return withoutCrc + crc16Ccitt(withoutCrc);
}

function tlv(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16Ccitt(input: string) {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function removeVietnameseMarks(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function createTuitionPdfDefinition({
  fee,
  transferAmount,
  transferContent,
  qrDataUrl,
}: {
  fee: FeeRecord;
  transferAmount: number;
  transferContent: string;
  qrDataUrl: string;
}) {
  const borderColor = "#d6e2ec";
  const mutedColor = "#51637a";
  const primaryColor = "#0b84d8";
  const successColor = "#159947";
  const dangerColor = "#dc2626";
  const labelStyle = { fontSize: 8, color: mutedColor, margin: [0, 0, 0, 2] };
  const valueStyle = { bold: true, fontSize: 9, color: "#03152d" };
  const infoCell = (label: string, value: string) => ({
    stack: [
      { text: label, ...labelStyle },
      { text: value, ...valueStyle },
    ],
  });
  const feeRow = (label: string, value: string, color = "#03152d", bold = false) => [
    { text: label, bold, margin: [8, 6, 8, 6] },
    { text: value, bold, color, alignment: "right", margin: [8, 6, 8, 6] },
  ];
  const tableLayout = {
    hLineColor: () => borderColor,
    vLineColor: () => borderColor,
    hLineWidth: () => 0.8,
    vLineWidth: () => 0.8,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  };

  return {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [28, 28, 28, 28],
    defaultStyle: { font: "Roboto", fontSize: 9, color: "#03152d" },
    content: [
      {
        table: {
          widths: ["*"],
          body: [[
            {
              stack: [
                {
                  columns: [
                    {
                      width: "*",
                      stack: [
                        { text: "TRƯỜNG MẦM NON HOA HỒNG", fontSize: 17, bold: true },
                        {
                          text: "HHD1 · HHD2 · Hotline: 0909 123 456",
                          color: mutedColor,
                          margin: [0, 6, 0, 0],
                        },
                      ],
                    },
                    {
                      width: 230,
                      stack: [
                        {
                          text: "PHIẾU BÁO HỌC PHÍ",
                          fontSize: 17,
                          bold: true,
                          color: primaryColor,
                          alignment: "right",
                        },
                        {
                          text: `Tháng ${fee.thang}`,
                          color: mutedColor,
                          alignment: "right",
                          margin: [0, 6, 0, 0],
                        },
                      ],
                    },
                  ],
                },
                {
                  canvas: [
                    { type: "line", x1: 0, y1: 0, x2: 770, y2: 0, lineColor: borderColor },
                  ],
                  margin: [0, 16, 0, 16],
                },
                {
                  columns: [
                    {
                      width: "*",
                      stack: [
                        {
                          table: {
                            widths: ["*", "*", "*", "*"],
                            body: [[
                              infoCell("Học sinh", fee.hs),
                              infoCell("Lớp", fee.lop),
                              infoCell("Mã phiếu", fee.ma),
                              infoCell("Tình trạng", fee.trangThai),
                            ]],
                          },
                          layout: tableLayout,
                        },
                        {
                          table: {
                            widths: ["*", 150],
                            body: [
                              feeRow("Học phí", formatVnd(fee.hocPhi)),
                              feeRow("Tiền ăn", formatVnd(fee.an)),
                              feeRow("Phụ phí", formatVnd(fee.phu)),
                              feeRow("Dịch vụ", formatVnd(fee.dv)),
                              feeRow("Giảm trừ", `- ${formatVnd(fee.tru)}`, successColor),
                              feeRow("Công nợ cũ", formatVnd(fee.no)),
                              feeRow("Tổng phải thu", formatVnd(fee.tong), "#03152d", true),
                              feeRow("Đã thu", formatVnd(fee.daThu), successColor),
                              feeRow("Số tiền cần chuyển", formatVnd(transferAmount), dangerColor, true),
                            ],
                          },
                          layout: tableLayout,
                          margin: [0, 14, 0, 0],
                        },
                        {
                          columns: [
                            {
                              width: "*",
                              stack: [
                                {
                                  canvas: [
                                    { type: "line", x1: 0, y1: 0, x2: 230, y2: 0, lineColor: borderColor },
                                  ],
                                },
                                {
                                  text: "Người lập phiếu",
                                  alignment: "center",
                                  bold: true,
                                  fontSize: 8,
                                  margin: [0, 8, 0, 0],
                                },
                              ],
                            },
                            {
                              width: "*",
                              stack: [
                                {
                                  canvas: [
                                    { type: "line", x1: 0, y1: 0, x2: 230, y2: 0, lineColor: borderColor },
                                  ],
                                },
                                {
                                  text: "Phụ huynh xác nhận",
                                  alignment: "center",
                                  bold: true,
                                  fontSize: 8,
                                  margin: [0, 8, 0, 0],
                                },
                              ],
                            },
                          ],
                          columnGap: 18,
                          margin: [0, 58, 0, 0],
                        },
                      ],
                    },
                    {
                      width: 230,
                      stack: [
                        {
                          table: {
                            widths: ["*"],
                            body: [[
                              {
                                stack: [
                                  {
                                    text: "Thông tin chuyển khoản",
                                    alignment: "center",
                                    bold: true,
                                    fontSize: 11,
                                    margin: [0, 0, 0, 10],
                                  },
                                  { image: qrDataUrl, width: 148, alignment: "center" },
                                  { text: "Ngân hàng", ...labelStyle, margin: [0, 14, 0, 2] },
                                  { text: "Vietcombank", ...valueStyle },
                                  { text: "Số tài khoản", ...labelStyle, margin: [0, 10, 0, 2] },
                                  { text: "0123456789", ...valueStyle },
                                  { text: "Chủ tài khoản", ...labelStyle, margin: [0, 10, 0, 2] },
                                  { text: "TRUONG MAM NON HOA HONG", ...valueStyle },
                                  { text: "Nội dung chuyển khoản", ...labelStyle, margin: [0, 10, 0, 2] },
                                  { text: transferContent, ...valueStyle },
                                  {
                                    table: {
                                      widths: ["*"],
                                      body: [[
                                        {
                                          stack: [
                                            {
                                              text: "Số tiền cần chuyển",
                                              fontSize: 8,
                                              color: mutedColor,
                                              alignment: "center",
                                            },
                                            {
                                              text: formatVnd(transferAmount),
                                              fontSize: 18,
                                              bold: true,
                                              color: primaryColor,
                                              alignment: "center",
                                              margin: [0, 4, 0, 0],
                                            },
                                          ],
                                          margin: [8, 8, 8, 8],
                                        },
                                      ]],
                                    },
                                    layout: tableLayout,
                                    margin: [0, 14, 0, 0],
                                  },
                                  {
                                    text: "Phụ huynh quét mã QR để chuyển khoản đúng số tiền và nội dung.",
                                    color: mutedColor,
                                    fontSize: 8,
                                    lineHeight: 1.25,
                                    margin: [0, 14, 0, 0],
                                  },
                                ],
                                margin: [14, 14, 14, 14],
                              },
                            ]],
                          },
                          layout: tableLayout,
                        },
                      ],
                    },
                  ],
                  columnGap: 24,
                },
              ],
              margin: [22, 22, 22, 22],
            },
          ]],
        },
        layout: tableLayout,
      },
    ],
  };
}

function createTuitionPdfNode({
  fee,
  transferAmount,
  transferContent,
  qrDataUrl,
}: {
  fee: FeeRecord;
  transferAmount: number;
  transferContent: string;
  qrDataUrl: string;
}) {
  const node = document.createElement("div");
  node.style.cssText = [
    "position: fixed",
    "left: -10000px",
    "top: 0",
    "width: 1120px",
    "background: #ffffff",
    "color: #03152d",
    "font-family: Arial, sans-serif",
    "font-size: 14px",
    "line-height: 1.35",
    "padding: 28px",
    "box-sizing: border-box",
  ].join(";");

  node.innerHTML = `
    <div style="border:1px solid #d6e2ec;border-radius:8px;padding:28px;background:#fff;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;gap:32px;border-bottom:1px solid #d6e2ec;padding-bottom:20px;">
        <div>
          <div style="font-size:24px;font-weight:700;line-height:1.2;">TRƯỜNG MẦM NON HOA HỒNG</div>
          <div style="margin-top:8px;color:#51637a;">HHD1 · HHD2 · Hotline: 0909 123 456</div>
        </div>
        <div style="text-align:right;white-space:nowrap;">
          <div style="font-size:24px;font-weight:700;color:#0b84d8;line-height:1.2;">PHIẾU BÁO HỌC PHÍ</div>
          <div style="margin-top:8px;color:#51637a;">Tháng ${escapeHtml(fee.thang)}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 320px;gap:32px;margin-top:24px;align-items:stretch;">
        <div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;border:1px solid #d6e2ec;border-radius:6px;padding:16px;">
            ${pdfInfo("Học sinh", fee.hs)}
            ${pdfInfo("Lớp", fee.lop)}
            ${pdfInfo("Mã phiếu", fee.ma)}
            ${pdfInfo("Tình trạng", fee.trangThai)}
          </div>

          <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:20px;border:1px solid #d6e2ec;border-radius:6px;overflow:hidden;">
            <tbody>
              ${pdfRow("Học phí", formatVnd(fee.hocPhi))}
              ${pdfRow("Tiền ăn", formatVnd(fee.an))}
              ${pdfRow("Phụ phí", formatVnd(fee.phu))}
              ${pdfRow("Dịch vụ", formatVnd(fee.dv))}
              ${pdfRow("Giảm trừ", `- ${formatVnd(fee.tru)}`, "#159947")}
              ${pdfRow("Công nợ cũ", formatVnd(fee.no))}
              ${pdfRow("Tổng phải thu", formatVnd(fee.tong), "#03152d", true)}
              ${pdfRow("Đã thu", formatVnd(fee.daThu), "#159947")}
              ${pdfRow("Số tiền cần chuyển", formatVnd(transferAmount), "#dc2626", true)}
            </tbody>
          </table>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:56px;font-size:12px;">
            <div>
              <div style="height:48px;border-bottom:1px solid #d6e2ec;"></div>
              <div style="padding-top:10px;text-align:center;font-weight:600;">Người lập phiếu</div>
            </div>
            <div>
              <div style="height:48px;border-bottom:1px solid #d6e2ec;"></div>
              <div style="padding-top:10px;text-align:center;font-weight:600;">Phụ huynh xác nhận</div>
            </div>
          </div>
        </div>

        <div style="border:1px solid #d6e2ec;border-radius:6px;padding:20px;background:#fff;box-sizing:border-box;">
          <div style="text-align:center;font-size:16px;font-weight:700;margin-bottom:12px;">Thông tin chuyển khoản</div>
          <div style="border:1px solid #d6e2ec;padding:8px;margin:0 auto;width:252px;height:252px;box-sizing:border-box;">
            <img src="${qrDataUrl}" alt="QR chuyển khoản" style="width:100%;height:100%;object-fit:contain;display:block;" />
          </div>
          <div style="margin-top:18px;">
            ${pdfInfo("Ngân hàng", "Vietcombank")}
            ${pdfInfo("Số tài khoản", "0123456789")}
            ${pdfInfo("Chủ tài khoản", "TRUONG MAM NON HOA HONG")}
            ${pdfInfo("Nội dung chuyển khoản", transferContent)}
          </div>
          <div style="margin-top:18px;border:1px solid #d6e2ec;border-radius:6px;padding:14px;text-align:center;">
            <div style="font-size:12px;color:#51637a;">Số tiền cần chuyển</div>
            <div style="margin-top:4px;font-size:26px;font-weight:700;color:#0b84d8;">${formatVnd(transferAmount)}</div>
          </div>
          <div style="margin-top:18px;font-size:12px;color:#51637a;">
            Phụ huynh quét mã QR để chuyển khoản đúng số tiền và nội dung.
          </div>
        </div>
      </div>
    </div>
  `;

  return node;
}

function pdfInfo(label: string, value: string) {
  return `
    <div style="margin-bottom:10px;">
      <div style="font-size:12px;color:#51637a;">${escapeHtml(label)}</div>
      <div style="font-weight:700;color:#03152d;">${escapeHtml(value)}</div>
    </div>
  `;
}

function pdfRow(label: string, value: string, color = "#03152d", strong = false) {
  return `
    <tr>
      <td style="border-bottom:1px solid #d6e2ec;padding:${strong ? "12px" : "10px"} 12px;font-weight:${strong ? "700" : "400"};">
        ${escapeHtml(label)}
      </td>
      <td style="border-bottom:1px solid #d6e2ec;padding:${strong ? "12px" : "10px"} 12px;text-align:right;font-weight:${strong ? "700" : "400"};color:${color};">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
