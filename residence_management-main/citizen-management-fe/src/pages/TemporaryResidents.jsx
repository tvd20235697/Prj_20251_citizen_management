import { useEffect, useMemo, useState } from "react";
import { CalendarClock, MapPin, Phone, PlusCircle, RefreshCw, ShieldCheck, UserCheck, Clock3, Search, Eye } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

const statusMap = {
  "Dang tam tru": { label: "Đang tạm trú", className: "text-green-300 bg-green-500/10 border border-green-500/40" },
  "Da ket thuc": { label: "Đã kết thúc", className: "text-gray-300 bg-gray-500/10 border border-gray-500/30" },
  default: { label: "—", className: "text-gray-300 bg-gray-500/10 border border-gray-500/30" },
};

export default function TemporaryResidents() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [extendSearch, setExtendSearch] = useState("");
  const [endSearch, setEndSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [extendForm, setExtendForm] = useState({ newDenNgay: "", lyDo: "", ghiChu: "" });
  const [createForm, setCreateForm] = useState({
    maNhanKhau: "",
    noiTamTru: "",
    tuNgay: "",
    denNgay: "",
    lyDo: "",
    ghiChu: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/tamtru`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách tạm trú. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const monthsBetween = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24 * 30)));
  };

  const [durationFilter, setDurationFilter] = useState("all");

  const filtered = useMemo(() => {
    return records.filter((item) => {
      const name = item.nhanKhau?.hoTen || "";
      const address = item.noiTamTru || "";
      const code = item.maTamTru?.toString() || "";
      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        address.toLowerCase().includes(search.toLowerCase()) ||
        code.includes(search);

      const months = monthsBetween(item.tuNgay, item.denNgay);
      let matchesDuration = true;
      if (durationFilter === "1-2") matchesDuration = months >= 1 && months <= 2;
      if (durationFilter === "3-6") matchesDuration = months >= 3 && months <= 6;
      if (durationFilter === ">6") matchesDuration = months > 6;

      return matchesSearch && matchesDuration;
    });
  }, [records, search, durationFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal = "";
      let bVal = "";
      if (sortBy === "name") {
        aVal = (a.nhanKhau?.hoTen || "").toLowerCase();
        bVal = (b.nhanKhau?.hoTen || "").toLowerCase();
      } else if (sortBy === "start") {
        aVal = a.tuNgay || "";
        bVal = b.tuNgay || "";
      } else if (sortBy === "end") {
        aVal = a.denNgay || "";
        bVal = b.denNgay || "";
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const extendCandidates = useMemo(() => {
    return filtered.filter((r) => {
      const byName = (r.nhanKhau?.hoTen || "").toLowerCase().includes(extendSearch.toLowerCase());
      const byDuration = durationDays(r.tuNgay, r.denNgay) < 30;
      return byName && byDuration;
    });
  }, [filtered, extendSearch]);

  const endCandidates = useMemo(() => {
    return filtered.filter((r) => {
      const byName = (r.nhanKhau?.hoTen || "").toLowerCase().includes(endSearch.toLowerCase());
      const byStatus = r.trangThai === "Dang tam tru";
      return byName && byStatus;
    });
  }, [filtered, endSearch]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, durationFilter, sortBy, sortDir]);

  const statsOverview = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.trangThai === "Dang tam tru").length;
    const ended = records.filter((r) => r.trangThai === "Da ket thuc").length;
    const needExtend = records.filter((r) => durationDays(r.tuNgay, r.denNgay) < 30 && r.trangThai === "Dang tam tru").length;
    return { total, active, ended, needExtend };
  }, [records]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.maNhanKhau || !createForm.noiTamTru || !createForm.tuNgay || !createForm.denNgay || !createForm.lyDo) {
      alert("Vui lòng nhập đủ Mã nhân khẩu, Nơi tạm trú, Từ ngày, Đến ngày, Lý do.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/nhankhau/tam-tru`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maNhanKhau: Number(createForm.maNhanKhau),
          noiTamTru: createForm.noiTamTru,
          tuNgay: createForm.tuNgay,
          denNgay: createForm.denNgay,
          lyDo: createForm.lyDo,
          ghiChu: createForm.ghiChu || "",
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API lỗi: ${res.status}`);
      }
      alert("Đăng ký tạm trú thành công.");
      setShowCreate(false);
      setCreateForm({ maNhanKhau: "", noiTamTru: "", tuNgay: "", denNgay: "", lyDo: "", ghiChu: "" });
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể đăng ký tạm trú.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtend = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;
    if (!extendForm.newDenNgay) {
      alert("Vui lòng chọn ngày gia hạn.");
      return;
    }
    const startDate = selectedRecord.tuNgay ? new Date(selectedRecord.tuNgay) : null;
    const newDate = new Date(extendForm.newDenNgay);
    const now = new Date();
    if ((startDate && newDate <= startDate) || newDate <= now) {
      alert("Ngày gia hạn phải sau ngày hiện tại và sau ngày bắt đầu tạm trú.");
      return;
    }
    setSubmitting(true);
    try {
      const idTamTru = selectedRecord.maTamTru;
      const res = await fetch(`${API_BASE}/tamtru/${idTamTru}/giahan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newDenNgay: extendForm.newDenNgay,
          lyDo: extendForm.lyDo || "",
          ghiChu: extendForm.ghiChu || "",
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API lỗi: ${res.status}`);
      }
      alert("Gia hạn tạm trú thành công.");
      setShowExtend(false);
      setExtendForm({ newDenNgay: "", lyDo: "", ghiChu: "" });
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể gia hạn tạm trú.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnd = async (record) => {
    if (!confirm(`Kết thúc tạm trú cho ${record.nhanKhau?.hoTen}?`)) return;
    try {
      const idTamTru = record.maTamTru;
      const res = await fetch(`${API_BASE}/tamtru/${idTamTru}/ketthuc`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      alert("Đã kết thúc tạm trú.");
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Không thể kết thúc tạm trú.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("vi-VN");
  };

  const formatDateRange = (from, to) => {
    if (!from && !to) return "—";
    return `${formatDate(from)} → ${formatDate(to)}`;
  };

  function durationDays(from, to) {
    if (!from || !to) return Infinity;
    return Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
  }

  const getStatusBadge = (trangThai) => {
    const map = statusMap[trangThai] || statusMap.default;
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
                    Quản lý tạm trú
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Danh sách cư dân tạm trú, gia hạn và kết thúc theo API.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setShowCreate(true);
                      setCreateForm({ maNhanKhau: "", noiTamTru: "", tuNgay: "", denNgay: "", lyDo: "", ghiChu: "" });
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-3 text-sm"
                  >
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <PlusCircle className="w-6 h-6" />
                    </span>
                    Đăng ký mới
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRecord(null);
                      setExtendSearch("");
                      setExtendForm({ newDenNgay: "", lyDo: "", ghiChu: "" });
                      setShowExtend(true);
                    }}
                    className="bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 px-5 py-3 rounded-xl font-semibold flex items-center gap-3 text-sm"
                  >
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6" />
                    </span>
                    Gia hạn nhanh
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRecord(null);
                      setEndSearch("");
                      setShowEnd(true);
                    }}
                    className="bg-red-600/20 text-red-200 border border-red-500/40 px-5 py-3 rounded-xl font-semibold flex items-center gap-3 text-sm"
                  >
                    <span className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </span>
                    Kết thúc nhanh
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl p-4">
                  {error}
                </div>
              )}

              {/* Tổng quan nhanh */}
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Tổng tạm trú",
                    value: statsOverview.total,
                    icon: UserCheck,
                    bg: "from-blue-600 to-indigo-600",
                  },
                  {
                    label: "Đang tạm trú",
                    value: statsOverview.active,
                    icon: ShieldCheck,
                    bg: "from-emerald-500 to-teal-500",
                  },
                  {
                    label: "Cần gia hạn (<30 ngày)",
                    value: statsOverview.needExtend,
                    icon: RefreshCw,
                    bg: "from-amber-500 to-orange-500",
                  },
                  {
                    label: "Đã kết thúc",
                    value: statsOverview.ended,
                    icon: Clock3,
                    bg: "from-slate-600 to-slate-800",
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className={`rounded-2xl p-5 bg-gradient-to-br ${card.bg} shadow-lg shadow-black/30 border border-white/10 flex items-center gap-4`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-black/15 flex items-center justify-center text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">{card.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/30">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Danh sách cư dân tạm trú</h2>
                    <p className="text-gray-400 text-sm">Hiển thị các thông tin cần thiết.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center bg-gray-800 rounded-xl px-3">
                      <input
                        className="bg-transparent px-3 py-2 text-sm focus:outline-none"
                        placeholder="Tìm tên, mã hoặc địa chỉ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <CalendarClock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/80 text-gray-200 text-sm px-3 py-2 rounded-xl border border-gray-700/60">
                      <span className="text-gray-400">Sắp xếp:</span>
                      <select
                        className="bg-transparent focus:outline-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name">Tên</option>
                        <option value="start">Ngày bắt đầu</option>
                        <option value="end">Ngày kết thúc</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                        className="text-gray-200 hover:text-white text-xs px-2 py-1 rounded bg-gray-700/60"
                        title="Đảo thứ tự"
                      >
                        {sortDir === "asc" ? "↑" : "↓"}
                      </button>
                    </div>
                    <select
                      className="bg-gray-800/80 text-gray-200 text-sm px-3 py-2 rounded-xl border border-gray-700/60"
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value)}
                    >
                      <option value="all">Thời hạn cư trú</option>
                      <option value="1-2">1 - 2 tháng</option>
                      <option value="3-6">3 - 6 tháng</option>
                      <option value=">6">Lớn hơn 6 tháng</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Không có bản ghi phù hợp</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 uppercase text-gray-400">
                        <tr>
                          <th className="px-6 py-4 text-left">Mã</th>
                          <th className="px-6 py-4 text-left">Họ tên</th>
                          <th className="px-6 py-4 text-left">Địa chỉ tạm trú</th>
                          <th className="px-6 py-4 text-left">Liên hệ</th>
                          <th className="px-6 py-4 text-left">Thời hạn</th>
                          <th className="px-6 py-4 text-left">Trạng thái</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((item) => {
                          const nk = item.nhanKhau || {};
                          const badge = getStatusBadge(item.trangThai);
                          return (
                            <tr key={item.maTamTru} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="px-6 py-4 font-semibold text-white">{item.maTamTru}</td>
                              <td className="px-6 py-4">
                                <p className="font-medium text-white">{nk.hoTen}</p>
                                <p className="text-gray-400 text-xs">CCCD: {nk.cmnd || "—"}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="flex items-center gap-2 text-gray-200">
                                  <MapPin className="w-4 h-4 text-blue-300" />
                                  {item.noiTamTru || "—"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="flex items-center gap-2 text-gray-200">
                                  <Phone className="w-4 h-4 text-emerald-300" />
                                  {nk.cmnd || "—"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  HK: {nk.hoKhau?.diaChi || "—"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-white">
                                  {formatDateRange(item.tuNgay, item.denNgay)}
                                </p>
                              </td>
                              <td className="px-6 py-4">{badge}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex gap-2 flex-wrap justify-center">
                                    <button
                                      onClick={() => {
                                        setSelectedRecord(item);
                                        setShowDetail(true);
                                      }}
                                      className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30 hover:bg-blue-500/20 text-sm"
                                    >
                                      <Eye className="w-4 h-4 inline mr-1" />
                                      Chi tiết
                                    </button>
                                    {durationDays(item.tuNgay, item.denNgay) < 30 && (
                                      <button
                                        onClick={() => {
                                          setSelectedRecord(item);
                                          setExtendForm({ newDenNgay: item.denNgay ? item.denNgay.slice(0, 16) : "", lyDo: "", ghiChu: "" });
                                          setShowExtend(true);
                                        }}
                                        className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/20 text-sm"
                                      >
                                        <RefreshCw className="w-4 h-4 inline mr-1" />
                                        Gia hạn
                                      </button>
                                    )}
                                    {item.trangThai === "Dang tam tru" && (
                                      <button
                                        onClick={() => handleEnd(item)}
                                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 text-sm"
                                      >
                                        <ShieldCheck className="w-4 h-4 inline mr-1" />
                                        Kết thúc
                                      </button>
                                    )}
                                  </div>
                                  {durationDays(item.tuNgay, item.denNgay) < 30 ? (
                                    <p className="text-xs text-amber-300 flex items-center gap-1">
                                      <Clock3 className="w-4 h-4" />
                                      Sắp hết hạn
                                    </p>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-300 border-t border-white/5">
                  <p>
                    Trang {page}/{totalPages} • Hiển thị {paginated.length} / {sorted.length} bản ghi
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Modal đăng ký mới */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Đăng ký</p>
                <h3 className="text-2xl font-semibold text-white">Đăng ký tạm trú mới</h3>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <label className="text-sm text-gray-300 block">
                Mã nhân khẩu *
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={createForm.maNhanKhau}
                  onChange={(e) => setCreateForm({ ...createForm, maNhanKhau: e.target.value })}
                  placeholder="Nhập mã nhân khẩu"
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Nơi tạm trú *
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={createForm.noiTamTru}
                  onChange={(e) => setCreateForm({ ...createForm, noiTamTru: e.target.value })}
                  placeholder="Địa chỉ tạm trú"
                />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 block">
                  Từ ngày *
                  <input
                    type="datetime-local"
                    className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={createForm.tuNgay}
                    onChange={(e) => setCreateForm({ ...createForm, tuNgay: e.target.value })}
                  />
                </label>
                <label className="text-sm text-gray-300 block">
                  Đến ngày *
                  <input
                    type="datetime-local"
                    className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={createForm.denNgay}
                    onChange={(e) => setCreateForm({ ...createForm, denNgay: e.target.value })}
                  />
                </label>
              </div>
              <label className="text-sm text-gray-300 block">
                Lý do *
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={createForm.lyDo}
                  onChange={(e) => setCreateForm({ ...createForm, lyDo: e.target.value })}
                  placeholder="Lý do tạm trú"
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Ghi chú
                <textarea
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  value={createForm.ghiChu}
                  onChange={(e) => setCreateForm({ ...createForm, ghiChu: e.target.value })}
                />
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Lưu đăng ký"}
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

      {/* Modal gia hạn (kèm tìm kiếm) */}
      {showExtend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExtend(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Gia hạn</p>
                <h3 className="text-2xl font-semibold text-white">Gia hạn tạm trú</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Chỉ hiển thị cư dân có thời hạn &lt; 30 ngày.
                </p>
              </div>
              <button onClick={() => setShowExtend(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 bg-gray-900/60 rounded-xl px-3 py-2 mb-3">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  className="bg-transparent flex-1 text-sm focus:outline-none"
                  placeholder="Tìm theo tên cư dân..."
                  value={extendSearch}
                  onChange={(e) => setExtendSearch(e.target.value)}
                />
              </div>
              <div className="max-h-44 overflow-y-auto space-y-2">
                {extendCandidates.map((r) => (
                  <button
                    key={r.maTamTru}
                    onClick={() => {
                      setSelectedRecord(r);
                      setExtendForm({ newDenNgay: r.denNgay ? r.denNgay.slice(0, 16) : "", lyDo: "", ghiChu: "" });
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 border ${
                      selectedRecord?.maTamTru === r.maTamTru
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className="text-white font-semibold">{r.nhanKhau?.hoTen}</p>
                    <p className="text-xs text-gray-400">Mã tạm trú: {r.maTamTru}</p>
                  </button>
                ))}
                {extendCandidates.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-2">Không có cư dân cần gia hạn.</p>
                )}
              </div>
            </div>

            <form onSubmit={handleExtend} className="space-y-4">
              <label className="text-sm text-gray-300 block">
                Ngày kết thúc mới *
                <input
                  type="datetime-local"
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={extendForm.newDenNgay}
                  onChange={(e) => setExtendForm({ ...extendForm, newDenNgay: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Lý do
                <input
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={extendForm.lyDo}
                  onChange={(e) => setExtendForm({ ...extendForm, lyDo: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 block">
                Ghi chú
                <textarea
                  className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  value={extendForm.ghiChu}
                  onChange={(e) => setExtendForm({ ...extendForm, ghiChu: e.target.value })}
                />
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting || !selectedRecord}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Gia hạn"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowExtend(false)}
                  className="flex-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 font-semibold py-3 rounded-2xl"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal kết thúc (kèm tìm kiếm) */}
      {showEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnd(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Kết thúc</p>
                <h3 className="text-2xl font-semibold text-white">Kết thúc tạm trú</h3>
                <p className="text-gray-400 text-sm mt-1">Chỉ hiển thị cư dân đang tạm trú.</p>
              </div>
              <button onClick={() => setShowEnd(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 bg-gray-900/60 rounded-xl px-3 py-2 mb-3">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  className="bg-transparent flex-1 text-sm focus:outline-none"
                  placeholder="Tìm theo tên cư dân..."
                  value={endSearch}
                  onChange={(e) => setEndSearch(e.target.value)}
                />
              </div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {endCandidates.map((r) => (
                  <button
                    key={r.maTamTru}
                    onClick={() => {
                      setSelectedRecord(r);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 border ${
                      selectedRecord?.maTamTru === r.maTamTru
                        ? "border-red-400 bg-red-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className="text-white font-semibold">{r.nhanKhau?.hoTen}</p>
                    <p className="text-xs text-gray-400">Mã tạm trú: {r.maTamTru}</p>
                  </button>
                ))}
                {endCandidates.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-2">Không có cư dân đang tạm trú.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={submitting || !selectedRecord}
                onClick={() => selectedRecord && handleEnd(selectedRecord)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-70"
              >
                {submitting ? "Đang xử lý..." : "Kết thúc tạm trú"}
              </button>
              <button
                type="button"
                onClick={() => setShowEnd(false)}
                className="flex-1 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 font-semibold py-3 rounded-2xl"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetail && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
          <div className="relative bg-gray-900 rounded-3xl border border-white/5 w-full max-w-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Chi tiết</p>
                <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-300" />
                  Bản ghi tạm trú #{selectedRecord.maTamTru}
                </h3>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <DetailCard label="Họ tên" value={selectedRecord.nhanKhau?.hoTen} />
              <DetailCard label="CCCD" value={selectedRecord.nhanKhau?.cmnd} />
              <DetailCard label="Địa chỉ tạm trú" value={selectedRecord.noiTamTru} />
              <DetailCard label="Địa chỉ hộ khẩu" value={selectedRecord.nhanKhau?.hoKhau?.diaChi} />
              <DetailCard label="Thời hạn" value={formatDateRange(selectedRecord.tuNgay, selectedRecord.denNgay)} />
              <DetailCard label="Lý do" value={selectedRecord.lyDo} />
              <DetailCard label="Trạng thái" value={statusMap[selectedRecord.trangThai]?.label || statusMap.default.label} />
              <DetailCard label="Ghi chú" value={selectedRecord.ghiChu || "—"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="text-white font-semibold mt-1 break-words">{value || "—"}</p>
    </div>
  );
}