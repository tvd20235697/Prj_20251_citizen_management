import { useEffect, useMemo, useState } from "react";
import { Mail, PlusCircle, Shield, UserCog, Users, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api/taikhoan";

const defaultForm = {
  maCanBo: "",
  tenDangNhap: "",
  matKhau: "",
  vaiTro: "ADMIN",
  email: "",
  trangThai: "PENDING",
};

const statusBadge = {
  ACTIVE: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40",
  PENDING: "bg-amber-500/10 text-amber-200 border border-amber-500/40",
  INACTIVE: "bg-gray-500/10 text-gray-300 border border-gray-500/40",
};

const roleBadge = {
  ADMIN: "bg-red-500/10 text-red-300 border border-red-500/40",
  "Quản trị viên": "bg-red-500/10 text-red-300 border border-red-500/40",
  "Cán bộ": "bg-blue-500/10 text-blue-300 border border-blue-500/40",
};

export default function UserManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.trangThai === "ACTIVE").length;
    const pending = records.filter((r) => r.trangThai === "PENDING").length;
    const inactive = records.filter((r) => r.trangThai === "INACTIVE").length;
    return { total, active, pending, inactive };
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const name = r.tenDangNhap?.toLowerCase() || "";
      const email = r.email?.toLowerCase() || "";
      const role = r.vaiTro?.toLowerCase() || "";
      const q = search.toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [records, search]);

  const validate = () => {
    const errors = {};
    if (!formData.maCanBo) errors.maCanBo = "Bắt buộc";
    if (!formData.tenDangNhap) errors.tenDangNhap = "Bắt buộc";
    if (!formData.matKhau) errors.matKhau = "Bắt buộc";
    if (!formData.vaiTro) errors.vaiTro = "Chọn vai trò";
    if (!formData.trangThai) errors.trangThai = "Chọn trạng thái";
    setError(Object.values(errors)[0] || "");
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maCanBo: Number(formData.maCanBo),
          tenDangNhap: formData.tenDangNhap,
          matKhau: formData.matKhau,
          vaiTro: formData.vaiTro,
          email: formData.email || null,
          trangThai: formData.trangThai,
        }),
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Tạo tài khoản thành công.");
      setShowCreate(false);
      setFormData(defaultForm);
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể tạo tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/${selected.maTaiKhoan}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maCanBo: Number(formData.maCanBo),
          tenDangNhap: formData.tenDangNhap,
          matKhau: formData.matKhau,
          vaiTro: formData.vaiTro,
          email: formData.email || null,
          trangThai: formData.trangThai,
        }),
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Cập nhật tài khoản thành công.");
      setShowEdit(false);
      setSelected(null);
      setFormData(defaultForm);
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể cập nhật tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    if (!confirm(`Xóa tài khoản ${record.tenDangNhap}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${record.maTaiKhoan}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Đã xóa tài khoản.");
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể xóa tài khoản.");
    }
  };

  const openEdit = (record) => {
    setSelected(record);
    setFormData({
      maCanBo: record.maCanBo || "",
      tenDangNhap: record.tenDangNhap || "",
      matKhau: record.matKhau || "",
      vaiTro: record.vaiTro || "ADMIN",
      email: record.email || "",
      trangThai: record.trangThai || "PENDING",
    });
    setShowEdit(true);
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

      <div className="flex h-screen w-screen relative z-10 bg-black/40 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Admin</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <UserCog className="w-8 h-8 text-blue-300" />
                    Quản lý tài khoản
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản trị tài khoản cán bộ, phân quyền và kích hoạt truy cập hệ thống.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreate(true);
                    setFormData(defaultForm);
                    setSelected(null);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/30"
                >
                  <PlusCircle className="w-5 h-5" />
                  Thêm tài khoản
                </button>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Tổng tài khoản", value: stats.total, icon: Users, color: "text-blue-300", bg: "bg-blue-500/10" },
                  { label: "Đang hoạt động", value: stats.active, icon: Shield, color: "text-emerald-300", bg: "bg-emerald-500/10" },
                  { label: "Chờ kích hoạt", value: stats.pending, icon: Mail, color: "text-amber-300", bg: "bg-amber-500/10" },
                  { label: "Đã vô hiệu", value: stats.inactive, icon: Shield, color: "text-gray-300", bg: "bg-gray-500/10" },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className={`rounded-2xl p-5 border border-white/5 ${card.bg} flex items-center gap-4 shadow-lg shadow-black/20`}>
                      <div className={`w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center ${card.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 uppercase tracking-wide">{card.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/30">
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Danh sách tài khoản</h2>
                    <p className="text-gray-400 text-sm">Thêm / sửa / xóa / kích hoạt tài khoản cán bộ.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <input
                      className="bg-gray-800/80 text-gray-100 text-sm px-4 py-2 rounded-xl border border-gray-700/60"
                      placeholder="Tìm tên đăng nhập, email, vai trò..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-10 text-center text-gray-400">Đang tải...</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">Không có tài khoản phù hợp</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã TK</th>
                          <th className="px-6 py-4 text-left">Tên đăng nhập</th>
                          <th className="px-6 py-4 text-left">Vai trò</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Trạng thái</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item) => (
                          <tr key={item.maTaiKhoan} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4 font-semibold text-white">{item.maTaiKhoan}</td>
                            <td className="px-6 py-4 text-gray-200">{item.tenDangNhap}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge[item.vaiTro] || "bg-blue-500/10 text-blue-200 border border-blue-400/30"}`}>
                                {item.vaiTro}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-200">{item.email || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[item.trangThai] || statusBadge.PENDING}`}>
                                {item.trangThai}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30 hover:bg-yellow-500/20 text-xs"
                                  onClick={() => openEdit(item)}
                                >
                                  <Pencil className="w-4 h-4 inline mr-1" />
                                  Sửa
                                </button>
                                <button
                                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 text-xs"
                                  onClick={() => handleDelete(item)}
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

      {/* Modal Tạo */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-3xl p-8 shadow-2xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Tạo tài khoản</p>
                <h3 className="text-2xl font-semibold text-white">Thông tin tài khoản</h3>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-200">
              <LabeledInput label="Mã cán bộ *" value={formData.maCanBo} onChange={(v) => setFormData({ ...formData, maCanBo: v })} />
              <LabeledInput label="Tên đăng nhập *" value={formData.tenDangNhap} onChange={(v) => setFormData({ ...formData, tenDangNhap: v })} />
              <LabeledInput label="Mật khẩu *" type="password" value={formData.matKhau} onChange={(v) => setFormData({ ...formData, matKhau: v })} />
              <LabeledInput label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
              <LabeledSelect
                label="Vai trò *"
                value={formData.vaiTro}
                onChange={(v) => setFormData({ ...formData, vaiTro: v })}
                options={[
                  { value: "ADMIN", label: "ADMIN" },
                  { value: "Cán bộ", label: "Cán bộ" },
                  { value: "Quản trị viên", label: "Quản trị viên" },
                ]}
              />
              <LabeledSelect
                label="Trạng thái *"
                value={formData.trangThai}
                onChange={(v) => setFormData({ ...formData, trangThai: v })}
                options={[
                  { value: "PENDING", label: "PENDING" },
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "INACTIVE", label: "INACTIVE" },
                ]}
              />
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
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
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-3xl p-8 shadow-2xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Chỉnh sửa</p>
                <h3 className="text-2xl font-semibold text-white">Tài khoản #{selected.maTaiKhoan}</h3>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-200">
              <LabeledInput label="Mã cán bộ *" value={formData.maCanBo} onChange={(v) => setFormData({ ...formData, maCanBo: v })} />
              <LabeledInput label="Tên đăng nhập *" value={formData.tenDangNhap} onChange={(v) => setFormData({ ...formData, tenDangNhap: v })} />
              <LabeledInput label="Mật khẩu *" type="password" value={formData.matKhau} onChange={(v) => setFormData({ ...formData, matKhau: v })} />
              <LabeledInput label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
              <LabeledSelect
                label="Vai trò *"
                value={formData.vaiTro}
                onChange={(v) => setFormData({ ...formData, vaiTro: v })}
                options={[
                  { value: "ADMIN", label: "ADMIN" },
                  { value: "Cán bộ", label: "Cán bộ" },
                  { value: "Quản trị viên", label: "Quản trị viên" },
                ]}
              />
              <LabeledSelect
                label="Trạng thái *"
                value={formData.trangThai}
                onChange={(v) => setFormData({ ...formData, trangThai: v })}
                options={[
                  { value: "PENDING", label: "PENDING" },
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "INACTIVE", label: "INACTIVE" },
                ]}
              />
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 font-semibold py-3 rounded-2xl"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="text-sm text-gray-300">
      {label}
      <input
        type={type}
        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function LabeledSelect({ label, value, onChange, options }) {
  return (
    <label className="text-sm text-gray-300">
      {label}
      <select
        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}