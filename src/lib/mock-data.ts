// Mock data cho MẦM NON MANAGER

export const coSo = ["HHD1", "HHD2"];

export const lopHoc = [
  { ma: "L01", ten: "Lớp Nhà Trẻ HHD1", coSo: "HHD1", gv: "Cô Mai", soHs: 12, lich: "T2-T6", trangThai: "Hoạt động" },
  { ma: "L02", ten: "Lớp Chồi HHD1", coSo: "HHD1", gv: "Cô Lý", soHs: 18, lich: "T2-T6", trangThai: "Hoạt động" },
  { ma: "L03", ten: "Lớp Mầm HHD2", coSo: "HHD2", gv: "Cô Hạnh", soHs: 20, lich: "T2-T7", trangThai: "Hoạt động" },
  { ma: "L04", ten: "Lớp Lá HHD2", coSo: "HHD2", gv: "Cô Thu", soHs: 22, lich: "T2-T6", trangThai: "Hoạt động" },
  { ma: "L05", ten: "Lớp Bán Trú", coSo: "HHD1", gv: "Cô Lan", soHs: 15, lich: "T2-T7", trangThai: "Hoạt động" },
];

export const giaoVien = [
  { ma: "GV01", ten: "Cô Mai", lop: "Lớp Nhà Trẻ HHD1", sdt: "0901111111", luongCb: 7500000, congChuan: 26 },
  { ma: "GV02", ten: "Cô Lý", lop: "Lớp Chồi HHD1", sdt: "0902222222", luongCb: 8000000, congChuan: 26 },
  { ma: "GV03", ten: "Cô Hạnh", lop: "Lớp Mầm HHD2", sdt: "0903333333", luongCb: 8500000, congChuan: 26 },
  { ma: "GV04", ten: "Cô Thu", lop: "Lớp Lá HHD2", sdt: "0904444444", luongCb: 9000000, congChuan: 26 },
  { ma: "GV05", ten: "Cô Lan", lop: "Lớp Bán Trú", sdt: "0905555555", luongCb: 8000000, congChuan: 26 },
];

export const hocSinh = [
  { ma: "HS001", ten: "Bé Nguyễn An", lop: "Lớp Chồi HHD1", ns: "2021-04-12", ph: "Nguyễn Văn A", sdt: "0911000001", trangThai: "Đang học", goi: "Tháng", dv: "Ăn chiều, Camera", ghiChu: "" },
  { ma: "HS002", ten: "Bé Trần Bình", lop: "Lớp Chồi HHD1", ns: "2021-06-22", ph: "Trần Thị B", sdt: "0911000002", trangThai: "Đang học", goi: "Tháng", dv: "Đưa rước", ghiChu: "" },
  { ma: "HS003", ten: "Bé Lê Cường", lop: "Lớp Mầm HHD2", ns: "2020-09-01", ph: "Lê Văn C", sdt: "0911000003", trangThai: "Đang học", goi: "Tháng", dv: "Ăn chiều, Tắm bé", ghiChu: "Dị ứng hải sản" },
  { ma: "HS004", ten: "Bé Phạm Dương", lop: "Lớp Lá HHD2", ns: "2019-12-15", ph: "Phạm Thị D", sdt: "0911000004", trangThai: "Đang học", goi: "Tháng", dv: "Camera, Đưa rước", ghiChu: "" },
  { ma: "HS005", ten: "Bé Hoàng Em", lop: "Lớp Nhà Trẻ HHD1", ns: "2022-01-20", ph: "Hoàng Văn E", sdt: "0911000005", trangThai: "Đang học", goi: "Tháng", dv: "Ăn chiều", ghiChu: "" },
  { ma: "HS006", ten: "Bé Vũ Phong", lop: "Lớp Bán Trú", ns: "2020-03-10", ph: "Vũ Thị F", sdt: "0911000006", trangThai: "Bảo lưu", goi: "Tháng", dv: "—", ghiChu: "Bảo lưu 2 tháng" },
  { ma: "HS007", ten: "Bé Đỗ Giang", lop: "Lớp Chồi HHD1", ns: "2021-07-05", ph: "Đỗ Văn G", sdt: "0911000007", trangThai: "Đang học", goi: "Tháng", dv: "Ăn chiều", ghiChu: "" },
  { ma: "HS008", ten: "Bé Bùi Hà", lop: "Lớp Mầm HHD2", ns: "2020-11-30", ph: "Bùi Thị H", sdt: "0911000008", trangThai: "Đang học", goi: "Tháng", dv: "Camera", ghiChu: "" },
];

