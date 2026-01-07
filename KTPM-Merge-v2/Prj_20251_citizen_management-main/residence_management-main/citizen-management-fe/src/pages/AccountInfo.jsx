import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8080/api";

export default function AccountInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!user) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Nếu có maCanBo, lấy thông tin cán bộ
        if (user.maCanBo) {
          // TODO: Tạo API endpoint để lấy thông tin cán bộ
          // Tạm thời sử dụng thông tin từ user object
          setAccountInfo({
            tenDangNhap: user.tenDangNhap,
            hoTen: user.fullName || user.hoTen,
            email: user.email,
            vaiTro: user.role,
            maCanBo: user.maCanBo,
            type: "canbo"
          });
        } 
        // Nếu có maNhanKhau, lấy thông tin nhân khẩu
        else if (user.maNhanKhau) {
          try {
            const response = await fetch(`${API_BASE}/nhankhau?hoKhauId=${user.soHoKhau || ''}`);
            if (response.ok) {
              const nhanKhauList = await response.json();
              const nhanKhau = nhanKhauList.find(nk => nk.maNhanKhau === user.maNhanKhau) || nhanKhauList[0];
              
              setAccountInfo({
                tenDangNhap: user.tenDangNhap,
                hoTen: user.fullName || user.hoTen || nhanKhau?.hoTen,
                email: user.email,
                vaiTro: user.role,
                maNhanKhau: user.maNhanKhau,
                soHoKhau: user.soHoKhau || nhanKhau?.soHoKhau,
                gioiTinh: nhanKhau?.gioiTinh,
                ngaySinh: nhanKhau?.ngaySinh,
                cmnd: nhanKhau?.cmnd,
                ngheNghiep: nhanKhau?.ngheNghiep,
                type: "nhankhau"
              });
            } else {
              // Fallback to user info
              setAccountInfo({
                tenDangNhap: user.tenDangNhap,
                hoTen: user.fullName || user.hoTen,
                email: user.email,
                vaiTro: user.role,
                maNhanKhau: user.maNhanKhau,
                soHoKhau: user.soHoKhau,
                type: "nhankhau"
              });
            }
          } catch (err) {
            console.error("Error fetching nhan khau info:", err);
            // Fallback to user info
            setAccountInfo({
              tenDangNhap: user.tenDangNhap,
              hoTen: user.fullName || user.hoTen,
              email: user.email,
              vaiTro: user.role,
              maNhanKhau: user.maNhanKhau,
              soHoKhau: user.soHoKhau,
              type: "nhankhau"
            });
          }
        } else {
          // Fallback: chỉ có thông tin từ user object
          setAccountInfo({
            tenDangNhap: user.tenDangNhap,
            hoTen: user.fullName || user.hoTen,
            email: user.email,
            vaiTro: user.role,
            type: "unknown"
          });
        }
      } catch (err) {
        console.error("Error fetching account info:", err);
        setError("Không thể tải thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  if (error || !accountInfo) {
    return (
      <div className="flex h-screen w-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Không tìm thấy thông tin"}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
                  <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.tenDangNhap || "—"}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                  <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.hoTen || "—"}</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.email || "—"}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò</label>
                  <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.vaiTro || "—"}</div>
                </div>

                {accountInfo.type === "nhankhau" && (
                  <>
                    {accountInfo.soHoKhau && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Số hộ khẩu</label>
                        <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.soHoKhau}</div>
                      </div>
                    )}
                    {accountInfo.gioiTinh && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
                        <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.gioiTinh}</div>
                      </div>
                    )}
                    {accountInfo.ngaySinh && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                        <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">
                          {new Date(accountInfo.ngaySinh).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    )}
                    {accountInfo.cmnd && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">CMND/CCCD</label>
                        <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.cmnd}</div>
                      </div>
                    )}
                    {accountInfo.ngheNghiep && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nghề nghiệp</label>
                        <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.ngheNghiep}</div>
                      </div>
                    )}
                  </>
                )}

                {accountInfo.type === "canbo" && accountInfo.maCanBo && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mã cán bộ</label>
                    <div className="mt-1 text-gray-900 bg-gray-50 p-2 rounded">{accountInfo.maCanBo}</div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Quay lại
                </button>

                <button
                  onClick={() => navigate('/account/change-password')}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
