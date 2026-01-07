import { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "http://localhost:8080/api";

export default function ResidentDetailModal({ resident, isOpen, onClose, onUpdate, onDelete, initialMode = null }) {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    gioiTinh: "",
    ngaySinh: "",
    cmnd: "",
    ngheNghiep: "",
    quanHeVoiChuHo: "",
    trangThai: "Thuong tru",
    ghiChu: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Initialize form data when resident changes
  useEffect(() => {
    if (resident && isOpen) {
      setFormData({
        hoTen: resident.hoTen || resident.name || "",
        gioiTinh: resident.gioiTinh || resident.gender || "",
                ngaySinh: resident.ngaySinh 
                  ? (resident.ngaySinh.includes("T") 
                      ? resident.ngaySinh.split("T")[0] 
                      : resident.ngaySinh)
                  : (resident.birthDate 
                      ? (resident.birthDate.includes("T") 
                          ? resident.birthDate.split("T")[0] 
                          : resident.birthDate)
                      : ""),
        cmnd: resident.cmnd || resident.cccd || resident.soCCCD || "",
        ngheNghiep: resident.ngheNghiep || resident.occupation || "",
        quanHeVoiChuHo: resident.quanHeVoiChuHo || "",
        trangThai: resident.trangThai || "Thuong tru",
        ghiChu: "",
      });
    }
  }, [resident, isOpen]);

  // Set mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen && resident) {
      if (initialMode === "edit") {
        setIsEditMode(true);
        setIsDeleteMode(false);
      } else if (initialMode === "delete") {
        setIsDeleteMode(true);
        setIsEditMode(false);
      } else {
        setIsEditMode(false);
        setIsDeleteMode(false);
      }
    } else if (!isOpen) {
      // Reset modes when modal closes
      setIsEditMode(false);
      setIsDeleteMode(false);
    }
  }, [isOpen, initialMode, resident]);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log("ResidentDetailModal opened:", { isOpen, resident, initialMode, isEditMode, isDeleteMode });
    }
  }, [isOpen, resident, initialMode, isEditMode, isDeleteMode]);

  if (!isOpen || !resident) {
    return null;
  }

  const handleEdit = () => {
    setIsEditMode(true);
    setIsDeleteMode(false);
  };

  const handleDelete = () => {
    setIsDeleteMode(true);
    setIsEditMode(false);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (!user || !user.maTaiKhoan) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      const yeuCauData = {
        maTaiKhoan: user.maTaiKhoan,
        loaiYeuCau: "SUA",
        maNhanKhau: resident.maNhanKhau || resident.id,
        duLieu: JSON.stringify(formData),
        ghiChu: formData.ghiChu || "Yêu cầu sửa thông tin nhân khẩu",
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

      setMessage({ type: "success", text: "Yêu cầu sửa nhân khẩu đã được gửi. Vui lòng chờ xác thực từ cán bộ." });
      setIsEditMode(false);
      
      if (onUpdate) onUpdate({ success: true });
      
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      if (!user || !user.maTaiKhoan) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      const yeuCauData = {
        maTaiKhoan: user.maTaiKhoan,
        loaiYeuCau: "XOA",
        maNhanKhau: resident.maNhanKhau || resident.id,
        duLieu: JSON.stringify({ maNhanKhau: resident.maNhanKhau || resident.id }),
        ghiChu: formData.ghiChu || "Yêu cầu xóa nhân khẩu",
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

      setMessage({ type: "success", text: "Yêu cầu xóa nhân khẩu đã được gửi. Vui lòng chờ xác thực từ cán bộ." });
      setIsDeleteMode(false);
      
      if (onDelete) onDelete({ success: true });
      
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Chi tiết nhân khẩu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {isDeleteMode ? (
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">Xác nhận xóa nhân khẩu</p>
              <p className="text-sm text-red-700">
                Bạn có chắc chắn muốn xóa nhân khẩu <strong>{resident.hoTen || resident.name}</strong>? 
                Yêu cầu này cần được xác thực từ cán bộ quản lý.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                placeholder="Lý do xóa nhân khẩu..."
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
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Đang gửi yêu cầu..." : "Xác nhận xóa"}
              </button>
              <button
                onClick={() => {
                  setIsDeleteMode(false);
                  setMessage(null);
                }}
                disabled={submitting}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : isEditMode ? (
          <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium mb-1">CCCD</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.cmnd}
                  onChange={(e) => setFormData({ ...formData, cmnd: e.target.value })}
                />
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
                  <option value="Chủ hộ">Chủ hộ</option>
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
                  <option value="Thuong tru">Thường trú</option>
                  <option value="Moi sinh">Mới sinh</option>
                  <option value="Qua doi">Qua đời</option>
                  <option value="Chuyen di">Chuyển đi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                placeholder="Ghi chú về yêu cầu sửa đổi..."
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
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu sửa"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setMessage(null);
                }}
                disabled={submitting}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="font-medium">{resident.hoTen || resident.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CCCD</p>
                  <p className="font-medium">{resident.cmnd || resident.cccd || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-medium">{resident.ngaySinh || resident.birthDate || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium">{resident.gioiTinh || resident.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nghề nghiệp</p>
                  <p className="font-medium">{resident.ngheNghiep || resident.occupation || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quan hệ với chủ hộ</p>
                  <p className="font-medium">{resident.quanHeVoiChuHo || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-medium">
                    {resident.trangThai === "Thuong tru" ? "Thường trú" :
                     resident.trangThai === "Moi sinh" ? "Mới sinh" :
                     resident.trangThai === "Qua doi" ? "Qua đời" :
                     resident.trangThai === "Chuyen di" ? "Chuyển đi" :
                     resident.trangThai || "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-between">
              <div className="flex gap-2">
                {/* Luôn hiển thị nút Sửa cho user role */}
                {user?.role === "User" && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Sửa
                    </button>
                    {/* Chỉ hiển thị nút Xóa nếu không phải chủ hộ */}
                    {resident.quanHeVoiChuHo !== "Chủ hộ" && resident.quanHeVoiChuHo !== "Chu ho" && (
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

