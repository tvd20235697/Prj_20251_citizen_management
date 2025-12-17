import { useState, useEffect } from "react";
import { Eye, Pencil, Plus, Trash2, DollarSign, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function FeeCollectionManagement() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedFeeTypeFilter, setSelectedFeeTypeFilter] = useState("all");

  const [formData, setFormData] = useState({
    soHoKhau: "",
    maDotThu: "",
    maLoai: "",
    soTien: "",
    ngayDong: "",
    ghiChu: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load dropdown data
  const [feeTypes, setFeeTypes] = useState([]);
  const [collectionPeriods, setCollectionPeriods] = useState([]);

  useEffect(() => {
    fetchCollections();
    fetchFeeTypes();
    fetchCollectionPeriods();
  }, []);

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

  const fetchCollectionPeriods = async () => {
    try {
      // Giả sử có API này, nếu không có thì có thể hardcode hoặc lấy từ collections
      // const res = await fetch(`${API_BASE}/dot-thu`);
      // if (res.ok) {
      //   const data = await res.json();
      //   setCollectionPeriods(data || []);
      // }
      // Tạm thời để trống, có thể lấy từ danh sách collections
    } catch (err) {
      console.error("Error fetching collection periods:", err);
    }
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/thu-phi`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setCollections(data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách thu phí. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionDetail = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/thu-phi/${id}`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setSelectedCollection(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết khoản thu phí. Vui lòng thử lại.");
    }
  };

  const handleViewDetail = (collection) => {
    fetchCollectionDetail(collection.maThuPhi);
  };

  const handleEdit = (collection) => {
    setFormData({
      soHoKhau: collection.soHoKhau?.toString() || "",
      maDotThu: collection.maDotThu?.toString() || "",
      maLoai: collection.maLoai?.toString() || "",
      soTien: collection.soTien?.toString() || "",
      ngayDong: collection.ngayDong ? collection.ngayDong.slice(0, 16) : "",
      ghiChu: collection.ghiChu || "",
    });
    setSelectedCollection(collection);
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/thu-phi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Xóa khoản thu phí thành công!");
      fetchCollections();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa khoản thu phí. Vui lòng thử lại.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.soHoKhau) errors.soHoKhau = "Vui lòng nhập số hộ khẩu";
    if (!formData.maDotThu) errors.maDotThu = "Vui lòng chọn đợt thu";
    if (!formData.maLoai) errors.maLoai = "Vui lòng chọn loại phí";
    if (!formData.soTien || Number(formData.soTien) <= 0) {
      errors.soTien = "Vui lòng nhập số tiền hợp lệ (lớn hơn 0)";
    }
    if (!formData.ngayDong) errors.ngayDong = "Vui lòng chọn ngày đóng";
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
      const res = await fetch(`${API_BASE}/thu-phi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhau: Number(formData.soHoKhau),
          maDotThu: Number(formData.maDotThu),
          maLoai: Number(formData.maLoai),
          soTien: Number(formData.soTien),
          ngayDong: formData.ngayDong ? `${formData.ngayDong}:00` : null,
          ghiChu: formData.ghiChu || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Tạo phiếu thu mới thành công!");
      setShowCreateModal(false);
      setFormData({
        soHoKhau: "",
        maDotThu: "",
        maLoai: "",
        soTien: "",
        ngayDong: "",
        ghiChu: "",
      });
      setFormErrors({});
      fetchCollections();
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
      const res = await fetch(`${API_BASE}/thu-phi/${selectedCollection.maThuPhi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhau: Number(formData.soHoKhau),
          maDotThu: Number(formData.maDotThu),
          maLoai: Number(formData.maLoai),
          soTien: Number(formData.soTien),
          ngayDong: formData.ngayDong ? `${formData.ngayDong}:00` : null,
          ghiChu: formData.ghiChu || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Cập nhật khoản thu phí thành công!");
      setShowEditModal(false);
      setFormData({
        soHoKhau: "",
        maDotThu: "",
        maLoai: "",
        soTien: "",
        ngayDong: "",
        ghiChu: "",
      });
      setFormErrors({});
      setSelectedCollection(null);
      fetchCollections();
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

  // Filter collections by fee type
  const filteredCollections = collections.filter((collection) => {
    if (selectedFeeTypeFilter === "all") return true;
    return collection.maLoai?.toString() === selectedFeeTypeFilter;
  });

  // Get unique collection periods from collections
  const uniquePeriods = Array.from(
    new Set(collections.map((c) => c.maDotThu).filter(Boolean))
  ).map((id) => {
    const collection = collections.find((c) => c.maDotThu === id);
    return {
      maDotThu: id,
      tenDotThu: collection?.tenDotThu || `Đợt thu ${id}`,
    };
  });

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
                    Quản lý thu phí
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản lý danh sách các khoản thu phí, xem chi tiết, tạo mới, chỉnh sửa và xóa khoản thu phí.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({
                      soHoKhau: "",
                      maDotThu: "",
                      maLoai: "",
                      soTien: "",
                      ngayDong: "",
                      ghiChu: "",
                    });
                    setFormErrors({});
                    setShowCreateModal(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Tạo phiếu thu mới
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-white">Danh sách các khoản thu phí</h2>
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedFeeTypeFilter}
                      onChange={(e) => setSelectedFeeTypeFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500 min-w-[200px]"
                    >
                      <option value="all">Tất cả loại phí</option>
                      {feeTypes.map((feeType) => (
                        <option key={feeType.maLoaiPhi} value={feeType.maLoaiPhi.toString()}>
                          {feeType.tenLoaiPhi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : filteredCollections.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      {selectedFeeTypeFilter === "all"
                        ? "Chưa có khoản thu phí nào"
                        : "Không có khoản thu phí nào cho loại phí đã chọn"}
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã thu phí</th>
                          <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                          <th className="px-6 py-4 text-left">Loại phí</th>
                          <th className="px-6 py-4 text-left">Đợt thu</th>
                          <th className="px-6 py-4 text-right">Số tiền</th>
                          <th className="px-6 py-4 text-left">Ngày đóng</th>
                          <th className="px-6 py-4 text-left">Ghi chú</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCollections.map((collection) => (
                          <tr
                            key={collection.maThuPhi}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="px-6 py-4 text-white font-semibold">{collection.maThuPhi}</td>
                            <td className="px-6 py-4 text-gray-300">{collection.soHoKhau}</td>
                            <td className="px-6 py-4 text-white font-medium">
                              {collection.tenLoaiPhi || "—"}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {collection.tenDotThu || "—"}
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-right">
                              {formatCurrency(collection.soTien || 0)}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {formatDate(collection.ngayDong)}
                            </td>
                            <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                              {collection.ghiChu || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetail(collection)}
                                  className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 transition"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(collection)}
                                  className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30 hover:bg-yellow-500/20 transition"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(collection.maThuPhi)}
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
      {showDetailModal && selectedCollection && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-300" />
                Chi tiết khoản thu phí
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
                <p className="text-xs uppercase text-gray-400">Mã thu phí</p>
                <p className="text-white font-semibold mt-1">{selectedCollection.maThuPhi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Số hộ khẩu</p>
                  <p className="text-white font-semibold mt-1">{selectedCollection.soHoKhau}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Loại phí</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedCollection.tenLoaiPhi || "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Đợt thu</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedCollection.tenDotThu || "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase text-gray-400">Số tiền</p>
                  <p className="text-white font-semibold mt-1">
                    {formatCurrency(selectedCollection.soTien || 0)}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Ngày đóng</p>
                <p className="text-white font-semibold mt-1">
                  {formatDate(selectedCollection.ngayDong)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase text-gray-400">Ghi chú</p>
                <p className="text-white font-semibold mt-1">{selectedCollection.ghiChu || "—"}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedCollection);
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
                Tạo phiếu thu mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Số hộ khẩu *
                  <input
                    type="number"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.soHoKhau
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.soHoKhau}
                    onChange={(e) => {
                      setFormData({ ...formData, soHoKhau: e.target.value });
                      setFormErrors({ ...formErrors, soHoKhau: "" });
                    }}
                    placeholder="Nhập số hộ khẩu"
                  />
                  {formErrors.soHoKhau && (
                    <span className="text-xs text-red-400">{formErrors.soHoKhau}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Đợt thu *
                  <select
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.maDotThu
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.maDotThu}
                    onChange={(e) => {
                      setFormData({ ...formData, maDotThu: e.target.value });
                      setFormErrors({ ...formErrors, maDotThu: "" });
                    }}
                  >
                    <option value="">Chọn đợt thu</option>
                    {uniquePeriods.map((period) => (
                      <option key={period.maDotThu} value={period.maDotThu}>
                        {period.tenDotThu}
                      </option>
                    ))}
                  </select>
                  {formErrors.maDotThu && (
                    <span className="text-xs text-red-400">{formErrors.maDotThu}</span>
                  )}
                </label>
              </div>

              <label className="text-sm text-gray-300 block">
                Loại phí *
                <select
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.maLoai
                      ? "border-red-500"
                      : "border-gray-700 focus:border-blue-500"
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

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Số tiền (VND) *
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.soTien
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.soTien}
                    onChange={(e) => {
                      setFormData({ ...formData, soTien: e.target.value });
                      setFormErrors({ ...formErrors, soTien: "" });
                    }}
                    placeholder="50000"
                  />
                  {formErrors.soTien && (
                    <span className="text-xs text-red-400">{formErrors.soTien}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Ngày đóng *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayDong
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayDong}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayDong: e.target.value });
                      setFormErrors({ ...formErrors, ngayDong: "" });
                    }}
                  />
                  {formErrors.ngayDong && (
                    <span className="text-xs text-red-400">{formErrors.ngayDong}</span>
                  )}
                </label>
              </div>

              <label className="text-sm text-gray-300 block">
                Ghi chú
                <textarea
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                  placeholder="Ghi chú về khoản thu phí này"
                />
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
      {showEditModal && selectedCollection && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-yellow-300" />
                Chỉnh sửa khoản thu phí
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
                <p className="text-xs uppercase text-gray-400">Mã thu phí</p>
                <p className="text-white font-semibold mt-1">{selectedCollection.maThuPhi}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Số hộ khẩu *
                  <input
                    type="number"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.soHoKhau
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.soHoKhau}
                    onChange={(e) => {
                      setFormData({ ...formData, soHoKhau: e.target.value });
                      setFormErrors({ ...formErrors, soHoKhau: "" });
                    }}
                    placeholder="Nhập số hộ khẩu"
                  />
                  {formErrors.soHoKhau && (
                    <span className="text-xs text-red-400">{formErrors.soHoKhau}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Đợt thu *
                  <select
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.maDotThu
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.maDotThu}
                    onChange={(e) => {
                      setFormData({ ...formData, maDotThu: e.target.value });
                      setFormErrors({ ...formErrors, maDotThu: "" });
                    }}
                  >
                    <option value="">Chọn đợt thu</option>
                    {uniquePeriods.map((period) => (
                      <option key={period.maDotThu} value={period.maDotThu}>
                        {period.tenDotThu}
                      </option>
                    ))}
                  </select>
                  {formErrors.maDotThu && (
                    <span className="text-xs text-red-400">{formErrors.maDotThu}</span>
                  )}
                </label>
              </div>

              <label className="text-sm text-gray-300 block">
                Loại phí *
                <select
                  className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                    formErrors.maLoai
                      ? "border-red-500"
                      : "border-gray-700 focus:border-blue-500"
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

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Số tiền (VND) *
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.soTien
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.soTien}
                    onChange={(e) => {
                      setFormData({ ...formData, soTien: e.target.value });
                      setFormErrors({ ...formErrors, soTien: "" });
                    }}
                    placeholder="50000"
                  />
                  {formErrors.soTien && (
                    <span className="text-xs text-red-400">{formErrors.soTien}</span>
                  )}
                </label>

                <label className="text-sm text-gray-300 block">
                  Ngày đóng *
                  <input
                    type="datetime-local"
                    className={`mt-2 w-full rounded-xl bg-gray-900 border px-3 py-2 focus:outline-none ${
                      formErrors.ngayDong
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                    value={formData.ngayDong}
                    onChange={(e) => {
                      setFormData({ ...formData, ngayDong: e.target.value });
                      setFormErrors({ ...formErrors, ngayDong: "" });
                    }}
                  />
                  {formErrors.ngayDong && (
                    <span className="text-xs text-red-400">{formErrors.ngayDong}</span>
                  )}
                </label>
              </div>

              <label className="text-sm text-gray-300 block">
                Ghi chú
                <textarea
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                  placeholder="Ghi chú về khoản thu phí này"
                />
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
              Bạn có chắc chắn muốn xóa khoản thu phí này? Hành động này không thể hoàn tác.
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

