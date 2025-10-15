import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Policy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">Chính sách & Điều khoản</h1>

          <div className="space-y-8">
            <Card className="animate-slide-up">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">1. Chính sách bảo mật</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Admmo.info cam kết bảo vệ quyền riêng tư của người dùng. Chúng tôi chỉ thu thập thông tin cần thiết để vận hành dịch vụ và không chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý của bạn.
                  </p>
                  <p>
                    <strong>Thông tin chúng tôi thu thập:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Thông tin đăng ký tài khoản (email, tên đăng nhập)</li>
                    <li>Nội dung báo cáo lừa đảo và bằng chứng đính kèm</li>
                    <li>Thông tin liên hệ tùy chọn (được bảo mật)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">2. Điều khoản sử dụng</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Khi sử dụng Admmo.info, bạn đồng ý:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Cung cấp thông tin chính xác và trung thực</li>
                    <li>Không sử dụng nền tảng để vu khống hoặc phỉ báng người khác</li>
                    <li>Tôn trọng quyền riêng tư của người khác</li>
                    <li>Tuân thủ pháp luật Việt Nam và các quy định của nền tảng</li>
                    <li>Chịu trách nhiệm với nội dung mình đăng tải</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">3. Trách nhiệm của người dùng</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Người dùng có trách nhiệm:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Đảm bảo tính chính xác của thông tin báo cáo</li>
                    <li>Cung cấp bằng chứng hợp lệ để hỗ trợ báo cáo</li>
                    <li>Không lạm dụng hệ thống để spam hoặc gây nhiễu</li>
                    <li>Hợp tác với admin trong quá trình xác minh</li>
                    <li>Cập nhật thông tin khi có thay đổi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">4. Xử lý vi phạm</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Admmo.info có quyền:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Xóa hoặc chỉnh sửa nội dung vi phạm quy định</li>
                    <li>Tạm khóa hoặc xóa tài khoản vi phạm nghiêm trọng</li>
                    <li>Từ chối duyệt báo cáo không đủ bằng chứng hoặc sai sự thật</li>
                    <li>Yêu cầu bổ sung thông tin khi cần thiết</li>
                    <li>Hợp tác với cơ quan chức năng khi cần thiết</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">5. Giới hạn trách nhiệm</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Admmo.info là nền tảng chia sẻ thông tin cộng đồng. Chúng tôi không chịu trách nhiệm:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Về tính chính xác tuyệt đối của mọi báo cáo</li>
                    <li>Về các quyết định giao dịch của người dùng</li>
                    <li>Về thiệt hại phát sinh từ việc sử dụng thông tin trên nền tảng</li>
                    <li>Về tranh chấp giữa các bên liên quan</li>
                  </ul>
                  <p className="mt-4">
                    Người dùng nên tự xác minh thông tin và thận trọng trong mọi giao dịch.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">6. Liên hệ</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> support@Admmo.info</li>
                    <li><strong>Hotline:</strong> 1900-xxxx</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/30 text-center text-sm text-muted-foreground">
            Cập nhật lần cuối: 10/10/2025
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
