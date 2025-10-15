import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReportCard } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

// Mock data
const recentReports = [
  {
    id: "1",
    title: "Lừa đảo bán iPhone giả trên Facebook",
    scamType: "Bán hàng giả",
    status: "verified" as const,
    date: "2 giờ trước",
    description: "Shop yêu cầu chuyển khoản trước, sau đó block liên lạc và không giao hàng",
    reportCount: 3,
  },
  {
    id: "2",
    title: "Tuyển dụng ảo yêu cầu đặt cọc",
    scamType: "Tuyển dụng",
    status: "verified" as const,
    date: "5 giờ trước",
    description: "Công ty ma yêu cầu nộp 5 triệu đồng để đảm bảo việc làm",
    reportCount: 7,
  },
  {
    id: "3",
    title: "Lừa đảo đầu tư crypto hứa lãi 30%/tháng",
    scamType: "Đầu tư",
    status: "pending" as const,
    date: "1 ngày trước",
    description: "Sàn giao dịch giả mạo, không rút được tiền sau khi nạp",
  },
  {
    id: "4",
    title: "Giả mạo ngân hàng yêu cầu xác thực tài khoản",
    scamType: "Chuyển tiền",
    status: "verified" as const,
    date: "1 ngày trước",
    description: "Tin nhắn giả mạo ngân hàng, link lừa đảo đánh cắp mật khẩu",
    reportCount: 12,
  },
  {
    id: "5",
    title: "Bán khóa học online không tồn tại",
    scamType: "Bán hàng giả",
    status: "pending" as const,
    date: "2 ngày trước",
    description: "Thu tiền khóa học nhưng không cung cấp bất kỳ tài liệu nào",
  },
  {
    id: "6",
    title: "Lừa đảo qua Zalo giả danh người thân",
    scamType: "Chuyển tiền",
    status: "verified" as const,
    date: "3 ngày trước",
    description: "Hack Zalo và giả danh người thân để xin tiền khẩn cấp",
    reportCount: 5,
  },
];

const verifiedReports = recentReports.filter((r) => r.status === "verified");

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/reports?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative gradient-hero py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Cộng đồng chống{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  lừa đảo
                </span>{" "}
                Việt Nam
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Tìm kiếm, báo cáo và xác minh các vụ việc đáng nghi
              </p>

              {/* Central Search */}
              <form onSubmit={handleSearch} className="mt-8">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nhập số tài khoản, tên người bán, hoặc link cần kiểm tra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 h-14 text-base rounded-2xl border-2 focus:border-primary shadow-elegant"
                  />
                </div>
              </form>

              {/* Button Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 flex-wrap">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/report")}
                >
                  🚨 Báo cáo ngay
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/policy")}
                >
                  📘 Chính Sách
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/contact")}
                >
                  📞 Liên Hệ
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Báo cáo gần đây</h2>
              <Button variant="link" onClick={() => navigate("/reports")}>
                Xem tất cả →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report, index) => (
                <div key={report.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <ReportCard {...report} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold">Đã xác thực</h2>
              <span className="px-4 py-1.5 rounded-full bg-success text-success-foreground text-sm font-semibold">
                ✅ Đã xác thực bởi Admin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedReports.slice(0, 3).map((report) => (
                <ReportCard key={report.id} {...report} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