export const dichVu = [
  { ma: "DV01", ten: "Ăn chiều", kieu: "Theo ngày", gia: 15000, tinhPhi: true, gvGhiNhan: true, trangThai: "Đang dùng" },
  { ma: "DV02", ten: "Tắm bé", kieu: "Theo tháng", gia: 100000, tinhPhi: true, gvGhiNhan: false, trangThai: "Đang dùng" },
  { ma: "DV03", ten: "Camera", kieu: "Theo tháng", gia: 50000, tinhPhi: true, gvGhiNhan: false, trangThai: "Đang dùng" },
  { ma: "DV04", ten: "Đưa rước", kieu: "Theo tháng", gia: 300000, tinhPhi: true, gvGhiNhan: false, trangThai: "Đang dùng" },
  { ma: "DV05", ten: "Giữ ngoài giờ", kieu: "Theo buổi", gia: 30000, tinhPhi: true, gvGhiNhan: true, trangThai: "Đang dùng" },
  { ma: "DV06", ten: "Học Chủ nhật", kieu: "Theo buổi", gia: 100000, tinhPhi: true, gvGhiNhan: true, trangThai: "Đang dùng" },
  { ma: "DV07", ten: "Đồng phục", kieu: "Một lần", gia: 150000, tinhPhi: true, gvGhiNhan: false, trangThai: "Đang dùng" },
  { ma: "DV08", ten: "Sách vở", kieu: "Một lần", gia: 200000, tinhPhi: true, gvGhiNhan: false, trangThai: "Đang dùng" },
];

export const phieuBaoPhi = [
  { ma: "HP001", hs: "Bé Nguyễn An", lop: "Lớp Chồi HHD1", hocPhi: 2500000, an: 330000, phu: 50000, dv: 50000, tru: 30000, no: 0, tong: 2900000, daThu: 2900000, trangThai: "Đã thu" },
  { ma: "HP002", hs: "Bé Trần Bình", lop: "Lớp Chồi HHD1", hocPhi: 2500000, an: 330000, phu: 50000, dv: 300000, tru: 0, no: 0, tong: 3180000, daThu: 1500000, trangThai: "Còn nợ" },
  { ma: "HP003", hs: "Bé Lê Cường", lop: "Lớp Mầm HHD2", hocPhi: 2800000, an: 330000, phu: 50000, dv: 100000, tru: 60000, no: 200000, tong: 3420000, daThu: 0, trangThai: "Chưa thu" },
  { ma: "HP004", hs: "Bé Phạm Dương", lop: "Lớp Lá HHD2", hocPhi: 3000000, an: 330000, phu: 50000, dv: 350000, tru: 0, no: 0, tong: 3730000, daThu: 3730000, trangThai: "Đã thu" },
  { ma: "HP005", hs: "Bé Hoàng Em", lop: "Lớp Nhà Trẻ HHD1", hocPhi: 2300000, an: 330000, phu: 50000, dv: 0, tru: 30000, no: 0, tong: 2650000, daThu: 2000000, trangThai: "Còn nợ" },
];

export const phieuThu = [
  { so: "PT000001", ngay: "2026-06-02", hs: "Bé Nguyễn An", lop: "Lớp Chồi HHD1", nguoiNop: "Nguyễn Văn A", noiDung: "Học phí T6/2026", phaiThu: 2900000, thucThu: 2900000, hinhThuc: "Chuyển khoản", nguoiThu: "Admin", trangThai: "Đã thu" },
  { so: "PT000002", ngay: "2026-06-03", hs: "Bé Trần Bình", lop: "Lớp Chồi HHD1", nguoiNop: "Trần Thị B", noiDung: "Học phí T6/2026 (đợt 1)", phaiThu: 3180000, thucThu: 1500000, hinhThuc: "Tiền mặt", nguoiThu: "Admin", trangThai: "Đã thu" },
  { so: "PT000003", ngay: "2026-06-04", hs: "Bé Phạm Dương", lop: "Lớp Lá HHD2", nguoiNop: "Phạm Thị D", noiDung: "Học phí T6/2026", phaiThu: 3730000, thucThu: 3730000, hinhThuc: "Chuyển khoản", nguoiThu: "Admin", trangThai: "Đã thu" },
  { so: "PT000004", ngay: "2026-06-05", hs: "Bé Hoàng Em", lop: "Lớp Nhà Trẻ HHD1", nguoiNop: "Hoàng Văn E", noiDung: "Học phí T6/2026 (đợt 1)", phaiThu: 2650000, thucThu: 2000000, hinhThuc: "Tiền mặt", nguoiThu: "Admin", trangThai: "Đã thu" },
];

export const phieuThuHuy = [
  { so: "PT000099", ngay: "2026-05-28", hs: "Bé Lê Cường", lop: "Lớp Mầm HHD2", phaiThu: 3420000, thucThu: 3420000, lyDoHuy: "Sai số tiền, nhập nhầm dịch vụ", nguoiHuy: "Admin", thoiGianHuy: "2026-05-29 09:12" },
];

export const lichPhanCong = [
  { lop: "Lớp Nhà Trẻ HHD1", gv: "Cô Mai", ngayHoc: "T2-T6", congNgay: 1, cnhat: false },
  { lop: "Lớp Chồi HHD1", gv: "Cô Lý", ngayHoc: "T2-T6", congNgay: 1, cnhat: false },
  { lop: "Lớp Mầm HHD2", gv: "Cô Hạnh", ngayHoc: "T2-T7", congNgay: 1, cnhat: false },
  { lop: "Lớp Lá HHD2", gv: "Cô Thu", ngayHoc: "T2-T6", congNgay: 1, cnhat: false },
  { lop: "Lớp Bán Trú", gv: "Cô Lan", ngayHoc: "T2-T7", congNgay: 1, cnhat: true },
];

