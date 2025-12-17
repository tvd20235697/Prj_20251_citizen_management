import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { donationCampaigns } from "../data/fees";

export default function DonationCampaigns() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return donationCampaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const statusConfig = {
    active: { label: "ĐANG MỞ", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40" },
    upcoming: { label: "SẮP MỞ", color: "bg-blue-500/10 text-blue-300 border-blue-500/40" },
    closed: { label: "ĐÃ ĐÓNG", color: "bg-gray-500/10 text-gray-300 border-gray-500/40" },
  };

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
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                    Các Đợt Đóng Góp
                  </h1>
                </div>
                <button
                  onClick={() => navigate("/donations/campaigns/create")}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Tạo đợt đóng góp mới
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 border border-gray-700 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm..." className="bg-transparent px-2 py-2 text-sm focus:outline-none flex-1" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-xl border border-gray-700">
                  <option value="all">Tất cả</option>
                  <option value="active">Đang mở</option>
                  <option value="upcoming">Sắp mở</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((campaign) => {
                  const config = statusConfig[campaign.status];
                  const participationRate = campaign.householdsCount > 0 ? ((campaign.participatingCount / campaign.householdsCount) * 100).toFixed(0) : 0;
                  return (
                    <div key={campaign.id} className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                          {config.label}
                        </span>
                        {campaign.status === "upcoming" && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 text-xs">✏️ Sửa</button>
                            <button className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30 text-xs">🗑️ Xóa</button>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-400">{campaign.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(campaign.startDate).toLocaleDateString("vi-VN")} - {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                      </p>
                      {campaign.status === "active" || campaign.status === "closed" ? (
                        <>
                          <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700 space-y-2">
                            <p className="text-sm text-gray-300">
                              {campaign.participatingCount} hộ đã đóng / {campaign.householdsCount} hộ ({participationRate}%)
                            </p>
                            <p className="text-lg font-semibold text-white">Tổng: {campaign.totalCollected.toLocaleString("vi-VN")} đ</p>
                            {campaign.targetAmount && (
                              <div className="mt-2">
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500"
                                    style={{ width: `${Math.min(100, (campaign.totalCollected / campaign.targetAmount) * 100)}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  Đạt được: {((campaign.totalCollected / campaign.targetAmount) * 100).toFixed(0)}%
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-400/30 text-sm">
                              📊 {campaign.status === "active" ? "Xem chi tiết" : "Xem báo cáo"}
                            </button>
                            {campaign.status === "active" && (
                              <button className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 text-sm">
                                💵 Thu đóng góp
                              </button>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

