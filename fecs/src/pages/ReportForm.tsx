import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ReportForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scamType: "",
    platform: "",
    contactName: "",
    contactEmail: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.scamType) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Show success modal
    const reportId = Math.floor(Math.random() * 100000);
    toast.success(
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span className="font-semibold">Báo cáo đã được ghi nhận!</span>
        </div>
        <p className="text-sm">Mã tra cứu: #{reportId}</p>
      </div>
    );
    
    setTimeout(() => {
      navigate("/reports");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Báo cáo lừa đảo</h1>
            <p className="text-muted-foreground">
              Chia sẻ thông tin để giúp cộng đồng tránh được những lừa đảo tương tự
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>1️⃣ Thông tin cơ bản</CardTitle>
                <CardDescription>Mô tả chi tiết về vụ việc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề vụ việc <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    placeholder="VD: Lừa đảo bán iPhone giả trên Facebook"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết vụ việc <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Ví dụ: Tôi bị yêu cầu chuyển tiền qua Momo trước khi nhận hàng, sau đó người bán block liên lạc và không giao hàng..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scamType">Loại scam <span className="text-destructive">*</span></Label>
                    <Select value={formData.scamType} onValueChange={(value) => setFormData({ ...formData, scamType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bán hàng giả">Bán hàng giả</SelectItem>
                        <SelectItem value="Tuyển dụng">Tuyển dụng</SelectItem>
                        <SelectItem value="Chuyển tiền">Chuyển tiền</SelectItem>
                        <SelectItem value="Đầu tư">Đầu tư</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Thời gian xảy ra</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Nền tảng / Ứng dụng</Label>
                  <Input
                    id="platform"
                    placeholder="Facebook, Shopee, Zalo..."
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bằng chứng */}
            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle>2️⃣ Bằng chứng</CardTitle>
                <CardDescription>Tải lên ảnh chụp màn hình, tin nhắn, hoặc tài liệu liên quan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Kéo thả tệp vào đây hoặc nhấp để chọn</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF (Tối đa 10 tệp)</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Đã tải lên {files.length} tệp</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg border p-3 flex items-center gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thông tin liên hệ */}
            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle>3️⃣ Thông tin liên hệ (tuỳ chọn)</CardTitle>
                <CardDescription>Thông tin này sẽ được ẩn với người xem công khai</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Tên / Nickname</Label>
                  <Input
                    id="contactName"
                    placeholder="Người báo cáo ẩn danh"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi báo cáo"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
