import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, CheckCircle2, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Về Admmo.info
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-slide-up">
              Nền tảng cộng đồng hàng đầu giúp người Việt Nam bảo vệ bản thân khỏi các hình thức lừa đảo trực tuyến
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Admmo.info được tạo ra với mục tiêu xây dựng một cộng đồng minh bạch và tin cậy, 
                nơi mọi người có thể chia sẻ, tìm kiếm và xác minh thông tin về các vụ lừa đảo trực tuyến. 
                Chúng tôi tin rằng thông tin là vũ khí mạnh nhất để chống lại tội phạm mạng.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card className="animate-slide-up">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Bảo vệ cộng đồng</h3>
                      <p className="text-sm text-muted-foreground">
                        Cung cấp thông tin chính xác và kịp thời về các vụ lừa đảo để giúp mọi người tránh trở thành nạn nhân.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cộng đồng mạnh mẽ</h3>
                      <p className="text-sm text-muted-foreground">
                        Kết nối hàng nghìn người dùng cùng nhau chia sẻ kinh nghiệm và cảnh báo về các mối nguy hiểm.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Xác minh chính xác</h3>
                      <p className="text-sm text-muted-foreground">
                        Đội ngũ admin kiểm duyệt và xác minh từng báo cáo để đảm bảo tính chính xác và đáng tin cậy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Phát triển bền vững</h3>
                      <p className="text-sm text-muted-foreground">
                        Liên tục cải thiện và phát triển tính năng để phục vụ cộng đồng ngày càng tốt hơn.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Cách hoạt động</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Báo cáo</h3>
                    <p className="text-muted-foreground">
                      Người dùng gửi báo cáo về các vụ lừa đảo mà họ gặp phải hoặc phát hiện, kèm theo bằng chứng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Kiểm duyệt</h3>
                    <p className="text-muted-foreground">
                      Đội ngũ admin xem xét, kiểm tra tính xác thực của báo cáo dựa trên bằng chứng được cung cấp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Xác minh & Công khai</h3>
                    <p className="text-muted-foreground">
                      Báo cáo được xác minh sẽ được đánh dấu và hiển thị công khai để cộng đồng có thể tham khảo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Tìm kiếm & Bảo vệ</h3>
                    <p className="text-muted-foreground">
                      Người dùng có thể tìm kiếm thông tin trước khi giao dịch để tránh trở thành nạn nhân.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Rules */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Quy tắc cộng đồng</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p>Cung cấp thông tin chính xác, trung thực khi báo cáo</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p>Đính kèm bằng chứng cụ thể để hỗ trợ quá trình xác minh</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p>Tôn trọng quyền riêng tư của người khác, không đăng thông tin cá nhân không liên quan</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p>Không sử dụng nền tảng để vu khống, phỉ báng người khác</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p>Hợp tác với admin trong quá trình xác minh khi được yêu cầu</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
