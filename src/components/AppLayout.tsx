import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  Cog,
  GraduationCap,
  School,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";
import { useRole, type Role } from "@/lib/role-context";

const adminMenu = [
  { to: "/hoc-sinh", label: "Quản lý học sinh", icon: Users },
  { to: "/giao-vien", label: "Quản lý giáo viên", icon: GraduationCap },
  { to: "/lop-hoc", label: "Quản lý lớp", icon: School },
  { to: "/hoc-phi/danh-sach", label: "Quản lý học phí", icon: BookOpenCheck },
  { to: "/luong/tinh-luong", label: "Quản lý lương", icon: Wallet },
  { to: "/bao-cao/diem-danh", label: "Báo cáo điểm danh", icon: BarChart3 },
  { to: "/bao-cao/cham-cong", label: "Báo cáo chấm công", icon: ClipboardCheck },
  { to: "/bao-cao/thu-chi", label: "Báo cáo thu chi", icon: Wallet },
  { to: "/cau-hinh", label: "Cấu hình dịch vụ", icon: Cog },
];

const teacherMenu = [
  { to: "/gv/lop-cua-toi", label: "Lớp của tôi", icon: School },
  { to: "/gv/diem-danh", label: "Điểm danh hôm nay", icon: ClipboardCheck },
  { to: "/gv/bang-cong", label: "Bảng công của tôi", icon: ClipboardCheck },
  { to: "/gv/phieu-luong", label: "Phiếu lương của tôi", icon: Wallet },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { role, setRole, teacherName } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menu = role === "admin" ? adminMenu : teacherMenu;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
              M
            </div>
            <div>
              <div className="font-bold text-base leading-tight">HOA HƯỚNG DƯƠNG</div>
              <div className="text-xs text-muted-foreground leading-tight">ADMIN</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2">
          {menu.map((item) => (
            <MenuLink key={item.to} item={item} pathname={pathname} />
          ))}
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
        <main className="flex-1 p-6 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

function MenuLink({ item, pathname }: { item: (typeof adminMenu)[number]; pathname: string }) {
  const Icon = item.icon;
  const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(`${item.to}/`));

  return (
    <Link
      to={item.to}
      className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition ${
        active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary" : ""
      }`}
    >
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
  const exact = all.find((item) => item.to === path);
  if (exact) return exact.label;
  if (path.startsWith("/hoc-phi")) return "Quản lý học phí";
  if (path.startsWith("/luong")) return "Quản lý lương";
  if (path.startsWith("/gv")) return "Cổng giáo viên";
  return role === "admin" ? "Quản lý học sinh" : "Lớp của tôi";
}
