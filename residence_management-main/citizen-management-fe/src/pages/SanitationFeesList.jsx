import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, FileText, Mail, PlusCircle, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { sanitationFeeRecords, feeRate } from "../data/fees";
import { householdRecords } from "../data/households";

export default function SanitationFeesList() {
  const navigate = useNavigate();
  const [year, setYear] = useState(2024);
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const allRecords = useMemo(() => {
    return householdRecords.map((household) => {
      const feeRecord = sanitationFeeRecords.find((r) => r.householdId === household.id && r.year === year);
      const requiredAmount = feeRate * 12 * household.members;
      const paidAmount = feeRecord?.paidAmount || 0;
      let status = "unpaid";
      if (paidAmount >= requiredAmount) status = "paid";
      else if (paidAmount > 0) status = "partial";

      return {
        ...household,
        requiredAmount,
        paidAmount,
        status,
        payments: feeRecord?.payments || [],
      };
    });
  }, [year]);

  const filtered = useMemo(() => {
    return allRecords.filter((record) => {
      const matchesSearch =
        record.headName.toLowerCase().includes(search.toLowerCase()) ||
        record.id.toLowerCase().includes(search.toLowerCase());
      const matchesArea = areaFilter === "all" ? true : Number(areaFilter) === record.area;
      const matchesStatus = statusFilter === "all" ? true : record.status === statusFilter;
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [allRecords, search, areaFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const paid = filtered.filter((r) => r.status === "paid").length;
    const unpaid = filtered.filter((r) => r.status === "unpaid").length;
    const partial = filtered.filter((r) => r.status === "partial").length;
    return { total, paid, unpaid, partial };
  }, [filtered]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <video className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none" src="/videos/background.mp4" autoPlay loop muted />
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
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/fees/sanitation/collect")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Lập phiếu thu
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-200 border border-emerald-500/30 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Excel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Tổng hộ</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">100%</p>
                </div>
                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Đã nộp</p>
                  <p className="text-3xl font-bold text-emerald-300 mt-2">{stats.paid}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(1) : 0}%</p>
                </div>
                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Chưa nộp</p>
                  <p className="text-3xl font-bold text-red-300 mt-2">{stats.unpaid}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total > 0 ? ((stats.unpaid / stats.total) * 100).toFixed(1) : 0}%</p>
                </div>
                <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Nộp thiếu</p>
                  <p className="text-3xl font-bold text-yellow-300 mt-2">{stats.partial}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total > 0 ? ((stats.partial / stats.total) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>

              <div className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center">
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-xl border border-gray-700">
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                  <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-xl border border-gray-700">
                    <option value="all">Tất cả tổ DP</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((a) => (
                      <option key={a} value={a}>Tổ {a}</option>
                    ))}
                  </select>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-xl border border-gray-700">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="paid">Đã nộp</option>
                    <option value="unpaid">Chưa nộp</option>
                    <option value="partial">Nộp thiếu</option>
                  </select>
                  <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 border border-gray-700 flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên chủ hộ, số HK..." className="bg-transparent px-2 py-2 text-sm focus:outline-none flex-1" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 uppercase">
                      <tr>
                        <th className="px-6 py-4 text-left">STT</th>
                        <th className="px-6 py-4 text-left">Hộ khẩu</th>
                        <th className="px-6 py-4 text-left">Số NK</th>
                        <th className="px-6 py-4 text-left">Phải nộp</th>
                        <th className="px-6 py-4 text-left">Đã nộp</th>
                        <th className="px-6 py-4 text-left">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((record, idx) => {
                        const statusBadges = {
                          paid: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
                          partial: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40",
                          unpaid: "bg-red-500/10 text-red-300 border border-red-500/40",
                        };
                        const statusLabels = {
                          paid: "✅ Đủ",
                          partial: "⚠️ Thiếu",
                          unpaid: "❌ Chưa",
                        };
                        return (
                          <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-white">{record.headName}</p>
                              <p className="text-xs text-gray-400">{record.id}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-200">{record.members}</td>
                            <td className="px-6 py-4 text-gray-200">{record.requiredAmount.toLocaleString("vi-VN")} đ</td>
                            <td className="px-6 py-4 text-gray-200">{record.paidAmount.toLocaleString("vi-VN")} đ</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadges[record.status]}`}>
                                {statusLabels[record.status]}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button className="p-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-400/30" title="Xem chi tiết">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate("/fees/sanitation/collect")}
                                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                                  title="Lập phiếu thu"
                                >
                                  💵
                                </button>
                                <button className="p-2 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-400/30" title="In biên lai">
                                  🖨️
                                </button>
                                <button className="p-2 rounded-lg bg-yellow-500/10 text-yellow-300 border border-yellow-400/30" title="Gửi thông báo">
                                  <Mail className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                  <p className="text-sm text-gray-400">Hiển thị {paginated.length} trên {filtered.length} hộ</p>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50">
                      Trước
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}>
                          {page}
                        </button>
                      );
                    })}
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50">
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

