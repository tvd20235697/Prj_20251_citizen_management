import { useState, useEffect } from "react";
import { Eye, Pencil, Plus, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function CollectionPeriodsManagement() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    maLoai: "",
    tenDotThu: "",
    ngayBatDau: "",
    ngayKetThuc: "",
  });

  // Load fee types for dropdown
  const [feeTypes, setFeeTypes] = useState([]);
  const [periodFeeTypes, setPeriodFeeTypes] = useState({}); // Map maDotThu -> feeType info
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPeriods();
    fetchFeeTypes();
  }, []);

  useEffect(() => {
    // Fetch fee type details for each period
    if (periods.length > 0) {
      fetchPeriodFeeTypes();
    }
  }, [periods]);

  const fetchFeeTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/loai-phi`);
      if (res.ok) {
        const data = await res.json();
        setFeeTypes(data || []);
      }
    } catch (err) {
      console.error("Error fetching fee types:", err);
    }
  };

  const fetchPeriodFeeTypes = async () => {
    const feeTypeMap = {};
    await Promise.all(
      periods.map(async (period) => {
        try {
          const res = await fetch(`${API_BASE}/loai-phi/${period.maLoai}`);
          if (res.ok) {
            const data = await res.json();
            feeTypeMap[period.maDotThu] = data;
          }
        } catch (err) {
          console.error(`Error fetching fee type for period ${period.maDotThu}:`, err);
        }
      })
    );
    setPeriodFeeTypes(feeTypeMap);
  };

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/dot-thu`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setPeriods(data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đợt thu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodDetail = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/dot-thu/${id}`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setSelectedPeriod(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết đợt thu. Vui lòng thử lại.");
    }
  };

  const handleViewDetail = (period) => {
    fetchPeriodDetail(period.maDotThu);
  };

  const handleEdit = (period) => {
    setFormData({
      maLoai: period.maLoai?.toString() || "",
      tenDotThu: period.tenDotThu || "",
      ngayBatDau: period.ngayBatDau ? period.ngayBatDau.slice(0, 16) : "",
      ngayKetThuc: period.ngayKetThuc ? period.ngayKetThuc.slice(0, 16) : "",
    });
    setSelectedPeriod(period);
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/dot-thu/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Xóa đợt thu thành công!");
      fetchPeriods();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa đợt thu. Vui lòng thử lại.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.maLoai) errors.maLoai = "Vui lòng chọn loại phí";
    if (!formData.tenDotThu.trim()) errors.tenDotThu = "Vui lòng nhập tên đợt thu";
    if (!formData.ngayBatDau) errors.ngayBatDau = "Vui lòng chọn ngày bắt đầu";
    if (!formData.ngayKetThuc) errors.ngayKetThuc = "Vui lòng chọn ngày kết thúc";
    
    if (formData.ngayBatDau && formData.ngayKetThuc) {
      const startDate = new Date(formData.ngayBatDau);
      const endDate = new Date(formData.ngayKetThuc);
      if (endDate <= startDate) {
        errors.ngayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu";
      }
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
      const res = await fetch(`${API_BASE}/dot-thu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maLoai: Number(formData.maLoai),
          tenDotThu: formData.tenDotThu,
          ngayBatDau: formData.ngayBatDau ? `${formData.ngayBatDau}:00` : null,
          ngayKetThuc: formData.ngayKetThuc ? `${formData.ngayKetThuc}:59` : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Tạo đợt thu mới thành công!");
      setShowCreateModal(false);
      setFormData({ maLoai: "", tenDotThu: "", ngayBatDau: "", ngayKetThuc: "" });
      setFormErrors({});
      fetchPeriods();
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
      const res = await fetch(`${API_BASE}/dot-thu/${selectedPeriod.maDotThu}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maLoai: Number(formData.maLoai),
          tenDotThu: formData.tenDotThu,
          ngayBatDau: formData.ngayBatDau ? `${formData.ngayBatDau}:00` : null,
          ngayKetThuc: formData.ngayKetThuc ? `${formData.ngayKetThuc}:59` : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Cập nhật đợt thu thành công!");
      setShowEditModal(false);
      setFormData({ maLoai: "", tenDotThu: "", ngayBatDau: "", ngayKetThuc: "" });
      setFormErrors({});
      setSelectedPeriod(null);
      fetchPeriods();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPeriodStatus = (period) => {
    const now = new Date();
    const startDate = new Date(period.ngayBatDau);
    const endDate = new Date(period.ngayKetThuc);

    if (now < startDate) {
      return { label: "Sắp diễn ra", className: "bg-blue-500/10 text-blue-200 border border-blue-500/40" };
    } else if (now >= startDate && now <= endDate) {
      return { label: "Đang diễn ra", className: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40" };
    } else {
      return { label: "Đã kết thúc", className: "bg-gray-500/10 text-gray-300 border border-gray-500/40" };
    }
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
                    <Calendar className="w-8 h-8 text-blue-300" />
                    Quản lý các đợt thu phí
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản lý danh sách các đợt thu phí, xem chi tiết, tạo mới, chỉnh sửa và xóa đợt thu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({ maLoai: "", tenDotThu: "", ngayBatDau: "", ngayKetThuc: "" });
                    setFormErrors({});
                    setShowCreateModal(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Tạo đợt thu mới
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5">
                  <h2 className="text-xl font-semibold text-white">Danh sách các đợt thu phí</h2>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : periods.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Chưa có đợt thu nào</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã đợt thu</th>
                          <th className="px-6 py-4 text-left">Loại phí</th>
                          <th className="px-6 py-4 text-left">Tên đợt thu</th>
                          <th className="px-6 py-4 text-left">Ngày bắt đầu</th>
                          <th className="px-6 py-4 text-left">Ngày kết thúc</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {periods.map((period) => {
                          const status = getPeriodStatus(period);
                          return (
                            <tr
                              key={period.maDotThu}
                              className="border-b border-white/5 hover:bg-white/5 transition"
                            >
                              <td className="px-6 py-4 text-white font-semibold">{period.maDotThu}</td>
                              <td className="px-6 py-4 text-white font-medium">
                                {periodFeeTypes[period.maDotThu]?.tenLoaiPhi || `Loại phí ${period.maLoai}`}
                              </td>
                              <td className="px-6 py-4 text-white font-medium">{period.tenDotThu}</td>
                              <td className="px-6 py-4 text-gray-300">{formatDate(period.ngayBatDau)}</td>
                              <td className="px-6 py-4 text-gray-300">{formatDate(period.ngayKetThuc)}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleViewDetail(period)}
                                    className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 transition"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(period)}
                                    className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30 hover:bg-yellow-500/20 transition"
                                    title="Chỉnh sửa"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(period.maDotThu)}
                                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 transition"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
      {showDetailModal && selectedPeriod && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-300" />
                Chi tiết đợt thu
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
                <p className="text-xs uppercase text-gray-400">Mã đợt thu</p>
                <p className="text-white font-semibold mt-1">{selectedPeriod.maDotThu}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Loại phí</p>
                <p className="text-white font-semibold mt-1">
                  {periodFeeTypes[selectedPeriod.maDotThu]?.tenLoaiPhi || `Loại phí ${selectedPeriod.maLoai}`}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Tên đợt thu</p>
                <p className="text-white font-semibold mt-1">{selectedPeriod.tenDotThu}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Ngày bắt đầu</p>
                  <p className="text-white font-semibold mt-1">{formatDate(selectedPeriod.ngayBatDau)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Ngày kết thúc</p>
                  <p className="text-white font-semibold mt-1">{formatDate(selectedPeriod.ngayKetThuc)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Trạng thái</p>
                <p className="text-white font-semibold mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPeriodStatus(selectedPeriod).className}`}>
                    {getPeriodStatus(selectedPeriod).label}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedPeriod);
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
                Tạo đợt thu mới
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
                Loại phí *
                <select
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.maLoai ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.maLoai}
                  onChange={(e) => {
                    setFormData({ ...formData, maLoai: e.target.value });
                    setFormErrors({ ...formErrors, maLoai: "" });
                  }}
                >
                  <option value="">Chọn loại phí</option>
                  {feeTypes.map((feeType) => (
                    <option key={feeType.maLoaiPhi} value={feeType.maLoaiPhi}>
                      {feeType.tenLoaiPhi}
                    </option>
                  ))}
                </select>
                {formErrors.maLoai && (
                  <span className="text-xs text-red-400">{formErrors.maLoai}</span>
                )}
              </label>

              <label className="text-sm text-gray-300 block">
                Tên đợt thu *
                <input
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.tenDotThu ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.tenDotThu}
                  onChange={(e) => {
                    setFormData({ ...formData, tenDotThu: e.target.value });
                    setFormErrors({ ...formErrors, tenDotThu: "" });
                  }}
                  placeholder="Ví dụ: Thu phí quý 1/2024"
                />
                {formErrors.tenDotThu && (
                  <span className="text-xs text-red-400">{formErrors.tenDotThu}</span>
                )}
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Ngày bắt đầu *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayBatDau ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayBatDau}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayBatDau: e.target.value });
                      setFormErrors({ ...formErrors, ngayBatDau: "" });
                    }}
                  />
                  {formErrors.ngayBatDau && (
                    <span className="text-xs text-red-400">{formErrors.ngayBatDau}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Ngày kết thúc *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayKetThuc ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayKetThuc}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayKetThuc: e.target.value });
                      setFormErrors({ ...formErrors, ngayKetThuc: "" });
                    }}
                  />
                  {formErrors.ngayKetThuc && (
                    <span className="text-xs text-red-400">{formErrors.ngayKetThuc}</span>
                  )}
                </label>
              </div>

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
      {showEditModal && selectedPeriod && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-yellow-300" />
                Chỉnh sửa đợt thu
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
                <p className="text-xs uppercase text-gray-400">Mã đợt thu</p>
                <p className="text-white font-semibold mt-1">{selectedPeriod.maDotThu}</p>
              </div>

              <label className="text-sm text-gray-300 block">
                Loại phí *
                <select
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.maLoai ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.maLoai}
                  onChange={(e) => {
                    setFormData({ ...formData, maLoai: e.target.value });
                    setFormErrors({ ...formErrors, maLoai: "" });
                  }}
                >
                  <option value="">Chọn loại phí</option>
                  {feeTypes.map((feeType) => (
                    <option key={feeType.maLoaiPhi} value={feeType.maLoaiPhi}>
                      {feeType.tenLoaiPhi}
                    </option>
                  ))}
                </select>
                {formErrors.maLoai && (
                  <span className="text-xs text-red-400">{formErrors.maLoai}</span>
                )}
              </label>

              <label className="text-sm text-gray-300 block">
                Tên đợt thu *
                <input
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.tenDotThu ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                  }`}
                  value={formData.tenDotThu}
                  onChange={(e) => {
                    setFormData({ ...formData, tenDotThu: e.target.value });
                    setFormErrors({ ...formErrors, tenDotThu: "" });
                  }}
                  placeholder="Ví dụ: Thu phí quý 1/2024"
                />
                {formErrors.tenDotThu && (
                  <span className="text-xs text-red-400">{formErrors.tenDotThu}</span>
                )}
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Ngày bắt đầu *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayBatDau ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayBatDau}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayBatDau: e.target.value });
                      setFormErrors({ ...formErrors, ngayBatDau: "" });
                    }}
                  />
                  {formErrors.ngayBatDau && (
                    <span className="text-xs text-red-400">{formErrors.ngayBatDau}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Ngày kết thúc *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayKetThuc ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayKetThuc}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayKetThuc: e.target.value });
                      setFormErrors({ ...formErrors, ngayKetThuc: "" });
                    }}
                  />
                  {formErrors.ngayKetThuc && (
                    <span className="text-xs text-red-400">{formErrors.ngayKetThuc}</span>
                  )}
                </label>
              </div>

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
              Bạn có chắc chắn muốn xóa đợt thu này? Hành động này không thể hoàn tác.
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

