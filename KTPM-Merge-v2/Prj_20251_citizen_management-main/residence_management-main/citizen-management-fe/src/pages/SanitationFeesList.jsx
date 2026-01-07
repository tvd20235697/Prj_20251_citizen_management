import { useState, useEffect, useMemo } from "react";
import { Eye, FileText, Mail, PlusCircle, Search, TrendingUp, Users, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function SanitationFeesList() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({ tongSoHo: 0, soHoDaDong: 0, soHoChuaDong: 0, nam: 2025 });
  const [householdsPaid, setHouseholdsPaid] = useState([]);
  const [householdsUnpaid, setHouseholdsUnpaid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // "all", "paid", "unpaid"
  const [currentPage, setCurrentPage] = useState(1);
  const [sanitationPeriod, setSanitationPeriod] = useState(null); // Lưu cả object đợt thu
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [quickCreateForm, setQuickCreateForm] = useState({
    soHoKhau: "",
    soTien: "",
    ngayDong: new Date().toISOString().slice(0, 16),
    ghiChu: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 25;

  useEffect(() => {
    fetchData();
    fetchSanitationPeriod();
  }, [year]);

  const fetchSanitationPeriod = async () => {
    try {
      // Fetch tất cả đợt thu
      const res = await fetch(`${API_BASE}/dot-thu`);
      if (res.ok) {
        const data = await res.json();
        // Tìm đợt thu phí vệ sinh theo pattern "VS-{năm}"
        const periodName = `VS-${year}`;
        const foundPeriod = data.find(
          (period) => period.tenDotThu === periodName || period.tenDotThu.includes(periodName)
        );
        if (foundPeriod) {
          setSanitationPeriod(foundPeriod);
        } else {
          setSanitationPeriod(null);
        }
      }
    } catch (err) {
      console.error("Error fetching sanitation period:", err);
      setSanitationPeriod(null);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch thống kê
      const statsRes = await fetch(`${API_BASE}/phi-ve-sinh/${year}/thong-ke`);
      if (!statsRes.ok) throw new Error(`API lỗi: ${statsRes.status}`);
      const statsData = await statsRes.json();
      setStats(statsData || { tongSoHo: 0, soHoDaDong: 0, soHoChuaDong: 0, nam: year });

      // Fetch danh sách đã đóng
      const paidRes = await fetch(`${API_BASE}/phi-ve-sinh/${year}/da-dong`);
      if (paidRes.ok) {
        const paidData = await paidRes.json();
        setHouseholdsPaid(paidData || []);
      }

      // Fetch danh sách chưa đóng
      const unpaidRes = await fetch(`${API_BASE}/phi-ve-sinh/${year}/chua-dong`);
      if (unpaidRes.ok) {
        const unpaidData = await unpaidRes.json();
        setHouseholdsUnpaid(unpaidData || []);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!sanitationPeriod) {
      alert("Không tìm thấy đợt thu phí vệ sinh cho năm này. Vui lòng tạo đợt thu trước.");
      return;
    }

    if (!quickCreateForm.soHoKhau || !quickCreateForm.soTien) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/thu-phi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhau: Number(quickCreateForm.soHoKhau),
          maDotThu: sanitationPeriod.maDotThu,
          soTien: Number(quickCreateForm.soTien),
          ngayDong: quickCreateForm.ngayDong ? `${quickCreateForm.ngayDong}:00` : null,
          ghiChu: quickCreateForm.ghiChu || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Tạo phiếu thu thành công!");
      setShowQuickCreateModal(false);
      setQuickCreateForm({
        soHoKhau: "",
        soTien: "",
        ngayDong: new Date().toISOString().slice(0, 16),
        ghiChu: "",
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính phần trăm hoàn thành
  const completionPercentage = stats.tongSoHo > 0 
    ? ((stats.soHoDaDong / stats.tongSoHo) * 100).toFixed(1) 
    : 0;

  // Lọc dữ liệu
  const allHouseholds = useMemo(() => {
    const paid = householdsPaid.map(h => ({ ...h, status: "paid" }));
    const unpaid = householdsUnpaid.map(h => ({ ...h, status: "unpaid" }));
    return [...paid, ...unpaid];
  }, [householdsPaid, householdsUnpaid]);

  const filtered = useMemo(() => {
    let result = allHouseholds;
    
    // Filter theo tab
    if (tab === "paid") {
      result = result.filter(h => h.status === "paid");
    } else if (tab === "unpaid") {
      result = result.filter(h => h.status === "unpaid");
    }

    // Filter theo search
    if (search) {
      result = result.filter((household) => {
        return (
          household.soHoKhau?.toString().includes(search) ||
          household.diaChi?.toLowerCase().includes(search.toLowerCase()) ||
          household.tenXaPhuong?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    return result;
  }, [allHouseholds, tab, search]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Tạo dữ liệu cho biểu đồ
  const chartData = {
    paid: stats.soHoDaDong,
    unpaid: stats.soHoChuaDong,
    total: stats.tongSoHo,
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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module Thu-Chi</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-300" />
                    Phí Vệ Sinh Năm {year}
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản lý phí vệ sinh bắt buộc - Mỗi hộ khẩu đóng một lần/năm
                  </p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const y = new Date().getFullYear() - i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={() => setShowQuickCreateModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Tạo phiếu thu nhanh
                  </button>
                </div>
              </div>

              {/* Dashboard thống kê */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Tổng số hộ</p>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">{stats.tongSoHo}</p>
                  <p className="text-xs text-gray-500 mt-2">Tất cả hộ khẩu trong khu vực</p>
                </div>

                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Đã đóng phí</p>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-4xl font-bold text-emerald-300">{stats.soHoDaDong}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.tongSoHo > 0 ? ((stats.soHoDaDong / stats.tongSoHo) * 100).toFixed(1) : 0}% tổng số hộ
                  </p>
                </div>

                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Chưa đóng phí</p>
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-4xl font-bold text-red-300">{stats.soHoChuaDong}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.tongSoHo > 0 ? ((stats.soHoChuaDong / stats.tongSoHo) * 100).toFixed(1) : 0}% tổng số hộ
                  </p>
                </div>
              </div>

              {/* Tiến độ hoàn thành */}
              <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Tiến độ hoàn thành phí vệ sinh
                  </h3>
                  <span className="text-2xl font-bold text-emerald-300">{completionPercentage}%</span>
                </div>
                <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 flex items-center justify-end pr-4"
                    style={{ width: `${completionPercentage}%` }}
                  >
                    {completionPercentage > 15 && (
                      <span className="text-xs font-semibold text-white">
                        {stats.soHoDaDong}/{stats.tongSoHo}
                      </span>
                    )}
                  </div>
                  {completionPercentage <= 15 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-300">
                        {stats.soHoDaDong}/{stats.tongSoHo} hộ
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500"></div>
                    <span className="text-gray-300">Đã đóng: {stats.soHoDaDong} hộ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-700"></div>
                    <span className="text-gray-300">Chưa đóng: {stats.soHoChuaDong} hộ</span>
                  </div>
                </div>
              </div>

              {/* Biểu đồ trực quan */}
              <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Biểu đồ thống kê</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Biểu đồ cột */}
                  <div>
                    <p className="text-sm text-gray-400 mb-4">Số lượng hộ</p>
                    <div className="flex items-end gap-4 h-48">
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-800 rounded-t relative" style={{ height: "100%" }}>
                          <div
                            className="absolute bottom-0 w-full bg-emerald-500 rounded-t transition-all duration-500"
                            style={{
                              height: `${chartData.total > 0 ? (chartData.paid / chartData.total) * 100 : 0}%`,
                            }}
                          ></div>
                          <div
                            className="absolute bottom-0 w-full bg-red-500 rounded-t transition-all duration-500"
                            style={{
                              height: `${chartData.total > 0 ? (chartData.unpaid / chartData.total) * 100 : 0}%`,
                              clipPath: `inset(${chartData.total > 0 ? (chartData.paid / chartData.total) * 100 : 0}% 0 0 0)`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Tổng</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-800 rounded-t relative" style={{ height: "100%" }}>
                          <div
                            className="absolute bottom-0 w-full bg-emerald-500 rounded-t transition-all duration-500"
                            style={{ height: "100%" }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Đã đóng</p>
                        <p className="text-lg font-bold text-emerald-300 mt-1">{chartData.paid}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-800 rounded-t relative" style={{ height: "100%" }}>
                          <div
                            className="absolute bottom-0 w-full bg-red-500 rounded-t transition-all duration-500"
                            style={{ height: "100%" }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Chưa đóng</p>
                        <p className="text-lg font-bold text-red-300 mt-1">{chartData.unpaid}</p>
                      </div>
                    </div>
                  </div>

                  {/* Biểu đồ tròn */}
                  <div>
                    <p className="text-sm text-gray-400 mb-4">Tỷ lệ hoàn thành</p>
                    <div className="flex items-center justify-center h-48">
                      <div className="relative w-48 h-48">
                        <svg className="transform -rotate-90 w-48 h-48">
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="16"
                            fill="transparent"
                            className="text-gray-800"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="16"
                            fill="transparent"
                            strokeDasharray={`${(completionPercentage / 100) * 502.65} 502.65`}
                            className="text-emerald-500 transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">{completionPercentage}%</p>
                            <p className="text-xs text-gray-400">Hoàn thành</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              {/* Tabs và danh sách */}
              <div className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl">
                <div className="p-6 border-b border-white/5">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTab("all");
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          tab === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        Tất cả ({allHouseholds.length})
                      </button>
                      <button
                        onClick={() => {
                          setTab("paid");
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          tab === "paid"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        Đã đóng ({householdsPaid.length})
                      </button>
                      <button
                        onClick={() => {
                          setTab("unpaid");
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          tab === "unpaid"
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        Chưa đóng ({householdsUnpaid.length})
                      </button>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 border border-gray-700 flex-1 min-w-[200px] max-w-md">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm số hộ khẩu, địa chỉ, phường/xã..."
                        className="bg-transparent px-2 py-2 text-sm focus:outline-none flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">Không có dữ liệu</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                          <th className="px-6 py-4 text-left">Địa chỉ</th>
                          <th className="px-6 py-4 text-left">Phường/Xã</th>
                          <th className="px-6 py-4 text-right">Số tiền đã đóng</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((household, idx) => (
                          <tr
                            key={`${household.soHoKhau}-${idx}`}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="px-6 py-4 text-white font-semibold">{household.soHoKhau}</td>
                            <td className="px-6 py-4 text-gray-300">{household.diaChi || "—"}</td>
                            <td className="px-6 py-4 text-gray-300">{household.tenXaPhuong || "—"}</td>
                            <td className="px-6 py-4 text-gray-200 font-medium text-right">
                              {formatCurrency(household.soTien || 0)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {household.status === "paid" ? (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                                  Đã đóng
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-300 border border-red-500/40">
                                  Chưa đóng
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  className="p-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-400/30 hover:bg-blue-500/20 transition"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {household.status === "unpaid" && (
                                  <button
                                    onClick={() => {
                                      setQuickCreateForm({
                                        ...quickCreateForm,
                                        soHoKhau: household.soHoKhau.toString(),
                                      });
                                      setShowQuickCreateModal(true);
                                    }}
                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/20 transition"
                                    title="Tạo phiếu thu"
                                  >
                                    <PlusCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  className="p-2 rounded-lg bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/20 transition"
                                  title="Gửi thông báo"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {filtered.length > 0 && (
                  <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      Hiển thị {paginated.length} trên {filtered.length} hộ
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition"
                      >
                        Trước
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (page > totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            } transition`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal Tạo phiếu thu nhanh */}
      {showQuickCreateModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowQuickCreateModal(false)} />
          <div className="relative w-full max-w-md bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-emerald-300" />
                Tạo phiếu thu phí vệ sinh nhanh
              </h3>
              <button
                onClick={() => setShowQuickCreateModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleQuickCreate} className="space-y-4">
              {/* Hiển thị đợt thu */}
              {sanitationPeriod && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                  <p className="text-xs uppercase text-blue-300 mb-1">Đợt thu</p>
                  <p className="text-white font-semibold">{sanitationPeriod.tenDotThu}</p>
                </div>
              )}

              <label className="text-sm text-gray-300 block">
                Số hộ khẩu *
                <input
                  type="number"
                  required
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={quickCreateForm.soHoKhau}
                  onChange={(e) => setQuickCreateForm({ ...quickCreateForm, soHoKhau: e.target.value })}
                  placeholder="Nhập số hộ khẩu"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Số tiền (VND) *
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={quickCreateForm.soTien}
                  onChange={(e) => setQuickCreateForm({ ...quickCreateForm, soTien: e.target.value })}
                  placeholder="Nhập số tiền"
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Ngày đóng *
                <input
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={quickCreateForm.ngayDong}
                  onChange={(e) => setQuickCreateForm({ ...quickCreateForm, ngayDong: e.target.value })}
                />
              </label>

              <label className="text-sm text-gray-300 block">
                Ghi chú
                <textarea
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500 text-white"
                  rows={3}
                  value={quickCreateForm.ghiChu}
                  onChange={(e) => setQuickCreateForm({ ...quickCreateForm, ghiChu: e.target.value })}
                  placeholder="Ghi chú về khoản thu phí"
                />
              </label>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting || !sanitationPeriod}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-medium disabled:opacity-70"
                >
                  {submitting ? "Đang xử lý..." : "Tạo phiếu thu"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-2xl font-medium"
                >
                  Hủy
                </button>
              </div>
              {!sanitationPeriod && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ Chưa có đợt thu phí vệ sinh (VS-{year}) cho năm {year}. Vui lòng tạo đợt thu trước.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