export const bangCong = [
  { gv: "Cô Mai", ngay: "2026-06-01", lop: "Lớp Nhà Trẻ HHD1", congTd: 1, dieuChinh: 0, tong: 1, lyDo: "", nguoiSua: "", thoiGian: "" },
  { gv: "Cô Mai", ngay: "2026-06-02", lop: "Lớp Nhà Trẻ HHD1", congTd: 1, dieuChinh: 0, tong: 1, lyDo: "", nguoiSua: "", thoiGian: "" },
  { gv: "Cô Lý", ngay: "2026-06-01", lop: "Lớp Chồi HHD1", congTd: 1, dieuChinh: -1, tong: 0, lyDo: "Nghỉ ốm có phép", nguoiSua: "Admin", thoiGian: "2026-06-01 17:30" },
  { gv: "Cô Lý", ngay: "2026-06-02", lop: "Lớp Chồi HHD1", congTd: 1, dieuChinh: 0, tong: 1, lyDo: "", nguoiSua: "", thoiGian: "" },
  { gv: "Cô Hạnh", ngay: "2026-06-01", lop: "Lớp Mầm HHD2", congTd: 1, dieuChinh: 0.5, tong: 1.5, lyDo: "Tăng ca chiều", nguoiSua: "Admin", thoiGian: "2026-06-01 18:00" },
  { gv: "Cô Thu", ngay: "2026-06-01", lop: "Lớp Lá HHD2", congTd: 1, dieuChinh: 0, tong: 1, lyDo: "", nguoiSua: "", thoiGian: "" },
  { gv: "Cô Lan", ngay: "2026-06-01", lop: "Lớp Bán Trú", congTd: 1, dieuChinh: 0, tong: 1, lyDo: "", nguoiSua: "", thoiGian: "" },
];

export const phieuLuong = [
  { gv: "Cô Mai", thang: "06/2026", congTd: 24, congDc: 0, tong: 24, luongCb: 7500000, phuCap: 500000, tamUng: 1000000, tru: 0, thucNhan: 7423077 },
  { gv: "Cô Lý", thang: "06/2026", congTd: 25, congDc: -1, tong: 24, luongCb: 8000000, phuCap: 500000, tamUng: 0, tru: 0, thucNhan: 7884615 },
  { gv: "Cô Hạnh", thang: "06/2026", congTd: 26, congDc: 2, tong: 28, luongCb: 8500000, phuCap: 700000, tamUng: 1500000, tru: 0, thucNhan: 8353846 },
  { gv: "Cô Thu", thang: "06/2026", congTd: 25, congDc: 0, tong: 25, luongCb: 9000000, phuCap: 500000, tamUng: 0, tru: 200000, thucNhan: 9000000 },
  { gv: "Cô Lan", thang: "06/2026", congTd: 26, congDc: 1, tong: 27, luongCb: 8000000, phuCap: 600000, tamUng: 500000, tru: 0, thucNhan: 8407692 },
];

export const thuChi = [
  { ngay: "2026-06-01", loai: "Thu", nhom: "Học phí", noiDung: "Thu học phí T6 (đợt 1)", soTien: 14460000, nguoi: "Admin", ghiChu: "" },
  { ngay: "2026-06-02", loai: "Chi", nhom: "Thực phẩm", noiDung: "Mua thực phẩm tuần 1", soTien: 3200000, nguoi: "Bếp trưởng", ghiChu: "Có hóa đơn" },
  { ngay: "2026-06-03", loai: "Chi", nhom: "Điện nước", noiDung: "Tiền điện T5", soTien: 1850000, nguoi: "Admin", ghiChu: "" },
  { ngay: "2026-06-05", loai: "Chi", nhom: "Lương", noiDung: "Tạm ứng lương Cô Mai", soTien: 1000000, nguoi: "Admin", ghiChu: "" },
  { ngay: "2026-06-06", loai: "Thu", nhom: "Học phí", noiDung: "Thu phiếu PT000003", soTien: 3730000, nguoi: "Admin", ghiChu: "" },
];

export const diemDanhHomNay = [
  { hs: "Bé Nguyễn An", coMat: true, vangPhep: false, vangKhong: false, anChieu: true, ngoaiGio: false, cnhat: false, ghiChu: "" },
  { hs: "Bé Trần Bình", coMat: true, vangPhep: false, vangKhong: false, anChieu: false, ngoaiGio: true, cnhat: false, ghiChu: "Mẹ đón trễ" },
  { hs: "Bé Đỗ Giang", coMat: false, vangPhep: true, vangKhong: false, anChieu: false, ngoaiGio: false, cnhat: false, ghiChu: "Đi khám" },
  { hs: "Bé Trần Phương", coMat: true, vangPhep: false, vangKhong: false, anChieu: true, ngoaiGio: false, cnhat: false, ghiChu: "" },
];

export const formatVnd = (n: number) => n.toLocaleString("vi-VN") + " ₫";
