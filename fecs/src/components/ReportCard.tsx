import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface ReportCardProps {
  id: string;
  title: string;
  scamType: string;
  status: "verified" | "pending" | "rejected";
  date: string;
  description?: string;
  reportCount?: number;
}

const statusConfig = {
  verified: { variant: "verified" as const, label: "Đã xác minh", icon: "🟩" },
  pending: { variant: "pending" as const, label: "Đang xử lý", icon: "🟨" },
  rejected: { variant: "rejected" as const, label: "Từ chối", icon: "🟥" },
};

const scamTypeColors: Record<string, string> = {
  "Bán hàng giả": "bg-destructive/10 text-destructive",
  "Tuyển dụng": "bg-warning/10 text-warning",
  "Chuyển tiền": "bg-primary/10 text-primary",
  "Đầu tư": "bg-destructive/10 text-destructive",
  "Khác": "bg-muted text-muted-foreground",
};

export const ReportCard = ({ id, title, scamType, status, date, description, reportCount }: ReportCardProps) => {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:shadow-elegant transition-smooth animate-fade-in group cursor-pointer" onClick={() => navigate(`/report/${id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-smooth">
            {title}
          </CardTitle>
          <Badge variant={statusInfo.variant} className="shrink-0">
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={scamTypeColors[scamType] || scamTypeColors["Khác"]}>
            {scamType}
          </Badge>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        {reportCount && reportCount > 1 && (
          <p className="text-xs text-primary font-medium">
            {reportCount} người khác cũng báo cáo tài khoản này
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation();
          navigate(`/report/${id}`);
        }}>
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};
