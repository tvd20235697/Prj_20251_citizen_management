import Sidebar from "../components/Sidebar";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  Label,
} from "recharts";

const API_BASE = "http://localhost:8080/api/nhankhau/thong-ke";

const GENDER_COLORS = ["#3b82f6", "#ec4899"]; // xanh - hồng
const STATUS_COLORS = ["#22c55e", "#f97316", "#ef4444", "#6366f1"];

function formatDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function buildRangePayload(from, to) {
  return {
    tuNgay: `${from}T00:00:00`,
    denNgay: `${to}T23:59:59`,
  };
}

export default function Dashboard() {
  console.log("Dashboard component rendering...");
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // --- Thống kê giới tính ---
  const [genderStats, setGenderStats] = useState(null);
  const [genderLoading, setGenderLoading] = useState(false);
  const [genderError, setGenderError] = useState(null);

  // --- Thống kê độ tuổi ---
  const [ageStats, setAgeStats] = useState(null);
  const [ageLoading, setAgeLoading] = useState(false);
  const [ageError, setAgeError] = useState(null);

  // --- Thống kê sinh theo thời gian ---
  const [birthFrom, setBirthFrom] = useState(formatDateInputValue(new Date(new Date().getFullYear(), 0, 1)));
  const [birthTo, setBirthTo] = useState(formatDateInputValue(new Date()));
  const [birthStats, setBirthStats] = useState(null);
  const [birthLoading, setBirthLoading] = useState(false);
  const [birthError, setBirthError] = useState(null);

  // --- Thống kê tạm trú ---
  const [tempResFrom, setTempResFrom] = useState(formatDateInputValue(new Date(new Date().getFullYear(), 0, 1)));
  const [tempResTo, setTempResTo] = useState(formatDateInputValue(new Date()));
  const [tempResStats, setTempResStats] = useState(null);
  const [tempResLoading, setTempResLoading] = useState(false);
  const [tempResError, setTempResError] = useState(null);

  // --- Thống kê tạm vắng ---
  const [tempAbsFrom, setTempAbsFrom] = useState(formatDateInputValue(new Date(new Date().getFullYear(), 0, 1)));
  const [tempAbsTo, setTempAbsTo] = useState(formatDateInputValue(new Date()));
  const [tempAbsStats, setTempAbsStats] = useState(null);
  const [tempAbsLoading, setTempAbsLoading] = useState(false);
  const [tempAbsError, setTempAbsError] = useState(null);

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Fetch giới tính
  useEffect(() => {
    const fetchGender = async () => {
      try {
        setGenderLoading(true);
        setGenderError(null);
        const res = await fetch(`${API_BASE}/gioi-tinh`);
        if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
        const data = await res.json();
        setGenderStats(data);
      } catch (err) {
        console.error("Error fetching gender stats:", err);
        setGenderError(err.message || "Không thể tải dữ liệu giới tính");
        setHasError(true);
        setErrorMessage(err.message || "Không thể tải dữ liệu giới tính");
      } finally {
        setGenderLoading(false);
      }
    };
    fetchGender();
  }, []);

  // Fetch độ tuổi
  useEffect(() => {
    const fetchAge = async () => {
      try {
        setAgeLoading(true);
        setAgeError(null);
        const res = await fetch(`${API_BASE}/do-tuoi`);
        if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
        const data = await res.json();
        setAgeStats(data);
      } catch (err) {
        setAgeError(err.message || "Không thể tải dữ liệu độ tuổi");
      } finally {
        setAgeLoading(false);
      }
    };
    fetchAge();
  }, []);

  const fetchBirthStats = async () => {
    try {
      setBirthLoading(true);
      setBirthError(null);
      const res = await fetch(`${API_BASE}/thoi-gian`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRangePayload(birthFrom, birthTo)),
      });
      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
      const data = await res.json();
      setBirthStats(data);
    } catch (err) {
      setBirthError(err.message || "Không thể tải thống kê sinh");
    } finally {
      setBirthLoading(false);
    }
  };

  const fetchTempResStats = async () => {
    try {
      setTempResLoading(true);
      setTempResError(null);
      const res = await fetch(`${API_BASE}/tam-tru`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRangePayload(tempResFrom, tempResTo)),
      });
      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
      const data = await res.json();
      setTempResStats(data);
    } catch (err) {
      setTempResError(err.message || "Không thể tải thống kê tạm trú");
    } finally {
      setTempResLoading(false);
    }
  };

  const fetchTempAbsStats = async () => {
    try {
      setTempAbsLoading(true);
      setTempAbsError(null);
      const res = await fetch(`${API_BASE}/tam-vang`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRangePayload(tempAbsFrom, tempAbsTo)),
      });
      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
      const data = await res.json();
      setTempAbsStats(data);
    } catch (err) {
      setTempAbsError(err.message || "Không thể tải thống kê tạm vắng");
    } finally {
      setTempAbsLoading(false);
    }
  };

  // Khởi tạo các thống kê dùng range
  useEffect(() => {
    fetchBirthStats();
    fetchTempResStats();
    fetchTempAbsStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const genderChartData = genderStats
    ? [
        { name: "Nam", value: genderStats.nam ?? 0 },
        { name: "Nữ", value: genderStats.nu ?? 0 },
      ]
    : [];

  // Thứ tự sắp xếp độ tuổi
  const AGE_ORDER = ["Mam non", "Mau giao", "Cap 1", "Cap 2", "Cap 3", "Do tuoi lao dong", "Nghi huu"];

  const ageChartData = ageStats
    ? Object.entries(ageStats.chiTiet || {})
        .map(([key, value]) => ({
          name: key,
          value,
          order: AGE_ORDER.indexOf(key),
        }))
        .sort((a, b) => {
          // Sắp xếp theo thứ tự định nghĩa, nếu không có trong danh sách thì đặt cuối
          const orderA = a.order === -1 ? 999 : a.order;
          const orderB = b.order === -1 ? 999 : b.order;
          return orderA - orderB;
        })
        .map(({ name, value }) => ({ name, value }))
    : [];

  const buildMonthlySeries = (list, dateField) => {
    if (!Array.isArray(list)) return [];
    const map = new Map();
    list.forEach((item) => {
      const raw = item[dateField];
      if (!raw) return;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  };

  const birthChartData = birthStats ? buildMonthlySeries(birthStats.danhSach || [], "ngaySinh") : [];
  const tempResStatusData = tempResStats
    ? Object.entries(tempResStats.theoTrangThai || {}).map(([name, value]) => ({
        name,
        value,
      }))
    : [];
  const tempResTimeData = tempResStats ? buildMonthlySeries(tempResStats.danhSach || [], "tuNgay") : [];

  const tempAbsStatusData = tempAbsStats
    ? Object.entries(tempAbsStats.theoTrangThai || {}).map(([name, value]) => ({
        name,
        value,
      }))
    : [];
  const tempAbsTimeData = tempAbsStats ? buildMonthlySeries(tempAbsStats.danhSach || [], "tuNgay") : [];

  const totalResidents = genderStats?.tongSo ?? ageStats?.tongSo ?? null;

  console.log("Dashboard render state:", { hasError, errorMessage, totalResidents });

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="flex h-screen w-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải Dashboard</h1>
            <p className="text-gray-600 mb-4">{errorMessage || "Đã xảy ra lỗi không xác định"}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm flex-shrink-0 border-b border-gray-200">
          <div className="px-6 md:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard thống kê</h1>
              <p className="text-gray-600 mt-1 text-sm">Tổng quan dân cư, tạm trú, tạm vắng</p>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-2 rounded-md hover:shadow-sm"
                aria-expanded={profileOpen}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
                <div className="text-sm text-gray-800">Admin</div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 py-2">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Thông tin tài khoản
                  </Link>
                  <Link to="/account/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Đổi mật khẩu
                  </Link>
                  <div className="border-t my-1" />
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center gap-4 mb-2">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/nhankhau/danh-sach"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Quản lý Nhân khẩu
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Tổng nhân khẩu</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {totalResidents != null ? totalResidents : "--"}
                    </p>
                  </div>
                  <div className="text-4xl text-blue-500">👥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Nam / Nữ</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {genderStats ? `${genderStats.nam ?? 0} Nam • ${genderStats.nu ?? 0} Nữ` : "--"}
                    </p>
                  </div>
                  <div className="text-4xl text-pink-500">⚥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Đang / đã tạm trú</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{tempResStats?.tongSo ?? "--"}</p>
                  </div>
                  <div className="text-4xl text-emerald-500">🏡</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Đang / đã tạm vắng</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{tempAbsStats?.tongSo ?? "--"}</p>
                  </div>
                  <div className="text-4xl text-orange-500">🚶</div>
                </div>
              </div>
            </div>

            {/* Dòng 1: Giới tính + Độ tuổi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut giới tính */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Thống kê theo giới tính</h2>
                    <p className="text-xs text-gray-500 mt-1">Biểu đồ Donut: Nam / Nữ</p>
                  </div>
                </div>
                <div className="h-64">
                  {genderLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">Đang tải...</div>
                  ) : genderError ? (
                    <div className="h-full flex items-center justify-center text-red-500 text-sm">{genderError}</div>
                  ) : genderChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      Không có dữ liệu giới tính
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderChartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius="60%"
                          outerRadius="90%"
                          paddingAngle={3}
                        >
                          {genderChartData.map((_, index) => (
                            <Cell key={index} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                          ))}
                          <Label
                            value={genderStats?.tongSo != null ? `Tổng ${genderStats.tongSo}` : ""}
                            position="center"
                            fill="#111827"
                            style={{ fontSize: 14, fontWeight: 600 }}
                          />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={32} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Bar độ tuổi */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Thống kê theo độ tuổi</h2>
                    <p className="text-xs text-gray-500 mt-1">Biểu đồ cột các nhóm tuổi</p>
                  </div>
                </div>
                <div className="h-64">
                  {ageLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">Đang tải...</div>
                  ) : ageError ? (
                    <div className="h-full flex items-center justify-center text-red-500 text-sm">{ageError}</div>
                  ) : ageChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      Không có dữ liệu độ tuổi
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Dòng 2: Sinh theo thời gian + Tạm trú */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line sinh theo thời gian */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Thống kê sinh theo thời gian</h2>
                    <p className="text-xs text-gray-500 mt-1">Biểu đồ đường / area theo tháng</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-end text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Từ ngày</span>
                      <input
                        type="date"
                        value={birthFrom}
                        onChange={(e) => setBirthFrom(e.target.value)}
                        className="border border-blue-200 bg-blue-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Đến ngày</span>
                      <input
                        type="date"
                        value={birthTo}
                        onChange={(e) => setBirthTo(e.target.value)}
                        className="border border-blue-200 bg-blue-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <button
                      onClick={fetchBirthStats}
                      className="ml-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Lọc
                    </button>
                  </div>
                </div>
                <div className="h-64">
                  {birthLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">Đang tải...</div>
                  ) : birthError ? (
                    <div className="h-full flex items-center justify-center text-red-500 text-sm">{birthError}</div>
                  ) : birthChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      Không có dữ liệu sinh trong khoảng
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={birthChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          fill="#c7d2fe"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Tạm trú: Donut + Bar */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Thống kê tạm trú</h2>
                    <p className="text-xs text-gray-500 mt-1">Donut theo trạng thái + cột theo tháng</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-end text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Từ ngày</span>
                      <input
                        type="date"
                        value={tempResFrom}
                        onChange={(e) => setTempResFrom(e.target.value)}
                        className="border border-emerald-200 bg-emerald-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Đến ngày</span>
                      <input
                        type="date"
                        value={tempResTo}
                        onChange={(e) => setTempResTo(e.target.value)}
                        className="border border-emerald-200 bg-emerald-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <button
                      onClick={fetchTempResStats}
                      className="ml-1 px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Lọc
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                  {/* Donut trạng thái */}
                  <div className="h-full">
                    {tempResLoading ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">Đang tải...</div>
                    ) : tempResError ? (
                      <div className="h-full flex items-center justify-center text-red-500 text-xs">{tempResError}</div>
                    ) : tempResStatusData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        Không có dữ liệu trạng thái
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tempResStatusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="55%"
                            outerRadius="85%"
                            paddingAngle={3}
                          >
                            {tempResStatusData.map((_, index) => (
                              <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                            <Label
                              value={tempResStats?.tongSo != null ? `Tổng ${tempResStats.tongSo}` : ""}
                              position="center"
                              fill="#111827"
                              style={{ fontSize: 12, fontWeight: 600 }}
                            />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Bar theo thời gian */}
                  <div className="h-full">
                    {tempResLoading ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">Đang tải...</div>
                    ) : tempResError ? (
                      <div className="h-full flex items-center justify-center text-red-500 text-xs">{tempResError}</div>
                    ) : tempResTimeData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        Không có dữ liệu theo tháng
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tempResTimeData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dòng 3: Tạm vắng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Thống kê tạm vắng</h2>
                    <p className="text-xs text-gray-500 mt-1">Donut theo trạng thái + cột theo tháng</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-end text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Từ ngày</span>
                      <input
                        type="date"
                        value={tempAbsFrom}
                        onChange={(e) => setTempAbsFrom(e.target.value)}
                        className="border border-orange-200 bg-orange-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Đến ngày</span>
                      <input
                        type="date"
                        value={tempAbsTo}
                        onChange={(e) => setTempAbsTo(e.target.value)}
                        className="border border-orange-200 bg-orange-50 rounded px-2 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <button
                      onClick={fetchTempAbsStats}
                      className="ml-1 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Lọc
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                  {/* Donut trạng thái */}
                  <div className="h-full">
                    {tempAbsLoading ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">Đang tải...</div>
                    ) : tempAbsError ? (
                      <div className="h-full flex items-center justify-center text-red-500 text-xs">{tempAbsError}</div>
                    ) : tempAbsStatusData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        Không có dữ liệu trạng thái
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tempAbsStatusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="55%"
                            outerRadius="85%"
                            paddingAngle={3}
                          >
                            {tempAbsStatusData.map((_, index) => (
                              <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                            <Label
                              value={tempAbsStats?.tongSo != null ? `Tổng ${tempAbsStats.tongSo}` : ""}
                              position="center"
                              fill="#111827"
                              style={{ fontSize: 12, fontWeight: 600 }}
                            />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Bar theo thời gian */}
                  <div className="h-full">
                    {tempAbsLoading ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs">Đang tải...</div>
                    ) : tempAbsError ? (
                      <div className="h-full flex items-center justify-center text-red-500 text-xs">{tempAbsError}</div>
                    ) : tempAbsTimeData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        Không có dữ liệu theo tháng
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tempAbsTimeData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#fb923c" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}