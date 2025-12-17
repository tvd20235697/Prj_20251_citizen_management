import { useState, useEffect } from "react";
import { Eye, Pencil, Plus, Trash2, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function FeeTypesManagement() {
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    tenLoaiPhi: "",
    moTa: "",
    batBuoc: false,
    dinhMuc: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/loai-phi`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setFeeTypes(data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách loại phí. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeTypeDetail = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/loai-phi/${id}`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setSelectedFeeType(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết loại phí. Vui lòng thử lại.");
    }
  };

  const handleViewDetail = (feeType) => {
    fetchFeeTypeDetail(feeType.maLoaiPhi);
  };

  const handleEdit = (feeType) => {
    setFormData({
      tenLoaiPhi: feeType.tenLoaiPhi || "",
      moTa: feeType.moTa || "",
      batBuoc: feeType.batBuoc || false,
      dinhMuc: feeType.dinhMuc?.toString() || "",
    });
    setSelectedFeeType(feeType);
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/loai-phi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Xóa loại phí thành công!");
      fetchFeeTypes();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa loại phí. Vui lòng thử lại.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.tenLoaiPhi.trim()) errors.tenLoaiPhi = "Vui lòng nhập tên loại phí";
    if (!formData.moTa.trim()) errors.moTa = "Vui lòng nhập mô tả";
    if (!formData.dinhMuc || Number(formData.dinhMuc) <= 0) {
      errors.dinhMuc = "Vui lòng nhập định mức hợp lệ (lớn hơn 0)";
    }
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/loai-phi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenLoaiPhi: formData.tenLoaiPhi,
          moTa: formData.moTa,
          batBuoc: formData.batBuoc,
          dinhMuc: Number(formData.dinhMuc),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Tạo loại phí mới thành công!");
      setShowCreateModal(false);
      setFormData({ tenLoaiPhi: "", moTa: "", batBuoc: false, dinhMuc: "" });
      setFormErrors({});
      fetchFeeTypes();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/loai-phi/${selectedFeeType.maLoaiPhi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenLoaiPhi: formData.tenLoaiPhi,
          moTa: formData.moTa,
          batBuoc: formData.batBuoc,
          dinhMuc: Number(formData.dinhMuc),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Cập nhật loại phí thành công!");
      setShowEditModal(false);
      setFormData({ tenLoaiPhi: "", moTa: "", batBuoc: false, dinhMuc: "" });
      setFormErrors({});
      setSelectedFeeType(null);
      fetchFeeTypes();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
      <div className="flex h-screen w-screen relative z-10 bg-black/35 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-blue-300" />
                    Quản lý các loại phí
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản lý danh sách các loại phí, xem chi tiết, tạo mới, chỉnh sửa và xóa loại phí.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({ tenLoaiPhi: "", moTa: "", batBuoc: false, dinhMuc: "" });
                    setFormErrors({});
                    setShowCreateModal(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Tạo loại phí mới
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5">
                  <h2 className="text-xl font-semibold text-white">Danh sách các loại phí</h2>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : feeTypes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Chưa có loại phí nào</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã loại phí</th>
                          <th className="px-6 py-4 text-left">Tên loại phí</th>
                          <th className="px-6 py-4 text-left">Mô tả</th>
                          <th className="px-6 py-4 text-left">Định mức</th>
                          <th className="px-6 py-4 text-center">Bắt buộc</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeTypes.map((feeType) => (
                          <tr
                            key={feeType.maLoaiPhi}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="px-6 py-4 text-white font-semibold">{feeType.maLoaiPhi}</td>
                            <td className="px-6 py-4 text-white font-medium">{feeType.tenLoaiPhi}</td>
                            <td className="px-6 py-4 text-gray-300">{feeType.moTa || "—"}</td>
                            <td className="px-6 py-4 text-gray-300">{formatCurrency(feeType.dinhMuc || 0)}</td>
                            <td className="px-6 py-4 text-center">
                              {feeType.batBuoc ? (
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-200 border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                                  Bắt buộc
                                </span>
                              ) : (
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-300 border border-gray-500/40">
                                  <XCircle className="w-3 h-3 inline mr-1" />
                                  Tùy chọn
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetail(feeType)}
                                  className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 transition"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(feeType)}
                                  className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30 hover:bg-yellow-500/20 transition"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(feeType.maLoaiPhi)}
                                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 transition"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
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

      {/* Modal Xem chi tiết */}
      {showDetailModal && selectedFeeType && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-300" />
                Chi tiết loại phí
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Mã loại phí</p>
                <p className="text-white font-semibold mt-1">{selectedFeeType.maLoaiPhi}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Tên loại phí</p>
                <p className="text-white font-semibold mt-1">{selectedFeeType.tenLoaiPhi}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Mô tả</p>
                <p className="text-white font-semibold mt-1">{selectedFeeType.moTa || "—"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Định mức</p>
                <p className="text-white font-semibold mt-1">{formatCurrency(selectedFeeType.dinhMuc || 0)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Bắt buộc</p>
                <p className="text-white font-semibold mt-1">
                  {selectedFeeType.batBuoc ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-200 border border-emerald-500/40">
                      Bắt buộc
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-300 border border-gray-500/40">
                      Tùy chọn
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedFeeType);
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-2xl font-medium"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-2xl font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-300" />
                Tạo loại phí mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <label className="text-sm text-gray-300 block">
                Tên loại phí *
                <input
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.tenLoaiPhi ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.tenLoaiPhi}
                  onChange={(e) => {
                    setFormData({ ...formData, tenLoaiPhi: e.target.value });
                    setFormErrors({ ...formErrors, tenLoaiPhi: "" });
                  }}
                  placeholder="Ví dụ: Phí vệ sinh môi trường"
                />
                {formErrors.tenLoaiPhi && (
                  <span className="text-xs text-red-400">{formErrors.tenLoaiPhi}</span>
                )}
              </label>

              <label className="text-sm text-gray-300 block">
                Mô tả *
                <textarea
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.moTa ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => {
                    setFormData({ ...formData, moTa: e.target.value });
                    setFormErrors({ ...formErrors, moTa: "" });
                  }}
                  placeholder="Mô tả về loại phí này"
                />
                {formErrors.moTa && <span className="text-xs text-red-400">{formErrors.moTa}</span>}
              </label>

              <label className="text-sm text-gray-300 block">
                Định mức (VND) *
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.dinhMuc ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.dinhMuc}
                  onChange={(e) => {
                    setFormData({ ...formData, dinhMuc: e.target.value });
                    setFormErrors({ ...formErrors, dinhMuc: "" });
                  }}
                  placeholder="50000"
                />
                {formErrors.dinhMuc && <span className="text-xs text-red-400">{formErrors.dinhMuc}</span>}
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-500"
                  checked={formData.batBuoc}
                  onChange={(e) => setFormData({ ...formData, batBuoc: e.target.checked })}
                />
                <span>Bắt buộc (Tất cả hộ phải đóng phí này)</span>
              </label>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-medium disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Tạo mới"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-2xl font-medium"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa */}
      {showEditModal && selectedFeeType && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-yellow-300" />
                Chỉnh sửa loại phí
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="rounded-2xl border border-white/10 p-4 bg-gray-900/50">
                <p className="text-xs uppercase text-gray-400">Mã loại phí</p>
                <p className="text-white font-semibold mt-1">{selectedFeeType.maLoaiPhi}</p>
              </div>

              <label className="text-sm text-gray-300 block">
                Tên loại phí *
                <input
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.tenLoaiPhi ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.tenLoaiPhi}
                  onChange={(e) => {
                    setFormData({ ...formData, tenLoaiPhi: e.target.value });
                    setFormErrors({ ...formErrors, tenLoaiPhi: "" });
                  }}
                  placeholder="Ví dụ: Phí vệ sinh môi trường"
                />
                {formErrors.tenLoaiPhi && (
                  <span className="text-xs text-red-400">{formErrors.tenLoaiPhi}</span>
                )}
              </label>

              <label className="text-sm text-gray-300 block">
                Mô tả *
                <textarea
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.moTa ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => {
                    setFormData({ ...formData, moTa: e.target.value });
                    setFormErrors({ ...formErrors, moTa: "" });
                  }}
                  placeholder="Mô tả về loại phí này"
                />
                {formErrors.moTa && <span className="text-xs text-red-400">{formErrors.moTa}</span>}
              </label>

              <label className="text-sm text-gray-300 block">
                Định mức (VND) *
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.dinhMuc ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.dinhMuc}
                  onChange={(e) => {
                    setFormData({ ...formData, dinhMuc: e.target.value });
                    setFormErrors({ ...formErrors, dinhMuc: "" });
                  }}
                  placeholder="50000"
                />
                {formErrors.dinhMuc && <span className="text-xs text-red-400">{formErrors.dinhMuc}</span>}
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-500"
                  checked={formData.batBuoc}
                  onChange={(e) => setFormData({ ...formData, batBuoc: e.target.checked })}
                />
                <span>Bắt buộc (Tất cả hộ phải đóng phí này)</span>
              </label>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-2xl font-medium disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Cập nhật"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-2xl font-medium"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative w-full max-w-md bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-300" />
                Xác nhận xóa
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa loại phí này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl font-medium"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-2xl font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

