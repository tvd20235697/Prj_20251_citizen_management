import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, TrendingUp, Eye, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function DonationCampaigns() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [householdsData, setHouseholdsData] = useState({}); // Map maLoaiPhi -> danh sách hộ đã đóng
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch danh sách loại phí
      const feeTypesRes = await fetch(`${API_BASE}/loai-phi`);
      if (!feeTypesRes.ok) throw new Error(`API lỗi: ${feeTypesRes.status}`);
      const feeTypesData = await feeTypesRes.json();
      
      // Lọc chỉ lấy những loại phí không bắt buộc (batBuoc: false)
      const voluntaryFees = (feeTypesData || []).filter(fee => fee.batBuoc === false);
      setDonations(voluntaryFees);

      // Fetch tiến độ đóng góp
      const progressRes = await fetch(`${API_BASE}/dong-gop/tien-do`);
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgressData(progressData || []);
      }

      // Fetch danh sách hộ đã đóng cho từng loại phí
      const householdsMap = {};
      await Promise.all(
        voluntaryFees.map(async (fee) => {
          try {
            const res = await fetch(`${API_BASE}/dong-gop/${fee.maLoaiPhi}/ho-da-dong`);
            if (res.ok) {
              const data = await res.json();
              householdsMap[fee.maLoaiPhi] = data || [];
            }
          } catch (err) {
            console.error(`Error fetching households for fee ${fee.maLoaiPhi}:`, err);
            householdsMap[fee.maLoaiPhi] = [];
          }
        })
      );
      setHouseholdsData(householdsMap);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (donation) => {
    try {
      // Fetch lại danh sách hộ đã đóng cho loại phí này
      const res = await fetch(`${API_BASE}/dong-gop/${donation.maLoaiPhi}/ho-da-dong`);
      if (res.ok) {
        const data = await res.json();
        setHouseholdsData(prev => ({
          ...prev,
          [donation.maLoaiPhi]: data || []
        }));
      }
      setSelectedDonation(donation);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết. Vui lòng thử lại.");
    }
  };

  // Format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Lấy thông tin tiến độ cho một loại phí
  const getProgressInfo = (maLoaiPhi) => {
    return progressData.find(p => p.maLoaiPhi === maLoaiPhi) || {
      tongDaDong: 0,
      mucTieu: null,
      tiLeHoanThanh: 0,
    };
  };

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch = donation.tenLoaiPhi?.toLowerCase().includes(search.toLowerCase()) ||
                           donation.moTa?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [donations, search]);

  // Tính số hộ đã đóng (unique households)
  const getUniqueHouseholdsCount = (households) => {
    if (!households || households.length === 0) return 0;
    const uniqueHouseholds = new Set(households.map(h => h.soHoKhau));
    return uniqueHouseholds.size;
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
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                    Đóng Góp Tự Nguyện
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Quản lý các khoản đóng góp tự nguyện, không bắt buộc
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 border border-gray-700 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Tìm kiếm..."
                    className="bg-transparent px-2 py-2 text-sm focus:outline-none flex-1"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-400">Đang tải dữ liệu...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400">Chưa có khoản đóng góp tự nguyện nào</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtered.map((donation) => {
                    const progress = getProgressInfo(donation.maLoaiPhi);
                    const households = householdsData[donation.maLoaiPhi] || [];
                    const uniqueHouseholdsCount = getUniqueHouseholdsCount(households);
                    const totalCollected = progress.tongDaDong || 0;
                    const targetAmount = progress.mucTieu || donation.mucTieu;
                    const completionPercentage = targetAmount && targetAmount > 0
                      ? Math.min(100, (totalCollected / targetAmount) * 100)
                      : 0;

                    return (
                      <div key={donation.maLoaiPhi} className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/40">
                            TỰ NGUYỆN
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{donation.tenLoaiPhi}</h3>
                        <p className="text-sm text-gray-400">{donation.moTa || "—"}</p>

                        <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700 space-y-3">
                          {/* Số hộ đã đóng góp */}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            <p className="text-sm text-gray-300">
                              <span className="text-white font-semibold">{uniqueHouseholdsCount}</span> hộ đã đóng góp
                            </p>
                          </div>

                          {/* Tổng số tiền đã thu */}
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">
                              Tổng số tiền đã thu: <span className="text-white font-semibold">{formatCurrency(totalCollected)}</span>
                            </p>
                            {targetAmount && (
                              <>
                                <p className="text-sm text-gray-400">
                                  Mục tiêu: <span className="text-white font-semibold">{formatCurrency(targetAmount)}</span>
                                </p>
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">Tiến độ hoàn thành</span>
                                    <span className="text-xs font-semibold text-emerald-300">
                                      {completionPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 transition-all"
                                      style={{ width: `${completionPercentage}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatCurrency(totalCollected)} / {formatCurrency(targetAmount)}
                                  </p>
                                </div>
                              </>
                            )}
                            {!targetAmount && (
                              <p className="text-xs text-gray-500 mt-2">
                                Không có mục tiêu cụ thể
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetail(donation)}
                            className="flex-1 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-400/30 text-sm hover:bg-blue-500/20 transition"
                          >
                            <Eye className="w-4 h-4 inline mr-2" />
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal Xem chi tiết */}
      {showDetailModal && selectedDonation && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-4xl bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-300" />
                Chi tiết đóng góp: {selectedDonation.tenLoaiPhi}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Thông tin tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">Số hộ đã đóng góp</p>
                  <p className="text-2xl font-bold text-blue-300">
                    {getUniqueHouseholdsCount(householdsData[selectedDonation.maLoaiPhi] || [])}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">Tổng đã thu</p>
                  <p className="text-2xl font-bold text-emerald-300">
                    {formatCurrency(getProgressInfo(selectedDonation.maLoaiPhi).tongDaDong)}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-400 mb-2">Mục tiêu</p>
                  <p className="text-2xl font-bold text-white">
                    {getProgressInfo(selectedDonation.maLoaiPhi).mucTieu
                      ? formatCurrency(getProgressInfo(selectedDonation.maLoaiPhi).mucTieu)
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Tiến độ */}
              {(() => {
                const progress = getProgressInfo(selectedDonation.maLoaiPhi);
                const targetAmount = progress.mucTieu;
                const totalCollected = progress.tongDaDong || 0;
                const completionPercentage = targetAmount && targetAmount > 0
                  ? Math.min(100, (totalCollected / targetAmount) * 100)
                  : 0;

                return targetAmount ? (
                  <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">Tiến độ hoàn thành</p>
                      <p className="text-lg font-bold text-emerald-300">
                        {completionPercentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{
                          width: `${completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Danh sách hộ đã đóng góp */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Danh sách hộ đã đóng góp</h4>
                {householdsData[selectedDonation.maLoaiPhi]?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Số hộ khẩu</th>
                          <th className="px-4 py-3 text-left">Địa chỉ</th>
                          <th className="px-4 py-3 text-left">Phường/Xã</th>
                          <th className="px-4 py-3 text-right">Số tiền đóng góp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {householdsData[selectedDonation.maLoaiPhi].map((household, idx) => (
                          <tr
                            key={`${household.soHoKhau}-${idx}`}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="px-4 py-3 text-white font-semibold">{household.soHoKhau}</td>
                            <td className="px-4 py-3 text-gray-300">{household.diaChi || "—"}</td>
                            <td className="px-4 py-3 text-gray-300">{household.tenXaPhuong || "—"}</td>
                            <td className="px-4 py-3 text-emerald-300 font-medium text-right">
                              {formatCurrency(household.soTien || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 bg-gray-900/50 border border-white/10 rounded-xl">
                    Chưa có hộ nào đóng góp
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
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
    </div>
  );
}
