import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { role } = useRole();
  return <Navigate to={role === "admin" ? "/hoc-sinh" : "/gv/lop-cua-toi"} replace />;
}
