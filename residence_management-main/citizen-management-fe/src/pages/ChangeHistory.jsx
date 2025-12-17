import { useState, useEffect } from "react";
import { History, Search, Calendar, User, Home, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function ChangeHistory() {
  const [activeTab, setActiveTab] = useState("nhanKhau"); // "nhanKhau" hoặc "hoKhau"
  const [soHoKhau, setSoHoKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nhanKhauHistory, setNhanKhauHistory] = useState([]);
  const [hoKhauHistory, setHoKhauHistory] = useState([]);

  const fetchNhanKhauHistory = async () => {
    if (!soHoKhau) {
      setError("Vui lòng nhập số hộ khẩu");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/lich-su-nhan-khau/${soHoKhau}`);
      if (!res.ok) {
        if (res.status === 404) {
          setNhanKhauHistory([]);
          setError("Không tìm thấy lịch sử thay đổi nhân khẩu cho hộ khẩu này");
        } else {
          throw new Error(`API lỗi: ${res.status}`);
        }
      } else {
        const data = await res.json();
        setNhanKhauHistory(data || []);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải lịch sử thay đổi nhân khẩu. Vui lòng thử lại.");
      setNhanKhauHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHoKhauHistory = async () => {
    if (!soHoKhau) {
      setError("Vui lòng nhập số hộ khẩu");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/lich-su-ho-khau/${soHoKhau}`);
      if (!res.ok) {
        if (res.status === 404) {
          setHoKhauHistory([]);
          setError("Không tìm thấy lịch sử thay đổi hộ khẩu cho hộ khẩu này");
        } else {
          throw new Error(`API lỗi: ${res.status}`);
        }
      } else {
        const data = await res.json();
        setHoKhauHistory(data || []);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải lịch sử thay đổi hộ khẩu. Vui lòng thử lại.");
      setHoKhauHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === "nhanKhau") {
      fetchNhanKhauHistory();
    } else {
      fetchHoKhauHistory();
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
                    Xem lịch sử thay đổi nhân khẩu và hộ khẩu theo số hộ khẩu.
                  </p>
                </div>
              </div>

              {/* Search Section */}
              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40 p-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm text-gray-300 mb-2 block">Số hộ khẩu</label>
                    <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-4 py-3 border border-gray-700/60">
                      <Home className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        className="bg-transparent flex-1 text-gray-100 focus:outline-none"
                        placeholder="Nhập số hộ khẩu (ví dụ: 1, 2, 3...)"
                        value={soHoKhau}
                        onChange={(e) => setSoHoKhau(e.target.value)}
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
                    disabled={loading || !soHoKhau}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="w-5 h-5" />
                    {loading ? "Đang tải..." : "Tìm kiếm"}
                  </button>
                </div>
              </section>

              {/* Tabs */}
              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setActiveTab("nhanKhau");
                        if (soHoKhau && nhanKhauHistory.length === 0) {
                          fetchNhanKhauHistory();
                        }
                      }}
                      className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                        activeTab === "nhanKhau"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800/80 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      Lịch sử thay đổi nhân khẩu
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("hoKhau");
                        if (soHoKhau && hoKhauHistory.length === 0) {
                          fetchHoKhauHistory();
                        }
                      }}
                      className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                        activeTab === "hoKhau"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800/80 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      Lịch sử thay đổi hộ khẩu
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
                  ) : !soHoKhau ? (
                    <div className="p-12 text-center text-gray-400">
                      Vui lòng nhập số hộ khẩu và nhấn "Tìm kiếm" để xem lịch sử thay đổi
                    </div>
                  ) : currentHistory.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      Không có lịch sử thay đổi nào cho hộ khẩu này
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeTab === "nhanKhau" ? (
                        <table className="w-full text-sm">
                          <thead className="bg-white/5 text-gray-400 uppercase">
                            <tr>
                              <th className="px-6 py-4 text-left">Mã nhân khẩu</th>
                              <th className="px-6 py-4 text-left">Loại thay đổi</th>
                              <th className="px-6 py-4 text-left">Nội dung thay đổi</th>
                              <th className="px-6 py-4 text-left">Ngày chuyển đi</th>
                              <th className="px-6 py-4 text-left">Nơi chuyển</th>
                              <th className="px-6 py-4 text-left">Ngày thay đổi</th>
                              <th className="px-6 py-4 text-left">Ghi chú</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nhanKhauHistory.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b border-white/5 hover:bg-white/5 transition"
                              >
                                <td className="px-6 py-4 text-white font-semibold">
                                  {item.maNhanKhau || "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {item.loaiThayDoi || "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {item.noiDungThayDoi || "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {formatDate(item.ngayChuyenDi)}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {item.noiChuyen || "—"}
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
                      ) : (
                        <table className="w-full text-sm">
                          <thead className="bg-white/5 text-gray-400 uppercase">
                            <tr>
                              <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                              <th className="px-6 py-4 text-left">Loại thay đổi</th>
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
                                  {item.soHoKhau || "—"}
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

