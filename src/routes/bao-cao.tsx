import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui-bits";
import { BarChart3, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/bao-cao")({ component: Page });

const reports = [
  "Báo cáo điểm danh học sinh",
  "Báo cáo số suất ăn",
  "Báo cáo học phí phải thu",
  "Báo cáo đã thu / còn nợ",
  "Báo cáo phiếu thu đã hủy",
  "Báo cáo công giáo viên",
  "Báo cáo lương giáo viên",
  "Báo cáo thu chi",
  "Báo cáo lợi nhuận tạm tính",
];

function Page() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((r) => (
        <Card key={r} className="hover:border-primary cursor-pointer transition">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{r}</div>
              <div className="text-xs text-muted-foreground mt-1">Lọc theo tháng / lớp / cơ sở · Xuất Excel / PDF</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-medium">
                <FileSpreadsheet className="h-4 w-4" /> Mở báo cáo
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
