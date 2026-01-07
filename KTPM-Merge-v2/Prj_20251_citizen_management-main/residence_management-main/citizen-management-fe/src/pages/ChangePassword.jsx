import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8080/api/auth";

export default function ChangePassword() {
  const { user } = useAuth();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!currentPass || !newPass || !confirmPass) {
      setMessage({ type: 'error', text: 'Vui lòng điền tất cả các trường.' });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }
    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận không khớp.' });
      return;
    }
    if (currentPass === newPass) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu hiện tại.' });
      return;
    }

    if (!user || !user.maTaiKhoan) {
      setMessage({ type: 'error', text: 'Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maTaiKhoan: user.maTaiKhoan,
          matKhauHienTai: currentPass,
          matKhauMoi: newPass,
        }),
      });

      const data = await response.text(); // Get response as text first
      
      if (!response.ok) {
        throw new Error(data || "Đổi mật khẩu thất bại");
      }

      setMessage({ type: 'success', text: data || 'Đổi mật khẩu thành công!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      
      // Optionally redirect after 2 seconds
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error);
      setMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra khi đổi mật khẩu.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-6">Đổi mật khẩu</h1>
              {message && (
                <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700"
                    disabled={loading}
                  >
                    Quay lại
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
