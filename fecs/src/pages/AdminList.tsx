import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Trash2, Lock, Unlock, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SuperAdmin" | "Moderator" | "Reviewer";
  createdAt: string;
  status: "Active" | "Locked";
  avatar?: string;
}

const mockAdmins: Admin[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@Admmo.info",
    role: "SuperAdmin",
    createdAt: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh.tran@Admmo.info",
    role: "Moderator",
    createdAt: "2024-02-20",
    status: "Active",
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    email: "cuong.le@Admmo.info",
    role: "Reviewer",
    createdAt: "2024-03-10",
    status: "Locked",
  },
];

const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleLock = (admin: Admin) => {
    setAdmins(
      admins.map((a) =>
        a.id === admin.id
          ? { ...a, status: a.status === "Active" ? "Locked" : "Active" }
          : a
      )
    );
    toast({
      title: admin.status === "Active" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      description: `${admin.name} đã được ${admin.status === "Active" ? "khóa" : "mở khóa"}.`,
    });
  };

  const handleDelete = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
      toast({
        title: "Đã xóa quản trị viên",
        description: `${selectedAdmin.name} đã được xóa khỏi hệ thống.`,
      });
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">👨‍💻 Danh sách Quản trị viên</h1>
              <p className="text-muted-foreground mt-1">
                Quản lý tất cả tài khoản quản trị viên
              </p>
            </div>
            <Link to="/admin/manage">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm Admin
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, email hoặc quyền hạn…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-lg border bg-card shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Quyền</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={admin.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(admin.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(admin.role)}>
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.status === "Active" ? "success" : "destructive"}
                      >
                        {admin.status === "Active" ? "🟢 Active" : "🔴 Locked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/manage?id=${admin.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleLock(admin)}
                        >
                          {admin.status === "Active" ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-lg border bg-card p-4 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={admin.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(admin.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{admin.name}</h3>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={admin.status === "Active" ? "success" : "destructive"}
                  >
                    {admin.status === "Active" ? "🟢" : "🔴"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={getRoleBadgeVariant(admin.role)}>
                    {admin.role}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/admin/manage?id=${admin.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLock(admin)}
                  >
                    {admin.status === "Active" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Không tìm thấy quản trị viên nào.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa quản trị viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedAdmin?.name}? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminList;
