import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { Cog, Globe, MonitorSmartphone, Palette, ShieldCheck, SlidersHorizontal } from "lucide-react";

const defaultSettings = {
  rowsPerPage: "25",
  dateFormat: "DD/MM/YYYY",
  theme: "dark",
  language: "vi",
  timeZone: "Asia/Ho_Chi_Minh",
  autoBackup: "daily",
  enableNotifications: true,
  emailDigest: true,
  enableTwoFactor: false,
  errorReporting: true,
};

const rowsOptions = ["10", "25", "50", "100"];
const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const themes = [
  { value: "light", label: "Light mode" },
  { value: "dark", label: "Dark mode" },
  { value: "system", label: "Theo hệ thống" },
];
const languages = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];
const timeZones = [
  { value: "Asia/Ho_Chi_Minh", label: "GMT+7 - Việt Nam" },
  { value: "Asia/Singapore", label: "GMT+8 - Singapore" },
  { value: "UTC", label: "UTC" },
];

export default function SystemSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  const summary = useMemo(
    () => [
      {
        label: "Số dòng mặc định",
        value: `${settings.rowsPerPage} bản ghi`,
        icon: SlidersHorizontal,
      },
      {
        label: "Định dạng ngày",
        value: settings.dateFormat,
        icon: CalendarIcon,
      },
      {
        label: "Theme hiện tại",
        value: themes.find((t) => t.value === settings.theme)?.label,
        icon: Palette,
      },
      {
        label: "Ngôn ngữ",
        value: languages.find((l) => l.value === settings.language)?.label,
        icon: Globe,
      },
    ],
    [settings]
  );

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setLastSaved(new Date().toLocaleString("vi-VN"));
      setSaving(false);
      alert("Cấu hình hệ thống đã được lưu (mô phỏng).");
    }, 800);
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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Admin settings</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <Cog className="w-8 h-8 text-blue-300" />
                    Cài đặt hệ thống
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Tùy chỉnh trải nghiệm vận hành: hiển thị dữ liệu, chuẩn ngày tháng, theme, ngôn ngữ và các chính sách bảo mật.
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/30"
                  disabled={saving}
                >
                  <ShieldCheck className="w-5 h-5" />
                  {saving ? "Đang lưu..." : "Lưu cài đặt"}
                </button>
              </div>

              {lastSaved && (
                <div className="text-sm text-green-300">
                  Lần lưu gần nhất: {lastSaved}
                </div>
              )}

              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-gray-900/80 border border-white/5 rounded-2xl p-5">
                      <Icon className="w-6 h-6 text-blue-300 mb-3" />
                      <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
                      <p className="text-xl font-semibold text-white mt-2">{item.value}</p>
                    </div>
                  );
                })}
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-300" />
                    Hiển thị & Định dạng
                  </h2>
                  <div className="space-y-4">
                    <label className="block text-sm text-gray-300">
                      Số dòng hiển thị mặc định / trang
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={settings.rowsPerPage}
                        onChange={(e) => handleChange("rowsPerPage", e.target.value)}
                      >
                        {rowsOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} dòng
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm text-gray-300">
                      Định dạng ngày tháng
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={settings.dateFormat}
                        onChange={(e) => handleChange("dateFormat", e.target.value)}
                      >
                        {dateFormats.map((format) => (
                          <option key={format} value={format}>
                            {format}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm text-gray-300">
                      Múi giờ hiển thị dữ liệu
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={settings.timeZone}
                        onChange={(e) => handleChange("timeZone", e.target.value)}
                      >
                        {timeZones.map((zone) => (
                          <option key={zone.value} value={zone.value}>
                            {zone.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-300" />
                    Theme & Ngôn ngữ
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-300">
                      Theme
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={settings.theme}
                        onChange={(e) => handleChange("theme", e.target.value)}
                      >
                        {themes.map((theme) => (
                          <option key={theme.value} value={theme.value}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-300">
                      Ngôn ngữ
                      <select
                        className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={settings.language}
                        onChange={(e) => handleChange("language", e.target.value)}
                      >
                        {languages.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-gray-800/40 p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-200">Trải nghiệm giao diện</p>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={settings.enableNotifications}
                        onChange={(e) => handleChange("enableNotifications", e.target.checked)}
                      />
                      Hiển thị thông báo desktop
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={settings.emailDigest}
                        onChange={(e) => handleChange("emailDigest", e.target.checked)}
                      />
                      Nhận email tổng hợp hàng tuần
                    </label>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <MonitorSmartphone className="w-5 h-5 text-blue-300" />
                    Bảo mật & Phiên đăng nhập
                  </h2>
                  <div className="space-y-4 text-sm text-gray-300">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.enableTwoFactor}
                        onChange={(e) => handleChange("enableTwoFactor", e.target.checked)}
                      />
                      Bật xác thực hai lớp (2FA) cho Admin
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.errorReporting}
                        onChange={(e) => handleChange("errorReporting", e.target.checked)}
                      />
                      Gửi báo cáo lỗi tự động cho đội kỹ thuật
                    </label>
                    <p className="text-xs text-gray-400">
                      Khuyến nghị bật 2FA cho tài khoản nhạy cảm và đảm bảo phiên tự động đăng xuất sau 30 phút không hoạt động.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-300" />
                    Sao lưu & cảnh báo
                  </h2>
                  <label className="block text-sm text-gray-300">
                    Tần suất sao lưu dữ liệu
                    <select
                      className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={settings.autoBackup}
                      onChange={(e) => handleChange("autoBackup", e.target.value)}
                    >
                      <option value="daily">Hàng ngày (02:00)</option>
                      <option value="weekly">Hàng tuần (Chủ nhật)</option>
                      <option value="manual">Thủ công</option>
                    </select>
                  </label>
                  <div className="rounded-2xl border border-gray-800 bg-gray-800/40 p-4 space-y-3 text-sm text-gray-300">
                    <p className="font-semibold text-white">Gợi ý thêm</p>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      <li>Tự động gửi thông báo khi còn 10% dung lượng máy chủ</li>
                      <li>Lưu lịch sử cấu hình để khôi phục khi cần</li>
                      <li>Đồng bộ với trung tâm giám sát IT</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-blue-300"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}





