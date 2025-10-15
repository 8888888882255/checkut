import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Eye, EyeOff, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AdminManage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("id") !== null;

  const [formData, setFormData] = useState({
    name: isEdit ? "Nguyễn Văn An" : "",
    email: isEdit ? "an.nguyen@Admmo.info" : "",
    role: isEdit ? "SuperAdmin" : "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.role) {
      newErrors.role = "Vui lòng chọn quyền hạn";
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
      } else if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "⚠️ Lỗi xác thực",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "✅ Thành công",
        description: isEdit
          ? "Thông tin quản trị viên đã được cập nhật."
          : "Quản trị viên mới đã được thêm vào hệ thống.",
      });
      navigate("/admin/list");
    }, 1500);
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "Toàn quyền: CRUD + phê duyệt + quản lý người dùng";
      case "Moderator":
        return "Có thể quản lý và phê duyệt báo cáo";
      case "Reviewer":
        return "Chỉ xem và bình luận trên báo cáo";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Button
              variant="ghost"
              className="mb-4 gap-2"
              onClick={() => navigate("/admin/list")}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Button>
            <h1 className="text-3xl font-bold">
              {isEdit ? "Chỉnh sửa Quản trị viên" : "Thêm Quản trị viên"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit
                ? "Cập nhật thông tin tài khoản quản trị viên"
                : "Tạo tài khoản quản trị viên mới"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-soft space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ và Tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@Admmo.info"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Quyền hạn <span className="text-destructive">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => {
                            setFormData({ ...formData, role: value });
                            if (errors.role) setErrors({ ...errors, role: "" });
                          }}
                        >
                          <SelectTrigger
                            className={errors.role ? "border-destructive" : ""}
                          >
                            <SelectValue placeholder="Chọn quyền hạn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                            <SelectItem value="Moderator">Moderator</SelectItem>
                            <SelectItem value="Reviewer">Reviewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {formData.role
                          ? getRoleDescription(formData.role)
                          : "Chọn quyền hạn để xem mô tả"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
                {formData.role && (
                  <p className="text-sm text-muted-foreground">
                    {getRoleDescription(formData.role)}
                  </p>
                )}
              </div>

              {/* Password (only for new admin) */}
              {!isEdit && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Mật khẩu <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ít nhất 8 ký tự"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errors.password)
                            setErrors({ ...errors, password: "" });
                        }}
                        className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          });
                          if (errors.confirmPassword)
                            setErrors({ ...errors, confirmPassword: "" });
                        }}
                        className={
                          errors.confirmPassword ? "border-destructive pr-10" : "pr-10"
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Active Status */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Kích hoạt ngay</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép tài khoản đăng nhập ngay sau khi tạo
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    💾 Lưu quản trị viên
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/admin/list")}
              >
                <X className="h-4 w-4" />
                Hủy bỏ
              </Button>
            </div>
          </form>

          {/* Role Permissions Info */}
          <div className="rounded-lg border bg-card p-6 shadow-soft">
            <h3 className="font-semibold mb-4">📋 Phân quyền hệ thống</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-destructive/10 text-destructive px-2 py-1 rounded font-medium text-xs">
                  SuperAdmin
                </div>
                <p className="text-muted-foreground flex-1">
                  Toàn quyền: CRUD + phê duyệt + quản lý người dùng và quản trị viên
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary px-2 py-1 rounded font-medium text-xs">
                  Moderator
                </div>
                <p className="text-muted-foreground flex-1">
                  Quản lý báo cáo: Xét duyệt, chỉnh sửa, xóa báo cáo
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-secondary/50 text-secondary-foreground px-2 py-1 rounded font-medium text-xs">
                  Reviewer
                </div>
                <p className="text-muted-foreground flex-1">
                  Chỉ xem và bình luận trên báo cáo, không có quyền chỉnh sửa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminManage;
