import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountInfo() {
  const navigate = useNavigate();

  // Placeholder user info — replace with actual auth/user data
  const user = {
    username: "admin",
    fullName: "Nguyễn Văn A",
    email: "admin@example.com",
    role: "Quản trị viên",
    phone: "0123 456 789",
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Thông tin tài khoản</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Tên đăng nhập</label>
              <div className="mt-1 text-gray-900">{user.username}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Họ và tên</label>
              <div className="mt-1 text-gray-900">{user.fullName}</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="mt-1 text-gray-900">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Vai trò</label>
              <div className="mt-1 text-gray-900">{user.role}</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Số điện thoại</label>
              <div className="mt-1 text-gray-900">{user.phone}</div>
            </div>
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
  );
}
