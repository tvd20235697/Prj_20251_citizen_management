import { useState } from "react";
import { X, Check, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8080/api";

export default function YeuCauXacThucModal({ yeuCau, isOpen, onClose, onUpdate }) {
  const { user } = useAuth();
  const [hanhDong, setHanhDong] = useState(null); // "XAC_THUC" hoặc "TU_CHOI"
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen || !yeuCau) return null;

  const handleXacThuc = async () => {
    if (!user || !user.maCanBo) {
      setMessage({ type: "error", text: "Không tìm thấy thông tin cán bộ" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/yeucau/xac-thuc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maYeuCau: yeuCau.maYeuCau,
          maCanBo: user.maCanBo,
          hanhDong: "XAC_THUC",
          lyDoTuChoi: null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Xác thực thất bại");
      }

      setMessage({ type: "success", text: "Đã xác thực yêu cầu thành công!" });
      if (onUpdate) onUpdate();
      
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTuChoi = async () => {
    if (!lyDoTuChoi.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập lý do từ chối" });
      return;
    }

    if (!user || !user.maCanBo) {
      setMessage({ type: "error", text: "Không tìm thấy thông tin cán bộ" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/yeucau/xac-thuc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maYeuCau: yeuCau.maYeuCau,
          maCanBo: user.maCanBo,
          hanhDong: "TU_CHOI",
          lyDoTuChoi: lyDoTuChoi,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Từ chối thất bại");
      }

      setMessage({ type: "success", text: "Đã từ chối yêu cầu" });
      if (onUpdate) onUpdate();
      
      setTimeout(() => {
        onClose();
        setMessage(null);
        setLyDoTuChoi("");
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  const parseDuLieu = () => {
    try {
      return yeuCau.duLieu ? JSON.parse(yeuCau.duLieu) : null;
    } catch (e) {
      return null;
    }
  };

  const duLieu = parseDuLieu();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-semibold text-white">Xác thực yêu cầu</h2>
            <p className="text-sm text-gray-400 mt-1">Xem và xác thực yêu cầu thay đổi nhân khẩu</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin yêu cầu */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                yeuCau.loaiYeuCau === "THEM" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                yeuCau.loaiYeuCau === "SUA" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {yeuCau.loaiYeuCauLabel}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                {yeuCau.trangThaiLabel}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block mb-1">Chủ hộ:</span>
                <span className="text-white font-semibold">{yeuCau.hoTenChuHo}</span>
                <span className="text-gray-500 text-xs ml-2">({yeuCau.tenDangNhap})</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Số hộ khẩu:</span>
                <span className="text-white font-semibold">{yeuCau.soHoKhau}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Ngày tạo:</span>
                <span className="text-white">
                  {yeuCau.ngayTao ? new Date(yeuCau.ngayTao).toLocaleString("vi-VN") : "—"}
                </span>
              </div>
              {yeuCau.maNhanKhau && (
                <div>
                  <span className="text-gray-400 block mb-1">Mã nhân khẩu:</span>
                  <span className="text-white font-semibold">#{yeuCau.maNhanKhau}</span>
                </div>
              )}
            </div>
            
            {yeuCau.ghiChu && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-gray-400 text-sm block mb-1">Ghi chú:</span>
                <p className="text-gray-300 text-sm">{yeuCau.ghiChu}</p>
              </div>
            )}
          </div>

          {/* Dữ liệu nhân khẩu */}
          {duLieu && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded"></span>
                Thông tin nhân khẩu {yeuCau.loaiYeuCau === "THEM" ? "mới" : yeuCau.loaiYeuCau === "SUA" ? "cần sửa" : "cần xóa"}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {duLieu.hoTen && (
                  <div>
                    <span className="text-gray-400 block mb-1">Họ tên:</span>
                    <p className="text-white font-semibold">{duLieu.hoTen}</p>
                  </div>
                )}
                {duLieu.gioiTinh && (
                  <div>
                    <span className="text-gray-400 block mb-1">Giới tính:</span>
                    <p className="text-white">{duLieu.gioiTinh}</p>
                  </div>
                )}
                {duLieu.ngaySinh && (
                  <div>
                    <span className="text-gray-400 block mb-1">Ngày sinh:</span>
                    <p className="text-white">
                      {duLieu.ngaySinh.includes("T") 
                        ? new Date(duLieu.ngaySinh).toLocaleDateString("vi-VN")
                        : duLieu.ngaySinh}
                    </p>
                  </div>
                )}
                {duLieu.cmnd && (
                  <div>
                    <span className="text-gray-400 block mb-1">CCCD/CMND:</span>
                    <p className="text-white font-mono">{duLieu.cmnd}</p>
                  </div>
                )}
                {duLieu.ngheNghiep && (
                  <div>
                    <span className="text-gray-400 block mb-1">Nghề nghiệp:</span>
                    <p className="text-white">{duLieu.ngheNghiep}</p>
                  </div>
                )}
                {duLieu.quanHeVoiChuHo && (
                  <div>
                    <span className="text-gray-400 block mb-1">Quan hệ với chủ hộ:</span>
                    <p className="text-white">{duLieu.quanHeVoiChuHo}</p>
                  </div>
                )}
                {duLieu.diaChi && (
                  <div className="col-span-2">
                    <span className="text-gray-400 block mb-1">Địa chỉ:</span>
                    <p className="text-white">{duLieu.diaChi}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form từ chối */}
          {hanhDong === "TU_CHOI" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <label className="block text-sm font-semibold text-red-300 mb-2">Lý do từ chối *</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-900 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                rows="4"
                value={lyDoTuChoi}
                onChange={(e) => setLyDoTuChoi(e.target.value)}
                placeholder="Nhập lý do từ chối yêu cầu này..."
                disabled={submitting}
              />
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-xl text-sm border ${
              message.type === "success" 
                ? "bg-green-500/10 text-green-300 border-green-500/30" 
                : "bg-red-500/10 text-red-300 border-red-500/30"
            }`}>
              {message.text}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {hanhDong !== "TU_CHOI" && (
              <>
                <button
                  onClick={handleXacThuc}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                >
                  <Check className="w-5 h-5" />
                  {submitting ? "Đang xử lý..." : "Xác nhận xác thực"}
                </button>
                <button
                  onClick={() => setHanhDong("TU_CHOI")}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition"
                >
                  <XCircle className="w-5 h-5" />
                  Từ chối
                </button>
              </>
            )}
            {hanhDong === "TU_CHOI" && (
              <>
                <button
                  onClick={handleTuChoi}
                  disabled={submitting || !lyDoTuChoi.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
                </button>
                <button
                  onClick={() => {
                    setHanhDong(null);
                    setLyDoTuChoi("");
                  }}
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition"
                >
                  Hủy
                </button>
              </>
            )}
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition disabled:opacity-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






