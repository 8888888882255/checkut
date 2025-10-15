import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Facebook, Globe, Phone, Mail, Star, CheckCircle, Award } from "lucide-react";
import { Footer } from "@/components/Footer";
export default function PublicAdminDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 text-gray-800 relative overflow-hidden">
      {/* Decorative animated bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl relative z-10">
        {/* Cover Image with gradient overlay */}
        <div className="relative mb-20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-56 bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 relative">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-1/3 w-20 h-20 border-4 border-white rounded-full"></div>
            </div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12"></div>
          </div>
          
          {/* Avatar positioned over cover */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Avatar className="w-32 h-32 border-8 border-white shadow-2xl ring-4 ring-pink-300">
                <AvatarImage src="https://i.imgur.com/uS2XH9C.png" alt="Nguyễn Hoàng Dương" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-2xl font-bold">ND</AvatarFallback>
              </Avatar>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Nguyễn Hoàng Dương
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Mail className="w-5 h-5 mr-2" />
              Check Facbook
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Shield className="w-5 h-5 mr-2" />
              Check Zalo
            </Button>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Contact Info Card */}
          <Card className="border-2 border-pink-300 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Thông Tin Liên Hệ
                </h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-gray-700">Fb (chính):</span>{" "}
                    <a href="#" className="text-blue-600 hover:underline font-semibold">
                      100005959991439
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-gray-700">Fb (phụ):</span>{" "}
                    <a href="#" className="text-blue-600 hover:underline font-semibold">
                      1849617435
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-gray-700">Zalo:</span>{" "}
                    <a href="#" className="text-pink-600 hover:underline font-semibold">
                      0934567643
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Globe className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="font-medium text-gray-700">Web: CheckUT.Vn</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Insurance Card */}
          <Card className="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-full mb-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Quỹ Bảo Hiểm CS
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                Từ ngày{" "}
                <span className="font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded">
                  09/04/2021
                </span>{" "}
                CS sẽ đảm bảo an toàn cho bạn với số tiền nằm trong Quỹ Bảo Hiểm
              </p>
              <div className="mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                10.000.000 VNĐ
              </div>
              <p className="mt-2 text-xs text-gray-600">
                của <span className="font-semibold text-pink-600">Nguyễn Hoàng Dương</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Card */}
        <Card className="border-2 border-pink-300 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Dịch vụ cung cấp
              </h2>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  Trung gian mua bán (chuyên youtube)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Bank Account Card */}
        <Card className="border-2 border-pink-300 bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Chủ TK "Nguyễn Hoàng Dương"
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { bank: "VCB", number: "1031000002351" },
                { bank: "ACB", number: "162198888" },
                { bank: "VTB", number: "104871181172" },
                { bank: "TEC", number: "19030740859029" },
                { bank: "BIDV", number: "45010004914945" },
                { bank: "Momo", number: "0934567643" }
              ].map((account, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-colors"
                >
                  <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md">
                    {account.bank}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{account.number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}