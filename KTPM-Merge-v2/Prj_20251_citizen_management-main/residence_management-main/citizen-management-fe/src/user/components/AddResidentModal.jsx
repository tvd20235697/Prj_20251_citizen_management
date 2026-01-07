import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "http://localhost:8080/api";

export default function AddResidentModal({ householdId, isOpen, onClose, onAdd }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    hoTen: "",
    gioiTinh: "",
    ngaySinh: "",
    cmnd: "",
    ngheNghiep: "",
    quanHeVoiChuHo: "Con",
    trangThai: "Moi sinh",
    ghiChu: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (!user || !user.maTaiKhoan) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      // Tạo yêu cầu thêm nhân khẩu
      const yeuCauData = {
        maTaiKhoan: user.maTaiKhoan,
        loaiYeuCau: "THEM",
        maNhanKhau: null,
        duLieu: JSON.stringify({
          ...formData,
          soHoKhau: householdId,
        }),
        ghiChu: formData.ghiChu || "Yêu cầu thêm nhân khẩu mới",
      };

      const response = await fetch(`${API_BASE}/yeucau`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeuCauData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Gửi yêu cầu thất bại");
      }

      setMessage({ type: "success", text: "Yêu cầu thêm nhân khẩu đã được gửi. Vui lòng chờ xác thực từ cán bộ." });
      
      // Reset form
      setFormData({
        hoTen: "",
        gioiTinh: "",
        ngaySinh: "",
        cmnd: "",
        ngheNghiep: "",
        quanHeVoiChuHo: "Con",
        trangThai: "Moi sinh",
        ghiChu: "",
      });

      // Call onAdd callback để refresh danh sách yêu cầu (nếu cần)
      if (onAdd) {
        onAdd({ success: true });
      }

      // Đóng modal sau 2 giây
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra khi gửi yêu cầu" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Thêm nhân khẩu mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form id="add-resident-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính *</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.gioiTinh}
              onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh *</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.ngaySinh}
              onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CCCD</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.cmnd}
              onChange={(e) => setFormData({ ...formData, cmnd: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nghề nghiệp</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.ngheNghiep}
              onChange={(e) => setFormData({ ...formData, ngheNghiep: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quan hệ với chủ hộ *</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.quanHeVoiChuHo}
              onChange={(e) => setFormData({ ...formData, quanHeVoiChuHo: e.target.value })}
            >
              <option value="Con">Con</option>
              <option value="Vợ">Vợ</option>
              <option value="Chồng">Chồng</option>
              <option value="Cha">Cha</option>
              <option value="Mẹ">Mẹ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái *</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.trangThai}
              onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
            >
              <option value="Moi sinh">Mới sinh</option>
              <option value="Thuong tru">Thường trú</option>
              <option value="Qua doi">Qua đời</option>
              <option value="Chuyen di">Chuyển đi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              value={formData.ghiChu}
              onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
              placeholder="Ghi chú thêm về yêu cầu này (nếu có)"
            />
          </div>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}
        </form>
        <div className="p-6 border-t flex gap-3 flex-shrink-0 bg-white">
          <button
            type="submit"
            form="add-resident-form"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {submitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu thêm nhân khẩu"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

