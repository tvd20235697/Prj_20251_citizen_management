import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../components/UserLayout";

const API_BASE = "http://localhost:8080/api";

export default function UserHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !user.soHoKhau) {
        setLoading(false);
        setError("Không tìm thấy số hộ khẩu");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/nhankhau/lich-su-ho-khau/${user.soHoKhau}`);
        
        if (!response.ok) {
          throw new Error("Không thể tải lịch sử biến động");
        }

        const data = await response.json();
        // Sắp xếp theo ngày thay đổi (mới nhất trước)
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => {
              const dateA = new Date(a.ngayThayDoi || 0);
              const dateB = new Date(b.ngayThayDoi || 0);
              return dateB - dateA;
            })
          : [];
        
        setHistory(sortedData);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.message || "Có lỗi xảy ra khi tải lịch sử");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTypeLabel = (noiDung) => {
    if (!noiDung) return "Thay đổi";
    const content = noiDung.toLowerCase();
    if (content.includes("tách hộ") || content.includes("tach ho")) return "Tách hộ";
    if (content.includes("thay đổi chủ hộ") || content.includes("thay doi chu ho")) return "Thay đổi chủ hộ";
    if (content.includes("thêm nhân khẩu") || content.includes("them nhan khau")) return "Thêm nhân khẩu";
    if (content.includes("xóa nhân khẩu") || content.includes("xoa nhan khau")) return "Xóa nhân khẩu";
    if (content.includes("cập nhật") || content.includes("cap nhat")) return "Cập nhật";
    return "Thay đổi";
  };

  return (
    <UserLayout
      title="Lịch sử biến động hộ khẩu"
      subtitle="Các lần thay đổi liên quan đến hộ khẩu của bạn"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Đang tải lịch sử...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Chưa có lịch sử biến động nào</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            {history.map((item) => (
              <div
                key={item.maLichSuThayDoi}
                className="flex items-start gap-3 border-b border-gray-200 last:border-none pb-3 last:pb-0"
              >
                <div className="mt-1">
                  <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                    {user?.fullName?.[0] || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.noiDungThayDoi || "Thay đổi hộ khẩu"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(item.ngayThayDoi)} • {getTypeLabel(item.noiDungThayDoi)}
                  </p>
                  {item.ghiChu && (
                    <p className="text-sm text-gray-700 mt-1">{item.ghiChu}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}


