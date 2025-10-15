import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Mail, Facebook, Linkedin, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock admin data (would be fetched from API)
const mockAdmins: Record<string, any> = {
  "1": {
    id: "1",
    name: "Nguyễn Văn An",
    email: "admin@Admmo.info",
    role: "SuperAdmin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1",
    joinedDate: "2024-01-15",
    verified: true,
    bio: "Thành viên sáng lập Admmo.info, phụ trách tổng thể hoạt động kiểm duyệt và quản lý hệ thống. Cam kết bảo vệ cộng đồng khỏi các hành vi lừa đảo trực tuyến.",
    social: {
      facebook: "https://facebook.com/checkscam",
      linkedin: "https://linkedin.com/in/checkscam",
    }
  },
  "2": {
    id: "2",
    name: "Trần Thị Bình",
    email: "moderator1@Admmo.info",
    role: "Moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin2",
    joinedDate: "2024-02-20",
    verified: true,
    bio: "Thành viên ban kiểm duyệt Admmo.info, phụ trách xác minh báo cáo lừa đảo và quản lý nội dung cộng đồng.",
    social: {
      facebook: "https://facebook.com/checkscam",
    }
  },
  "3": {
    id: "3",
    name: "Lê Quốc Cường",
    email: "reviewer1@Admmo.info",
    role: "Reviewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin3",
    joinedDate: "2024-03-10",
    verified: true,
    bio: "Chuyên viên đánh giá và phân tích các báo cáo lừa đảo, đảm bảo tính chính xác của thông tin trên nền tảng.",
    social: {}
  },
  "4": {
    id: "4",
    name: "Phạm Thị Dung",
    email: "moderator2@Admmo.info",
    role: "Moderator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin4",
    joinedDate: "2024-04-05",
    verified: true,
    bio: "Thành viên ban kiểm duyệt, hỗ trợ xử lý các báo cáo khẩn cấp và tương tác với cộng đồng người dùng.",
    social: {
      linkedin: "https://linkedin.com/in/checkscam",
    }
  },
};

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

const maskEmail = (email: string) => {
  const [username, domain] = email.split("@");
  const masked = username.slice(0, 3) + "***";
  return `${masked}@${domain}`;
};

export default function PublicAdminDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const admin = id ? mockAdmins[id] : null;

  if (!admin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy quản trị viên</h1>
          <Link to="/admins">
            <Button variant="hero">Quay lại danh sách</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    toast({
      title: "✅ Đã gửi tin nhắn",
      description: "Tin nhắn của bạn đã được gửi đến quản trị viên.",
    });
    setIsDialogOpen(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/admins" className="hover:text-primary transition-colors">
            Ban quản trị
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{admin.name}</span>
        </div>

        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback className="text-3xl">
                  {admin.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{admin.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant={getRoleBadgeVariant(admin.role)} className="text-base px-4 py-1">
                      {admin.role}
                    </Badge>
                    {admin.verified && (
                      <Badge variant="outline" className="border-green-500 text-green-500 text-base px-4 py-1">
                        ✅ Đã xác minh
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Tham gia: {new Date(admin.joinedDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Gửi tin nhắn
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Gửi tin nhắn đến {admin.name}</DialogTitle>
                      <DialogDescription>
                        Điền thông tin bên dưới để gửi tin nhắn đến quản trị viên.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Nội dung</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" variant="hero" className="w-full">
                        Gửi tin nhắn
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Information Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Giới thiệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{admin.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{maskEmail(admin.email)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vai trò</p>
                  <Badge variant={getRoleBadgeVariant(admin.role)}>{admin.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày tham gia</p>
                  <p className="font-medium">
                    {new Date(admin.joinedDate).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {Object.keys(admin.social).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mạng xã hội</CardTitle>
                  <CardDescription>Kết nối với quản trị viên</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {admin.social.facebook && (
                    <a
                      href={admin.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {admin.social.linkedin && (
                    <a
                      href={admin.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Gửi email</span>
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
