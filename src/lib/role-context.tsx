import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "admin" | "teacher";

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
  teacherName: string;
}

const Ctx = createContext<RoleCtx>({ role: "admin", setRole: () => {}, teacherName: "Cô Lý" });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  return <Ctx.Provider value={{ role, setRole, teacherName: "Cô Lý" }}>{children}</Ctx.Provider>;
}

export const useRole = () => useContext(Ctx);
