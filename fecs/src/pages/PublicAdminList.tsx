import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock admin data
const mockAdmins = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "admin@Admmo.info",
    role: "SuperAdmin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1",
    joinedDate: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "moderator1@Admmo.info",
    role: "Moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin2",
    joinedDate: "2024-02-20",
    verified: true,
  },
  {
    id: "3",
    name: "Lê Quốc Cường",
    email: "reviewer1@Admmo.info",
    role: "Reviewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin3",
    joinedDate: "2024-03-10",
    verified: true,
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "moderator2@Admmo.info",
    role: "Moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin4",
    joinedDate: "2024-04-05",
    verified: true,
  },
];

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "SuperAdmin":
      return "destructive";
    case "Moderator":
      return "default";
    case "Reviewer":
      return "secondary";
    default:
      return "outline";
  }
};

export default function PublicAdminList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredAdmins = mockAdmins.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    const csv = "Name,Email,Role,Joined Date\n" +
      filteredAdmins.map(a => `${a.name},${a.email},${a.role},${a.joinedDate}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admins.csv";
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Ban Quản Trị
          </h1>
          <p className="text-muted-foreground">
            Danh sách các quản trị viên chính thức của Admmo.info
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm quản trị viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
              <SelectItem value="Moderator">Moderator</SelectItem>
              <SelectItem value="Reviewer">Reviewer</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Xuất CSV
          </Button>
        </div>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id} className="group hover:shadow-elegant hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback>{admin.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{admin.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant={getRoleBadgeVariant(admin.role)}>
                        {admin.role}
                      </Badge>
                      {admin.verified && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          ✅ Đã xác minh
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Tham gia: {new Date(admin.joinedDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <Link to={`/admins/${admin.id}`} className="w-full">
                    <Button variant="hero" className="w-full group-hover:scale-105 transition-transform">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy quản trị viên nào.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
