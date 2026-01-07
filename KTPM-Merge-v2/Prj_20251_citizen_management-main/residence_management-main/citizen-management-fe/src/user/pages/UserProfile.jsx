import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../components/UserLayout";
import { httpClient } from "../services/http.client";

export default function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from API if ID is available
        if (user?.id) {
          const data = await httpClient.get(`/taikhoan/${user.id}`);
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user.maTaiKhoan) {
      setMessage("Không tìm thấy thông tin tài khoản để đổi mật khẩu.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ các trường.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (newPassword === oldPassword) {
      setMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    try {
      setLoading(true);
      
      // Sử dụng API đổi mật khẩu đúng endpoint
      const API_BASE = "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maTaiKhoan: user.maTaiKhoan,
          matKhauHienTai: oldPassword,
          matKhauMoi: newPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Đổi mật khẩu thất bại");
      }

      setMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setMessage("Lỗi: " + (err.message || "Đổi mật khẩu thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout
      title="Trang cá nhân"
      subtitle="Thông tin tài khoản và đổi mật khẩu"
    >
      <div className="space-y-4">
        {/* Cover + avatar giống layout Facebook đơn giản */}
        <section className="rounded-xl overflow-hidden border border-gray-200 bg-white">
          <div className="h-40 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500" />
          <div className="px-6 pb-4 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                {userData?.fullName?.[0] || userData?.tenDangNhap?.[0] || "U"}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {userData?.fullName ||
                    userData?.tenDangNhap ||
                    "Tên tài khoản"}
                </h2>
                <p className="text-sm text-gray-600">
                  {userData?.email || "email@example.com"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nội dung 2 cột */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr,1.6fr]">
          {/* Thông tin tài khoản */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold mb-3 text-gray-900">
                Thông tin tài khoản
              </h3>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Tên đăng nhập</dt>
                  <dd className="font-medium text-gray-900">
                    {userData?.tenDangNhap || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Họ tên</dt>
                  <dd className="font-medium text-gray-900">
                    {userData?.fullName || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium break-all text-gray-900">
                    {userData?.email || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Mã cán bộ</dt>
                  <dd className="font-medium text-gray-900">
                    {userData?.maCanBo ||
                      "Tài khoản cư dân (không phải cán bộ)"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Mã hộ khẩu</dt>
                  <dd className="font-medium text-gray-900">
                    {userData?.householdId || userData?.soHoKhau || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Loại tài khoản</dt>
                  <dd className="font-medium capitalize text-gray-900">
                    {userData?.vaiTro === "ADMIN" ||
                    userData?.vaiTro === "admin"
                      ? "Cán bộ / Tổ trưởng"
                      : "Cư dân"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Form đổi mật khẩu */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold mb-3 text-gray-900">Đổi mật khẩu</h3>
            <form onSubmit={handleChangePassword} className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-900"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-900"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-gray-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {message && (
                <div
                  className={`text-sm mt-2 p-3 rounded-lg ${
                    message.includes("thành công")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-sm font-semibold text-white transition"
              >
                {loading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
