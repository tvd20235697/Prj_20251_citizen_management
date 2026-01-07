import { useEffect, useMemo, useState } from "react";
import { BarChart3, MapPinned, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

const areaMeta = [
  { id: 1, name: "Tổ dân phố 1", gradient: "from-blue-500 to-indigo-500" },
  { id: 2, name: "Tổ dân phố 2", gradient: "from-teal-500 to-emerald-500" },
  { id: 3, name: "Tổ dân phố 3", gradient: "from-orange-500 to-amber-500" },
  { id: 4, name: "Tổ dân phố 4", gradient: "from-purple-500 to-pink-500" },
  { id: 5, name: "Tổ dân phố 5", gradient: "from-rose-500 to-red-500" },
  { id: 6, name: "Tổ dân phố 6", gradient: "from-cyan-500 to-blue-400" },
  { id: 7, name: "Tổ dân phố 7", gradient: "from-lime-500 to-green-500" },
];

export default function HouseholdByArea() {
  const [activeArea, setActiveArea] = useState(1);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/hokhau`);
        if (!response.ok) {
          throw new Error(`Không thể tải danh sách hộ khẩu (status ${response.status})`);
        }
        const data = await response.json();
        const mapped = (Array.isArray(data) ? data : []).map((hk) => {
          const soHoKhau = hk.soHoKhau ?? hk.id;
          return {
            id: soHoKhau != null ? String(soHoKhau) : "",
            soHoKhau,
            headName: hk.chuHo || "Chưa có chủ hộ",
            address: hk.diaChi || "",
            area: hk.maXaPhuong || "",
            members: hk.soNhanKhau ?? 0,
            registeredAt: hk.ngayCap || null,
          };
        });
        setHouseholds(mapped);
      } catch (e) {
        console.error("Error fetching households by area:", e);
        setError(e.message || "Không thể tải danh sách hộ khẩu");
        setHouseholds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  const areaStats = useMemo(() => {
    return areaMeta.map((area) => {
      const areaHouseholds = households.filter((record) => Number(record.area || 0) === area.id);
      const residents = areaHouseholds.reduce((sum, record) => sum + (record.members || 0), 0);
      return {
        ...area,
        households: areaHouseholds,
        householdsCount: areaHouseholds.length,
        residentsCount: residents,
      };
    });
  }, [households]);

  const selectedArea = areaStats.find((area) => area.id === activeArea);

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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Analytics</p>
                  <h1 className="text-3xl font-semibold text-white">Tìm kiếm hộ khẩu theo Tổ dân phố</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Chọn một tổ dân phố để xem danh sách hộ khẩu cùng số lượng nhân khẩu tương ứng.
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/households")}
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                >
                  ← Quay lại danh sách
                </button>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {areaStats.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setActiveArea(area.id)}
                    className={`rounded-3xl p-5 text-left border transition shadow-lg shadow-black/30 ${
                      activeArea === area.id ? "border-white/50 bg-white/10" : "border-white/10 bg-gray-900/80 hover:border-white/30"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${area.gradient} flex items-center justify-center text-white mb-4`}>
                      <MapPinned className="w-6 h-6" />
                    </div>
                    <p className="text-sm uppercase tracking-wide text-gray-400">{area.name}</p>
                    <p className="text-3xl font-bold text-white mt-2">{area.householdsCount} hộ</p>
                    <p className="text-xs text-gray-400 mt-1">{area.residentsCount} nhân khẩu</p>
                  </button>
                ))}
              </section>

              {selectedArea && (
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-300" />
                      Tổng quan {selectedArea.name}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-200">
                      <div className="rounded-2xl border border-white/10 p-4">
                        <p className="text-xs uppercase text-gray-400">Số hộ khẩu</p>
                        <p className="text-2xl font-semibold text-white mt-2">{selectedArea.householdsCount}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 p-4">
                        <p className="text-xs uppercase text-gray-400">Nhân khẩu</p>
                        <p className="text-2xl font-semibold text-white mt-2">{selectedArea.residentsCount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Dữ liệu được tổng hợp dựa trên hộ khẩu đã đăng ký chính thức trong khu vực {selectedArea.name}.
                    </p>
                  </div>

                  <div className="lg:col-span-3 bg-gray-900/80 border border-white/5 rounded-3xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-300" />
                      Danh sách hộ khẩu - {selectedArea.name}
                    </h2>
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                      {loading ? (
                        <p className="text-sm text-gray-400">Đang tải dữ liệu hộ khẩu...</p>
                      ) : error ? (
                        <p className="text-sm text-red-400">{error}</p>
                      ) : selectedArea.households.length ? (
                        selectedArea.households.map((record) => (
                          <div key={record.id} className="rounded-2xl border border-white/10 p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <p className="text-white font-semibold">{record.headName}</p>
                              <span className="text-xs text-gray-400">{record.id}</span>
                            </div>
                            <p className="text-xs text-gray-500">{record.address}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white">
                                {record.members} nhân khẩu
                              </span>
                              {record.registeredAt && (
                                <span className="text-gray-400">
                                  {new Date(record.registeredAt).toLocaleDateString("vi-VN")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Chưa có dữ liệu hộ khẩu cho tổ này.</p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}




