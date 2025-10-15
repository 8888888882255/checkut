"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";

// Định nghĩa interface cho dữ liệu media
interface MediaItem {
  media_id: number;
  original_path: string;
  type_name: string;
}

// Định nghĩa interface cho loại media
interface MediaType {
  key: string;
  label: string;
}

// Danh sách các loại media
const LOAI_MEDIA: MediaType[] = [
  { key: "logo", label: "Logo" },
  { key: "thuonghieu", label: "Ảnh thương hiệu" },
  { key: "nen", label: "Ảnh nền" },
  { key: "avt_macdinh", label: "Ảnh đại diện mặc định" },
  { key: "bia_macdinh", label: "Ảnh bìa mặc định" },
  { key: "banner1", label: "Banner 1" },
  { key: "banner2", label: "Banner 2" },
  { key: "banner3", label: "Banner 3" },
  { key: "banner4", label: "Banner 4" },
  { key: "banner5", label: "Banner 5" },
];

export default function LoaiMediaAdmin() {
  const [mediaData, setMediaData] = useState<Record<string, MediaItem | null>>({});
  const [selectedType, setSelectedType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy dữ liệu tất cả loại media
  const fetchAllMedia = useCallback(async () => {
    try {
      setLoading(true);
      const result: Record<string, MediaItem | null> = {};
      // Sử dụng Promise.all để gọi API song song, tăng hiệu suất
      const promises = LOAI_MEDIA.map(async (item) => {
        const res = await fetch(`/api/media/type/${item.key}`);
        if (res.ok) {
          return [item.key, await res.json()];
        }
        return [item.key, null];
      });
      const resolved = await Promise.all(promises);
      resolved.forEach(([key, data]) => {
        result[key] = data;
      });
      setMediaData(result);
    } catch (error) {
      console.error("Lỗi khi tải danh sách media:", error);
      toast.error("Không thể tải danh sách media.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi fetchAllMedia khi component mount
  useEffect(() => {
    fetchAllMedia();
  }, [fetchAllMedia]);

  // Xử lý upload file
  const handleUpload = async () => {
    if (!selectedType || !file) {
      toast.warning("Vui lòng chọn loại media và file trước khi upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type_name", selectedType);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      toast.success("Upload media thành công!");
      setFile(null);
      setSelectedType("");
      await fetchAllMedia(); // Cập nhật danh sách media sau khi upload
    } catch (error) {
      console.error("Lỗi khi upload media:", error);
      toast.error("Đã xảy ra lỗi khi upload media.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa media
  const handleDelete = async (id: number, typeLabel: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${typeLabel}?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      toast.success(`Đã xóa ${typeLabel} thành công!`);
      await fetchAllMedia(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error(`Lỗi khi xóa ${typeLabel}:`, error);
      toast.error(`Không thể xóa ${typeLabel}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Tiêu đề */}
          <div>
            <h1 className="text-3xl font-bold">🖼️ Quản lý Loại Media</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý, upload hoặc xóa các loại hình ảnh hệ thống như logo, banner, ảnh nền, v.v.
            </p>
          </div>

          {/* Phần Upload */}
          <Card>
            <CardHeader>
              <CardTitle>⬆️ Upload Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  <option value="">-- Chọn loại media --</option>
                  {LOAI_MEDIA.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  accept="image/*,image/gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full md:w-1/3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  disabled={loading}
                />

                <Button
                  onClick={handleUpload}
                  disabled={loading || !selectedType || !file}
                  className="w-full md:w-1/4"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  {loading ? "Đang tải..." : "Upload"}
                </Button>
              </div>
              {file && (
                <p className="text-sm mt-3 text-muted-foreground">
                  File đã chọn: <span className="font-medium">{file.name}</span> (
                  {(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Danh sách media */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Danh sách Loại Media</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">STT</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Đường dẫn</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LOAI_MEDIA.map((item, idx) => {
                    const data = mediaData[item.key];
                    return (
                      <TableRow key={item.key}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-medium">{item.label}</TableCell>
                        <TableCell>
                          {data?.original_path ? (
                            <img
                              src={data.original_path}
                              alt={item.label}
                              className="w-20 h-12 object-cover rounded-md border"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-muted-foreground flex items-center gap-1">
                              <ImagePlus className="h-4 w-4" /> Chưa có
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {data?.original_path || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {data ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(data.media_id, item.label)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">Không có dữ liệu</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {loading && (
                <p className="text-center text-muted-foreground mt-4">Đang tải dữ liệu...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}