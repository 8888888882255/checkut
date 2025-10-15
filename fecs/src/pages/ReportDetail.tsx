import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReportCard } from "@/components/ReportCard";
import { ArrowLeft, Calendar, MapPin, AlertTriangle, Shield, FileText } from "lucide-react";

// Mock data for detail
const reportDetails = {
  "1": {
    id: "1",
    title: "Lừa đảo bán iPhone giả trên Facebook",
    scamType: "Bán hàng giả",
    status: "verified" as const,
    date: "2024-10-08",
    platform: "Facebook Marketplace",
    description: `Tôi đã liên hệ với một shop bán iPhone 15 Pro Max trên Facebook Marketplace với giá rẻ hơn thị trường khoảng 5 triệu đồng.

Shop yêu cầu tôi chuyển khoản 50% trước để giữ máy, hứa sẽ ship COD phần còn lại. Sau khi tôi chuyển tiền, shop block tất cả các phương thức liên lạc và không giao hàng.

Tôi đã báo cáo với Facebook và ngân hàng nhưng chưa lấy lại được tiền. Mong mọi người cẩn thận với các shop bán hàng công nghệ giá rẻ bất thường.`,
    reportCount: 3,
    verifiedBy: "Admin - Nguyễn Văn A",
    verifiedDate: "2024-10-08",
    evidence: [
      "Screenshot tin nhắn với shop",
      "Hóa đơn chuyển khoản",
      "Bài đăng bán hàng"
    ],
  }
};

const relatedReports = [
  {
    id: "2",
    title: "Tuyển dụng ảo yêu cầu đặt cọc",
    scamType: "Tuyển dụng",
    status: "verified" as const,
    date: "5 giờ trước",
  },
  {
    id: "3",
    title: "Lừa đảo đầu tư crypto hứa lãi 30%/tháng",
    scamType: "Đầu tư",
    status: "pending" as const,
    date: "1 ngày trước",
  },
];

const statusConfig = {
  verified: { variant: "verified" as const, label: "Đã xác minh", icon: "🟩" },
  pending: { variant: "pending" as const, label: "Đang xử lý", icon: "🟨" },
  rejected: { variant: "rejected" as const, label: "Từ chối", icon: "🟥" },
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const report = reportDetails[id as keyof typeof reportDetails];

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy báo cáo</h1>
            <Button onClick={() => navigate("/reports")}>Quay lại danh sách</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = statusConfig[report.status];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-3">{report.title}</h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/10 text-primary">
                          {report.scamType}
                        </Badge>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.icon} {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{report.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{report.platform}</span>
                    </div>
                  </div>

                  {report.status === "verified" && (
                    <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2 text-success font-medium mb-1">
                        <Shield className="w-5 h-5" />
                        <span>✅ Đã xác minh bởi {report.verifiedBy}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ngày xác minh: {report.verifiedDate}
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-3">Mô tả chi tiết</h3>
                    <div className="whitespace-pre-line text-foreground">
                      {report.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence */}
              <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Bằng chứng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.evidence.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-smooth cursor-pointer"
                      >
                        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              {report.reportCount && report.reportCount > 1 && (
                <Card className="bg-warning/10 border-warning/20 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-warning mb-1">
                          Cảnh báo: Nhiều người đã báo cáo
                        </p>
                        <p className="text-sm text-foreground">
                          {report.reportCount} người khác cũng báo cáo tài khoản/số điện thoại này với nội dung tương tự.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Loại lừa đảo</p>
                    <p className="font-medium">{report.scamType}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nền tảng</p>
                    <p className="font-medium">{report.platform}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.icon} {statusInfo.label}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ngày báo cáo</p>
                    <p className="font-medium">{report.date}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Reports */}
              <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Báo cáo liên quan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedReports.map((relatedReport) => (
                    <div
                      key={relatedReport.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                      onClick={() => navigate(`/report/${relatedReport.id}`)}
                    >
                      <p className="font-medium text-sm mb-2 line-clamp-2">
                        {relatedReport.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {relatedReport.scamType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {relatedReport.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Report Action */}
              <Card className="animate-slide-up bg-destructive/5 border-destructive/20" style={{ animationDelay: "200ms" }}>
                <CardContent className="pt-6">
                  <p className="text-sm font-medium mb-3">Thấy thông tin sai?</p>
                  <Button variant="outline" className="w-full" size="sm">
                    Báo cáo sai thông tin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
