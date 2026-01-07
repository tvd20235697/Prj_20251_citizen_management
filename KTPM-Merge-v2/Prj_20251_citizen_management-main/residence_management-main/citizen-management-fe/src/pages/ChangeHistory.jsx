import { useState, useEffect, useCallback } from "react";
import { History, Search, User, Home, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function ChangeHistory() {
  const [activeTab, setActiveTab] = useState("nhanKhau");
  const [maNhanKhau, setMaNhanKhau] = useState("");
  const [soHoKhau, setSoHoKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nhanKhauHistory, setNhanKhauHistory] = useState([]);
  const [hoKhauHistory, setHoKhauHistory] = useState([]);

  // Fetch tất cả lịch sử nhân khẩu
  const fetchAllNhanKhauHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔵 Fetching all nhan khau history from:", `${API_BASE}/nhankhau/lich-su-nhan-khau`);
      const res = await fetch(`${API_BASE}/nhankhau/lich-su-nhan-khau`);
      console.log("🔵 Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("🔴 API error response:", errorText);
        throw new Error(`API lỗi: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log("🟢 Received nhan khau history data:", data);
      console.log("🟢 Data length:", data?.length || 0);
      setNhanKhauHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("🔴 Lỗi khi fetch lịch sử nhân khẩu:", err);
      setError(`Không thể tải lịch sử thay đổi nhân khẩu: ${err.message}`);
      setNhanKhauHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lịch sử nhân khẩu theo mã
  const fetchNhanKhauHistoryByCode = useCallback(async (maNhanKhauValue) => {
    try {
      setLoading(true);
      setError("");
      
      if (!maNhanKhauValue || maNhanKhauValue.trim() === "") {
        await fetchAllNhanKhauHistory();
        return;
      }

      const maNhanKhauNum = parseInt(maNhanKhauValue.trim(), 10);
      if (isNaN(maNhanKhauNum) || maNhanKhauNum <= 0) {
        setError("Mã nhân khẩu phải là số dương");
        setNhanKhauHistory([]);
        setLoading(false);
        return;
      }

      const url = `${API_BASE}/nhankhau/lich-su-nhan-khau/ma/${maNhanKhauNum}`;
      console.log("🔵 Searching nhan khau history by code:", url);
      const res = await fetch(url);
      console.log("🔵 Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        if (res.status === 404) {
          setNhanKhauHistory([]);
          setError("Không tìm thấy lịch sử thay đổi nhân khẩu cho mã nhân khẩu này");
        } else {
          const errorText = await res.text();
          console.error("🔴 API error response:", errorText);
          throw new Error(`API lỗi: ${res.status} - ${errorText}`);
        }
      } else {
        const data = await res.json();
        console.log("🟢 Received filtered nhan khau history:", data);
        console.log("🟢 Data length:", data?.length || 0);
        setNhanKhauHistory(Array.isArray(data) ? data : []);
        setError("");
      }
    } catch (err) {
      console.error("🔴 Lỗi khi fetch lịch sử nhân khẩu:", err);
      setError(`Không thể tải lịch sử thay đổi nhân khẩu: ${err.message}`);
      setNhanKhauHistory([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllNhanKhauHistory]);

  // Fetch tất cả lịch sử hộ khẩu
  const fetchAllHoKhauHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔵 Fetching all ho khau history from:", `${API_BASE}/nhankhau/lich-su-ho-khau`);
      const res = await fetch(`${API_BASE}/nhankhau/lich-su-ho-khau`);
      console.log("🔵 Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("🔴 API error response:", errorText);
        throw new Error(`API lỗi: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log("🟢 Received ho khau history data:", data);
      console.log("🟢 Data length:", data?.length || 0);
      setHoKhauHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("🔴 Lỗi khi fetch lịch sử hộ khẩu:", err);
      setError(`Không thể tải lịch sử thay đổi hộ khẩu: ${err.message}`);
      setHoKhauHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lịch sử hộ khẩu theo số hộ khẩu
  const fetchHoKhauHistoryByCode = useCallback(async (soHoKhauValue) => {
    try {
      setLoading(true);
      setError("");
      
      if (!soHoKhauValue || soHoKhauValue.trim() === "") {
        await fetchAllHoKhauHistory();
        return;
      }

      const soHoKhauNum = parseInt(soHoKhauValue.trim(), 10);
      if (isNaN(soHoKhauNum) || soHoKhauNum <= 0) {
        setError("Số hộ khẩu phải là số dương");
        setHoKhauHistory([]);
        setLoading(false);
        return;
      }

      const url = `${API_BASE}/nhankhau/lich-su-ho-khau/${soHoKhauNum}`;
      console.log("🔵 Searching ho khau history by code:", url);
      const res = await fetch(url);
      console.log("🔵 Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        if (res.status === 404) {
          setHoKhauHistory([]);
          setError("Không tìm thấy lịch sử thay đổi hộ khẩu cho số hộ khẩu này");
        } else {
          const errorText = await res.text();
          console.error("🔴 API error response:", errorText);
          throw new Error(`API lỗi: ${res.status} - ${errorText}`);
        }
      } else {
        const data = await res.json();
        console.log("🟢 Received filtered ho khau history:", data);
        console.log("🟢 Data length:", data?.length || 0);
        setHoKhauHistory(Array.isArray(data) ? data : []);
        setError("");
      }
    } catch (err) {
      console.error("🔴 Lỗi khi fetch lịch sử hộ khẩu:", err);
      setError(`Không thể tải lịch sử thay đổi hộ khẩu: ${err.message}`);
      setHoKhauHistory([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllHoKhauHistory]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    console.log("🟡 Component mounted, loading initial data");
    fetchAllNhanKhauHistory();
  }, [fetchAllNhanKhauHistory]);

  // Load dữ liệu khi chuyển tab
  useEffect(() => {
    console.log("🟡 Tab changed to:", activeTab);
    if (activeTab === "nhanKhau") {
      if (nhanKhauHistory.length === 0) {
        console.log("🟡 Loading nhan khau history");
        fetchAllNhanKhauHistory();
      }
    } else {
      if (hoKhauHistory.length === 0) {
        console.log("🟡 Loading ho khau history");
        fetchAllHoKhauHistory();
      }
    }
  }, [activeTab, nhanKhauHistory.length, hoKhauHistory.length, fetchAllNhanKhauHistory, fetchAllHoKhauHistory]);

  const handleSearch = () => {
    console.log("🟡 Search clicked, activeTab:", activeTab);
    if (activeTab === "nhanKhau") {
      fetchNhanKhauHistoryByCode(maNhanKhau);
    } else {
      fetchHoKhauHistoryByCode(soHoKhau);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const currentHistory = activeTab === "nhanKhau" ? nhanKhauHistory : hoKhauHistory;

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
                    <History className="w-8 h-8 text-blue-300" />
                    Lịch sử thay đổi
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Xem lịch sử thay đổi nhân khẩu và lịch sử thay đổi hộ khẩu.
                  </p>
                </div>
              </div>

              {/* Tabs Section */}
              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveTab("nhanKhau");
                        setError("");
                        setMaNhanKhau("");
                      }}
                      className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === "nhanKhau"
                          ? "bg-white/20 border border-white/30 text-white"
                          : "bg-white/10 border border-white/15 text-gray-300 hover:bg-white/15"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Lịch sử thay đổi nhân khẩu</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("hoKhau");
                        setError("");
                        setSoHoKhau("");
                      }}
                      className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === "hoKhau"
                          ? "bg-white/20 border border-white/30 text-white"
                          : "bg-white/10 border border-white/15 text-gray-300 hover:bg-white/15"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Lịch sử thay đổi hộ khẩu</span>
                    </button>
                  </div>
                </div>

                {/* Search Section */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm text-gray-300 mb-2 block">
                        {activeTab === "nhanKhau" ? "Mã nhân khẩu" : "Số hộ khẩu"}
                      </label>
                      <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-4 py-3 border border-gray-700/60">
                        {activeTab === "nhanKhau" ? (
                          <User className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Home className="w-5 h-5 text-gray-400" />
                        )}
                        <input
                          type="text"
                          className="bg-transparent flex-1 text-gray-100 focus:outline-none"
                          placeholder={
                            activeTab === "nhanKhau"
                              ? "Nhập mã nhân khẩu để tìm kiếm (để trống để xem tất cả)"
                              : "Nhập số hộ khẩu để tìm kiếm (để trống để xem tất cả)"
                          }
                          value={activeTab === "nhanKhau" ? maNhanKhau : soHoKhau}
                          onChange={(e) => {
                            if (activeTab === "nhanKhau") {
                              setMaNhanKhau(e.target.value);
                            } else {
                              setSoHoKhau(e.target.value);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSearch();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Search className="w-5 h-5" />
                      {loading ? "Đang tải..." : "Tìm kiếm"}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
                  ) : currentHistory.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      Không có lịch sử thay đổi nào
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      {activeTab === "nhanKhau" ? (
                        <table className="w-full text-sm">
                          <thead className="bg-white/5 text-gray-400 uppercase">
                            <tr>
                              <th className="px-6 py-4 text-left">Mã nhân khẩu</th>
                              <th className="px-6 py-4 text-left">Tên nhân khẩu</th>
                              <th className="px-6 py-4 text-left">Loại thay đổi</th>
                              <th className="px-6 py-4 text-left">Nội dung thay đổi</th>
                              <th className="px-6 py-4 text-left">Ngày thay đổi</th>
                              <th className="px-6 py-4 text-left">Ghi chú</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nhanKhauHistory.map((item, index) => {
                              const maNhanKhau =
                                item.maNhanKhau !== null && item.maNhanKhau !== undefined
                                  ? item.maNhanKhau
                                  : null;
                              const maNhanKhauStr = maNhanKhau != null ? String(maNhanKhau) : null;

                              const tenNhanKhau = item.hoTen || null;

                              return (
                                <tr
                                  key={index}
                                  className="border-b border-white/5 hover:bg-white/5 transition"
                                >
                                  <td className="px-6 py-4 text-white font-semibold">
                                    {maNhanKhauStr || "—"}
                                  </td>
                                  <td className="px-6 py-4 text-gray-300">
                                    {tenNhanKhau || "—"}
                                  </td>
                                  <td className="px-6 py-4 text-gray-300">
                                    {item.loaiThayDoi || "—"}
                                  </td>
                                  <td className="px-6 py-4 text-gray-300">
                                    {item.noiDungThayDoi || "—"}
                                  </td>
                                  <td className="px-6 py-4 text-gray-300">
                                    {formatDate(item.ngayThayDoi)}
                                  </td>
                                  <td className="px-6 py-4 text-gray-300">
                                    {item.ghiChu || "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-sm">
                          <thead className="bg-white/5 text-gray-400 uppercase">
                            <tr>
                              <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                              <th className="px-6 py-4 text-left">Nội dung thay đổi</th>
                              <th className="px-6 py-4 text-left">Ngày thay đổi</th>
                              <th className="px-6 py-4 text-left">Ghi chú</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hoKhauHistory.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b border-white/5 hover:bg-white/5 transition"
                              >
                                <td className="px-6 py-4 text-white font-semibold">
                                  {item.hoKhau?.soHoKhau || "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {item.noiDungThayDoi || "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {formatDate(item.ngayThayDoi)}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {item.ghiChu || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
