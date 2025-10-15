import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, TrendingUp, AlertCircle, Users, Check, X } from "lucide-react";
import { toast } from "sonner";

const stats = [
  {
    label: "Tổng báo cáo",
    value: "5,231",
    change: "+12% so với tháng trước",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    label: "Đang chờ",
    value: "24",
    change: "Cần xem xét",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  {
    label: "Đã xác minh",
    value: "1,024",
    change: "19.6% tổng báo cáo",
    icon: Check,
    color: "text-green-500",
  },
  {
    label: "Người dùng",
    value: "3,847",
    change: "+8% so với tháng trước",
    icon: Users,
    color: "text-purple-500",
  },
];

const chartData = [
  { name: "T2", reports: 12 },
  { name: "T3", reports: 19 },
  { name: "T4", reports: 15 },
  { name: "T5", reports: 25 },
  { name: "T6", reports: 22 },
  { name: "T7", reports: 30 },
  { name: "CN", reports: 28 },
];

const scamTypeData = [
  { name: "Bán hàng", count: 234 },
  { name: "Đầu tư", count: 189 },
  { name: "Tuyển dụng", count: 156 },
  { name: "Chuyển tiền", count: 143 },
  { name: "Khác", count: 98 },
];

const pendingReports = [
  {
    id: "3",
    title: "Lừa đảo đầu tư crypto hứa lãi 30%/tháng",
    type: "Đầu tư",
    date: "2024-10-09",
  },
  {
    id: "5",
    title: "Bán khóa học online không tồn tại",
    type: "Bán hàng giả",
    date: "2024-10-08",
  },
  {
    id: "8",
    title: "Lừa đảo game nạp thẻ không lên tiền",
    type: "Khác",
    date: "2024-10-06",
  },
];

export default function Admin() {
  const handleVerify = (id: string) => {
    toast.success(`Đã duyệt báo cáo #${id}`);
  };

  const handleReject = (id: string) => {
    toast.error(`Đã từ chối báo cáo #${id}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold">📊 Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Tổng quan hệ thống quản lý
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Reports Chart */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Báo cáo theo ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Scam Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Loại lừa đảo phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scamTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Reports Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>⏳ Báo cáo chờ xét duyệt</CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Ngày gửi</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((report) => (
                      <TableRow
                        key={report.id}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          #{report.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {report.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(report.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(report.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
