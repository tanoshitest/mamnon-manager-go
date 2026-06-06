import { Link, useRouterState } from "@tanstack/react-router";
import { useRole, type Role } from "@/lib/role-context";
import {
  LayoutDashboard, School, Users, GraduationCap, CalendarDays, ClipboardCheck,
  Settings, Receipt, FileText, Wallet, BarChart3, Cog, ChevronDown, UserCircle2,
  CalendarCheck, BookOpen, ClipboardList,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const adminMenu = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lop-hoc", label: "Lớp học", icon: School },
  { to: "/hoc-sinh", label: "Học sinh", icon: Users },
  { to: "/giao-vien", label: "Giáo viên", icon: GraduationCap },
  { to: "/lich-phan-cong", label: "Lịch học & phân công", icon: CalendarDays },
  { to: "/diem-danh", label: "Điểm danh học sinh", icon: ClipboardCheck },
  { to: "/dich-vu", label: "Cấu hình dịch vụ", icon: Settings },
  {
    label: "Học phí", icon: Receipt, children: [
      { to: "/hoc-phi/bang-gia", label: "Cấu hình bảng giá" },
      { to: "/hoc-phi/tao-phieu", label: "Tạo phiếu báo học phí" },
      { to: "/hoc-phi/danh-sach", label: "Danh sách phiếu báo phí" },
    ],
  },
  {
    label: "Phiếu thu", icon: FileText, children: [
      { to: "/phieu-thu/tao", label: "Tạo phiếu thu" },
      { to: "/phieu-thu/danh-sach", label: "Danh sách phiếu thu" },
      { to: "/phieu-thu/da-huy", label: "Phiếu đã hủy" },
    ],
  },
  {
    label: "Công giáo viên", icon: CalendarCheck, children: [
      { to: "/cong/bang-cong", label: "Bảng công tự động" },
      { to: "/cong/dieu-chinh", label: "Điều chỉnh công" },
      { to: "/cong/chot-cong", label: "Chốt công" },
    ],
  },
  {
    label: "Lương giáo viên", icon: Wallet, children: [
      { to: "/luong/cau-hinh", label: "Cấu hình lương" },
      { to: "/luong/tinh-luong", label: "Tính lương" },
      { to: "/luong/phieu-luong", label: "Phiếu lương" },
    ],
  },
  { to: "/thu-chi", label: "Thu chi", icon: Wallet },
  { to: "/bao-cao", label: "Báo cáo", icon: BarChart3 },
  { to: "/cau-hinh", label: "Cấu hình hệ thống", icon: Cog },
];

const teacherMenu = [
  { to: "/gv/lop-cua-toi", label: "Lớp của tôi", icon: School },
  { to: "/gv/diem-danh", label: "Điểm danh hôm nay", icon: ClipboardCheck },
  { to: "/gv/lich-day", label: "Lịch dạy của tôi", icon: CalendarDays },
  { to: "/gv/bang-cong", label: "Bảng công của tôi", icon: ClipboardList },
  { to: "/gv/phieu-luong", label: "Phiếu lương của tôi", icon: BookOpen },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { role, setRole, teacherName } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menu = role === "admin" ? adminMenu : teacherMenu;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">M</div>
            <div>
              <div className="font-bold text-base leading-tight">MẦM NON</div>
              <div className="text-xs text-muted-foreground leading-tight">MANAGER</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {menu.map((item) => <MenuItem key={item.label} item={item} pathname={pathname} />)}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border text-xs text-muted-foreground">
          Phiên bản demo · v1.0
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-semibold">{pageTitle(pathname, role)}</h1>
          <div className="flex items-center gap-3">
            <RoleSwitcher role={role} setRole={setRole} />
            <div className="flex items-center gap-2 text-sm">
              <UserCircle2 className="h-7 w-7 text-primary" />
              <span className="font-medium">{role === "admin" ? "Admin" : teacherName}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}

function MenuItem({ item, pathname }: any) {
  const Icon = item.icon;
  const [open, setOpen] = useState(true);
  const active = item.to && pathname === item.to;
  const childActive = item.children?.some((c: any) => c.to === pathname);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition ${childActive ? "text-primary font-medium" : ""}`}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && (
          <div className="bg-sidebar/50">
            {item.children.map((c: any) => (
              <Link key={c.to} to={c.to}
                className={`block pl-10 pr-3 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === c.to ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <Link to={item.to}
      className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary" : ""}`}>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  );
}

function RoleSwitcher({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Vai trò:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="text-sm border rounded-md px-2 py-1.5 bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="admin">Admin</option>
        <option value="teacher">Giáo viên</option>
      </select>
    </div>
  );
}

function pageTitle(path: string, role: Role): string {
  const all = [...adminMenu, ...teacherMenu];
  for (const item of all) {
    if ((item as any).to === path) return item.label;
    if ((item as any).children) {
      const c = (item as any).children.find((x: any) => x.to === path);
      if (c) return `${item.label} · ${c.label}`;
    }
  }
  return role === "admin" ? "Dashboard" : "Lớp của tôi";
}
