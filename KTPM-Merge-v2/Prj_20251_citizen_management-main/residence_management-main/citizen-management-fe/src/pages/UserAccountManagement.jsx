import { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2, Search, UserCheck } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function UserAccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    maNhanKhau: "",
    tenDangNhap: "",
    matKhau: "",
    email: "",
    trangThai: "CHO_KICH_HOAT",
  });
  const [submitting, setSubmitting] = useState(false);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetchAccounts();
    fetchResidents();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/taikhoan`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      // Chỉ lấy các tài khoản có maNhanKhau (tài khoản User)
      const userAccounts = data.filter((acc) => acc.maNhanKhau != null);
      setAccounts(userAccounts);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tài khoản. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await fetch(`${API_BASE}/nhankhau`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      // Chỉ lấy các nhân khẩu là chủ hộ
      const chuHoList = data.filter((nk) => nk.quanHeVoiChuHo === "Chu ho");
      setResidents(chuHoList);
    } catch (err) {
      console.error("Không thể tải danh sách nhân khẩu");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.maNhanKhau || !formData.tenDangNhap || !formData.matKhau) {
      alert("Vui lòng nhập đủ thông tin bắt buộc.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/taikhoan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maNhanKhau: Number(formData.maNhanKhau),
          tenDangNhap: formData.tenDangNhap,
          matKhau: formData.matKhau,
          email: formData.email || null,
          vaiTro: "User",
          trangThai: formData.trangThai,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API lỗi: ${res.status}`);
      }
      alert("Tạo tài khoản thành công.");
      setShowCreate(false);
      setFormData({ maNhanKhau: "", tenDangNhap: "", matKhau: "", email: "", trangThai: "CHO_KICH_HOAT" });
      fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể tạo tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/taikhoan/${selectedAccount.maTaiKhoan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maNhanKhau: Number(formData.maNhanKhau),
          tenDangNhap: formData.tenDangNhap,
          matKhau: formData.matKhau || undefined,
          email: formData.email || null,
          vaiTro: "User",
          trangThai: formData.trangThai,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API lỗi: ${res.status}`);
      }
      alert("Cập nhật tài khoản thành công.");
      setShowEdit(false);
      setSelectedAccount(null);
      fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể cập nhật tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      const res = await fetch(`${API_BASE}/taikhoan/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Xóa tài khoản thành công.");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa tài khoản.");
    }
  };

  const openEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      maNhanKhau: account.maNhanKhau || "",
      tenDangNhap: account.tenDangNhap || "",
      matKhau: "",
      email: account.email || "",
      trangThai: account.trangThai || "CHO_KICH_HOAT",
    });
    setShowEdit(true);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const searchLower = search.toLowerCase();
    return (
      acc.tenDangNhap?.toLowerCase().includes(searchLower) ||
      acc.email?.toLowerCase().includes(searchLower) ||
      acc.hoTen?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      DANG_HOAT_DONG: { label: "Đang hoạt động", className: "text-green-300 bg-green-500/10 border border-green-500/40" },
      NGUNG_HOAT_DONG: { label: "Ngừng hoạt động", className: "text-red-300 bg-red-500/10 border border-red-500/40" },
      CHO_KICH_HOAT: { label: "Chờ kích hoạt", className: "text-yellow-300 bg-yellow-500/10 border border-yellow-500/40" },
    };
    const map = statusMap[status] || statusMap.CHO_KICH_HOAT;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map.className}`}>
        {map.label}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <video
        className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
      />

      <div className="flex h-screen w-screen relative z-10 bg-black/30 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Module</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <UserCheck className="w-8 h-8 text-blue-300" />
                    Quản lý tài khoản chủ hộ
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Cung cấp, sửa, xóa thông tin tài khoản đăng nhập cho chủ hộ.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({ maNhanKhau: "", tenDangNhap: "", matKhau: "", email: "", trangThai: "CHO_KICH_HOAT" });
                    setShowCreate(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-3 text-sm"
                >
                  <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <PlusCircle className="w-6 h-6" />
                  </span>
                  Tạo tài khoản mới
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl p-4">
                  {error}
                </div>
              )}

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/30">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Danh sách tài khoản chủ hộ</h2>
                    <p className="text-gray-400 text-sm">Hiển thị các tài khoản đăng nhập của chủ hộ.</p>
                  </div>
                  <div className="flex items-center bg-gray-800 rounded-xl px-3">
                    <input
                      className="bg-transparent px-3 py-2 text-sm focus:outline-none"
                      placeholder="Tìm tên đăng nhập, email hoặc tên chủ hộ..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : filteredAccounts.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Không có tài khoản nào</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 uppercase text-gray-400">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã TK</th>
                          <th className="px-6 py-4 text-left">Tên đăng nhập</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Chủ hộ</th>
                          <th className="px-6 py-4 text-left">Mã nhân khẩu</th>
                          <th className="px-6 py-4 text-left">Trạng thái</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAccounts.map((account) => (
                          <tr key={account.maTaiKhoan} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4 font-semibold text-white">{account.maTaiKhoan}</td>
                            <td className="px-6 py-4 text-gray-200">{account.tenDangNhap}</td>
                            <td className="px-6 py-4 text-gray-200">{account.email || "—"}</td>
                            <td className="px-6 py-4 text-gray-200">{account.hoTen || "—"}</td>
                            <td className="px-6 py-4 text-gray-200">{account.maNhanKhau || "—"}</td>
                            <td className="px-6 py-4">{getStatusBadge(account.trangThai)}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => openEdit(account)}
                                  className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 text-sm"
                                >
                                  <Edit className="w-4 h-4 inline mr-1" />
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(account.maTaiKhoan)}
                                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 text-sm"
                                >
                                  <Trash2 className="w-4 h-4 inline mr-1" />
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Modal tạo mới */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Tạo mới</p>
                <h3 className="text-2xl font-semibold text-white">Tạo tài khoản chủ hộ</h3>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <label className="text-sm text-gray-300 block">
                Chủ hộ (Nhân khẩu) *
                <select
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.maNhanKhau}
                  onChange={(e) => setFormData({ ...formData, maNhanKhau: e.target.value })}
                  required
                >
                  <option value="">Chọn chủ hộ</option>
                  {residents.map((r) => (
                    <option key={r.maNhanKhau} value={r.maNhanKhau}>
                      {r.hoTen} (Mã: {r.maNhanKhau})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-gray-300 block">
                Tên đăng nhập *
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.tenDangNhap}
                  onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value })}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Mật khẩu *
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.matKhau}
                  onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Email
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email (tùy chọn)"
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Trạng thái
                <select
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                >
                  <option value="CHO_KICH_HOAT">Chờ kích hoạt</option>
                  <option value="DANG_HOAT_DONG">Đang hoạt động</option>
                  <option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option>
                </select>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 font-semibold py-3 rounded-2xl"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa */}
      {showEdit && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Sửa</p>
                <h3 className="text-2xl font-semibold text-white">Sửa tài khoản chủ hộ</h3>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <label className="text-sm text-gray-300 block">
                Chủ hộ (Nhân khẩu) *
                <select
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.maNhanKhau}
                  onChange={(e) => setFormData({ ...formData, maNhanKhau: e.target.value })}
                  required
                >
                  <option value="">Chọn chủ hộ</option>
                  {residents.map((r) => (
                    <option key={r.maNhanKhau} value={r.maNhanKhau}>
                      {r.hoTen} (Mã: {r.maNhanKhau})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-gray-300 block">
                Tên đăng nhập *
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.tenDangNhap}
                  onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Mật khẩu mới (để trống nếu không đổi)
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.matKhau}
                  onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Email
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Trạng thái
                <select
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                >
                  <option value="CHO_KICH_HOAT">Chờ kích hoạt</option>
                  <option value="DANG_HOAT_DONG">Đang hoạt động</option>
                  <option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option>
                </select>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Cập nhật"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 font-semibold py-3 rounded-2xl"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






