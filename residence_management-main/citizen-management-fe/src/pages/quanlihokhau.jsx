import { useMemo, useState } from "react";
import { Filter, MapPin, Pencil, Trash2, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { householdRecords } from "../data/households";

const typeConfig = {
  "thuong-tru": { label: "Thường trú", className: "bg-emerald-500/10 text-emerald-300 border border-emerald-600/30" },
  "tam-tru": { label: "Tạm trú", className: "bg-amber-500/10 text-amber-200 border border-amber-500/30" },
  "kinh-doanh": { label: "Kinh doanh", className: "bg-blue-500/10 text-blue-200 border border-blue-500/30" },
};

const areas = Array.from({ length: 7 }, (_, i) => i + 1);

export default function QuanLiHoKhau() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ area: "all", type: "all" });
  const [selected, setSelected] = useState(null);
  const [detailMode, setDetailMode] = useState("view");

  const filteredHouseholds = useMemo(() => {
    return householdRecords.filter((household) => {
      const matchesSearch =
        household.id.toLowerCase().includes(search.toLowerCase()) ||
        household.headName.toLowerCase().includes(search.toLowerCase()) ||
        household.address.toLowerCase().includes(search.toLowerCase());
      const matchesArea = filters.area === "all" ? true : Number(filters.area) === household.area;
      const matchesType = filters.type === "all" ? true : filters.type === household.type;
      return matchesSearch && matchesArea && matchesType;
    });
  }, [search, filters]);

  const stats = useMemo(() => {
    const total = householdRecords.length;
    const residents = householdRecords.reduce((sum, item) => sum + item.members, 0);
    const thuongTru = householdRecords.filter((item) => item.type === "thuong-tru").length;
    return [
      { label: "Tổng hộ khẩu", value: total, description: "Toàn phường La Khê" },
      { label: "Thường trú", value: thuongTru, description: "Hộ cư trú ổn định" },
      { label: "Tổng nhân khẩu", value: residents, description: "Số nhân khẩu đã khai báo" },
    ];
  }, []);

  const openDetail = (household, mode = "view") => {
    setSelected(household);
    setDetailMode(mode);
  };

  const closeDetail = () => {
    setSelected(null);
  };

  const handleDelete = (household) => {
    if (confirm(`Bạn chắc chắn muốn xoá hộ khẩu ${household.id}?`)) {
      alert("Đã xoá (mô phỏng).");
    }
  };

  const handleUpdate = () => {
    alert("Đã lưu thay đổi (mô phỏng).");
    setDetailMode("view");
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
                  <h1 className="text-3xl font-semibold text-white">Quản lý Hộ khẩu</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Theo dõi, tra cứu và thao tác nhanh với dữ liệu hộ khẩu của 7 tổ dân phố trong phường La Khê.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => (window.location.href = "/households/add")}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    + Thêm hộ khẩu mới
                  </button>
                  <button
                    onClick={() => (window.location.href = "/households/by-area")}
                    className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                  >
                    Tìm kiếm theo tổ
                  </button>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((card) => (
                  <div key={card.label} className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/30">
                    <p className="text-sm text-gray-400 uppercase tracking-wide">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                ))}
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-xl flex-1 min-w-[220px]">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm số hộ khẩu, chủ hộ, địa chỉ..."
                        className="bg-transparent text-sm focus:outline-none flex-1"
                      />
                    </div>
                    <select
                      className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
                      value={filters.area}
                      onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                    >
                      <option value="all">Tất cả tổ dân phố</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          Tổ dân phố {area}
                        </option>
                      ))}
                    </select>
                    <select
                      className="bg-gray-800/80 text-sm px-3 py-2 rounded-xl border border-gray-700 text-gray-100"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                      <option value="all">Tất cả loại hộ</option>
                      <option value="thuong-tru">Thường trú</option>
                      <option value="tam-tru">Tạm trú</option>
                      <option value="kinh-doanh">Kinh doanh</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-gray-400 uppercase">
                      <tr>
                        <th className="px-6 py-4 text-left">Số hộ khẩu</th>
                        <th className="px-6 py-4 text-left">Chủ hộ</th>
                        <th className="px-6 py-4 text-left">Tổ / Địa chỉ</th>
                        <th className="px-6 py-4 text-left">Loại hộ</th>
                        <th className="px-6 py-4 text-left">Nhân khẩu</th>
                        <th className="px-6 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHouseholds.length ? (
                        filteredHouseholds.map((household) => {
                          const typeStyle = typeConfig[household.type];
                          return (
                            <tr key={household.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="px-6 py-4 font-semibold text-white">{household.id}</td>
                              <td className="px-6 py-4 text-gray-200">{household.headName}</td>
                              <td className="px-6 py-4 text-gray-300">
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-300" />Tổ {household.area}
                                </p>
                                <p className="text-xs text-gray-500">{household.address}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${typeStyle.className}`}>
                                  {typeStyle.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">
                                  <Users className="w-3.5 h-3.5" />
                                  {household.members} người
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30"
                                    onClick={() => openDetail(household, "view")}
                                  >
                                    Xem
                                  </button>
                                  <button
                                    className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30"
                                    onClick={() => openDetail(household, "edit")}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30"
                                    onClick={() => handleDelete(household)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                            Không có dữ liệu phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 text-sm text-gray-400 border-t border-white/5">
                  Hiển thị {filteredHouseholds.length} trên {householdRecords.length} hộ khẩu
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetail} />
          <div className="relative w-full max-w-md bg-gray-950 border-l border-white/10 h-full overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Chi tiết hộ khẩu</p>
                <h3 className="text-2xl font-semibold text-white">{selected.headName}</h3>
                <p className="text-xs text-gray-400">{selected.id} • Tổ dân phố {selected.area}</p>
              </div>
              <button onClick={closeDetail} className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Địa chỉ</p>
                <p className="text-white font-semibold mt-1">{selected.address}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Loại hộ</p>
                <p className="text-white font-semibold mt-1">{typeConfig[selected.type].label}</p>
                <p className="text-gray-500 text-xs mt-1">Đăng ký: {new Date(selected.registeredAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Số nhân khẩu</p>
                <p className="text-white font-semibold mt-1">{selected.members} người</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-gray-400 text-xs uppercase">Liên hệ</p>
                <p className="text-white font-semibold mt-1">{selected.phone}</p>
              </div>

              <label className="text-xs uppercase text-gray-400">Ghi chú</label>
              <textarea
                disabled={detailMode === "view"}
                defaultValue={selected.note}
                className="w-full rounded-2xl bg-gray-900 border border-white/10 text-gray-100 p-3 min-h-[120px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex gap-3">
              {detailMode === "edit" ? (
                <>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-semibold" onClick={handleUpdate}>
                    Lưu thay đổi
                  </button>
                  <button className="flex-1 bg-gray-800 text-gray-300 border border-gray-700 py-3 rounded-2xl" onClick={() => setDetailMode("view")}>
                    Huỷ
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-gray-800 text-gray-200 border border-gray-700 py-3 rounded-2xl" onClick={() => setDetailMode("edit")}>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

