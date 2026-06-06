import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card border rounded-lg p-4 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, hint, tone = "default" }: { label: string; value: ReactNode; hint?: string; tone?: "default" | "success" | "warning" | "danger" | "info" }) {
  const toneClass: Record<string, string> = {
    default: "border-l-primary",
    success: "border-l-success",
    warning: "border-l-warning",
    danger: "border-l-destructive",
    info: "border-l-info",
  };
  return (
    <div className={`bg-card border border-l-4 ${toneClass[tone]} rounded-lg p-4`}>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function Btn({ children, variant = "primary", onClick, className = "", disabled = false }: { children: ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost" | "success"; onClick?: () => void; className?: string; disabled?: boolean }) {
  const v: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
    success: "bg-success text-success-foreground hover:opacity-90",
    ghost: "hover:bg-secondary",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${v[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "danger" | "info" }) {
  const t: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success border border-success/30",
    warning: "bg-warning/20 text-warning-foreground border border-warning/40",
    danger: "bg-destructive/15 text-destructive border border-destructive/30",
    info: "bg-info/15 text-info border border-info/30",
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${t[tone]}`}>{children}</span>;
}

export function PageToolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 mb-4">{children}</div>;
}

export function Select({ children, ...p }: any) {
  return <select {...p} className="text-sm border rounded-md px-2 py-1.5 bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring">{children}</select>;
}

export function Input(p: any) {
  return <input {...p} className={`text-sm border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring ${p.className ?? ""}`} />;
}

export function DataTable({
  headers,
  rows,
  onRowClick,
}: {
  headers: string[];
  rows: ReactNode[][];
  onRowClick?: (rowIndex: number) => void;
}) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>{headers.map((h) => <th key={h} className="data-table-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`hover:bg-secondary/50 data-table-row-hover ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
              >
                {r.map((c, j) => (
                  <td
                    key={j}
                    className="data-table-td"
                    onClick={onRowClick && j === r.length - 1 ? (e) => e.stopPropagation() : undefined}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
