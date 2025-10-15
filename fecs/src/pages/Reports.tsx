import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReportCard } from "@/components/ReportCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data - same as Home
const allReports = [
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
  {
    id: "7",
    title: "Shop Shopee bán hàng nhái giá rẻ",
    scamType: "Bán hàng giả",
    status: "verified" as const,
    date: "3 ngày trước",
    description: "Bán hàng giả mạo nhãn hiệu nổi tiếng với giá cực rẻ",
  },
  {
    id: "8",
    title: "Lừa đảo game nạp thẻ không lên tiền",
    scamType: "Khác",
    status: "pending" as const,
    date: "4 ngày trước",
    description: "Nạp thẻ vào game nhưng không nhận được kim cương",
  },
];

export default function Reports() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [scamType, setScamType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredReports = allReports.filter((report) => {
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = scamType === "all" || report.scamType === scamType;
    const matchesStatus = status === "all" || report.status === status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Danh sách báo cáo</h1>
            <p className="text-muted-foreground">
              Tìm kiếm và lọc các báo cáo lừa đảo từ cộng đồng
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm báo cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                Lọc:
              </div>
              
              <Select value={scamType} onValueChange={setScamType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Loại scam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="Bán hàng giả">Bán hàng giả</SelectItem>
                  <SelectItem value="Tuyển dụng">Tuyển dụng</SelectItem>
                  <SelectItem value="Chuyển tiền">Chuyển tiền</SelectItem>
                  <SelectItem value="Đầu tư">Đầu tư</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="verified">Đã xác minh</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="verified">Đã xác minh</SelectItem>
                  <SelectItem value="most-reported">Nhiều báo cáo nhất</SelectItem>
                </SelectContent>
              </Select>

              {(scamType !== "all" || status !== "all" || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setScamType("all");
                    setStatus("all");
                    setSearchQuery("");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredReports.length} kết quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <div key={report.id} style={{ animationDelay: `${index * 50}ms` }}>
                <ReportCard {...report} />
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Không tìm thấy báo cáo nào phù hợp
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setScamType("all");
                  setStatus("all");
                  setSearchQuery("");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
