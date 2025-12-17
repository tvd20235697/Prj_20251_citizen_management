import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      setMessage({ type: 'error', text: 'Vui lòng điền tất cả các trường.' });
      return;
    }
    if (newPass !== confirmPass) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận không khớp.' });
      return;
    }

    // TODO: call API to change password
    console.log('Change password:', { currentPass, newPass });
    setMessage({ type: 'success', text: 'Đã đổi mật khẩu (demo).' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Đổi mật khẩu</h1>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Mật khẩu mới</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-gray-300">Quay lại</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Đổi mật khẩu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
