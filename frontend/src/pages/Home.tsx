import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/reports?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const mockAdmins = [
    { id: 1, name: "Nguyễn Hoàng Dương", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=duong1" },
    { id: 2, name: "Tống Hoàng Phương Dương", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=duong2" },
    { id: 3, name: "Nguyễn Hồng Dương", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=duong3" },
    { id: 4, name: "Trần Ngọc Thu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thu4" },
    { id: 5, name: "Phạm Văn Huy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=huy5" },
    { id: 6, name: "Nguyễn Văn Phúc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=phuc6" },
    { id: 7, name: "Zolo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zolo7" },
    { id: 8, name: "Huỳnh Công Sang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sang8" },
    { id: 9, name: "Huỳnh Lê Minh Hiếu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hieu9" },
    { id: 10, name: "Hoàng Văn Mạnh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=manh10" },
    { id: 11, name: "Bùi Đức Long", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=long11" },
    { id: 12, name: "Đỗ Văn Hạnh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hanh12" },
    { id: 13, name: "Dương Thị Vân", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=van13" },
    { id: 14, name: "Duy Nguyễn", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=duy14" },
    { id: 15, name: "Lò Văn Thực", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thuc15" },
  ];

  const filteredAdmins = mockAdmins.filter((a) =>
    a.name.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-pink-100">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative gradient-hero py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 flex-wrap">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/about")}
                >
                  🚨 Giới Thiệu
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/policy")}
                >
                  📘 Chính Sách
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Admin List Section */}
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl text-center font-bold text-pink-600 mb-6">
            💖 Danh Sách Admin
          </h1>

          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
            <Input
              placeholder="🔍 Tìm admin theo tên..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="pl-10 text-center border-pink-300 focus:border-pink-500 focus:ring-pink-200 rounded-full shadow-sm"
            />
          </div>

          <div className="border border-pink-300 rounded-2xl p-4 md:p-6 bg-pink-50/40 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-6 text-lg text-pink-700">
              <span>👤</span> Tìm Admin theo số thứ tự:
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-5 text-center">
              {filteredAdmins.map((admin, index) => (
                <div
                  key={admin.id}
                  className="flex flex-col items-center transition-transform duration-200 hover:scale-105"
                >
                  <div className="relative group">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-pink-300 group-hover:border-pink-500 transition-all"
                    />
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-800 mt-2 leading-tight">
                    {admin.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}