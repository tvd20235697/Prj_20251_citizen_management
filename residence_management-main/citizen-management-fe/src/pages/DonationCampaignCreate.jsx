import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

export default function DonationCampaignCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAmount: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên đợt";
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newCampaign = {
      id: `DN-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: new Date(formData.startDate) > new Date() ? "upcoming" : "active",
      targetAmount: formData.targetAmount ? Number(formData.targetAmount) : null,
      totalCollected: 0,
      householdsCount: 400,
      participatingCount: 0,
      donations: [],
    };

    alert(`Đã tạo đợt đóng góp "${formData.name}" thành công (mô phỏng).`);
    navigate("/donations/campaigns");
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
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/donations/campaigns")} className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module Thu-Chi</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                    Tạo Đợt Đóng Góp Mới
                  </h1>
                </div>
              </div>

              <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
                <label className="block text-sm text-gray-300">
                  Tên đợt *
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='VD: "Ủng hộ đồng bào bão lụt"'
                    className={`mt-2 w-full rounded-xl bg-gray-800/80 border ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    } px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500`}
                  />
                  {errors.name && <span className="text-xs text-red-400 mt-1 block">{errors.name}</span>}
                </label>

                <label className="block text-sm text-gray-300">
                  Mô tả
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả chi tiết về đợt đóng góp..."
                    className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm text-gray-300">
                    Từ ngày *
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-xl bg-gray-800/80 border ${
                        errors.startDate ? "border-red-500" : "border-gray-700"
                      } px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500`}
                    />
                    {errors.startDate && <span className="text-xs text-red-400 mt-1 block">{errors.startDate}</span>}
                  </label>

                  <label className="block text-sm text-gray-300">
                    Đến ngày *
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-xl bg-gray-800/80 border ${
                        errors.endDate ? "border-red-500" : "border-gray-700"
                      } px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500`}
                    />
                    {errors.endDate && <span className="text-xs text-red-400 mt-1 block">{errors.endDate}</span>}
                  </label>
                </div>

                <label className="block text-sm text-gray-300">
                  Mục tiêu (tùy chọn)
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="Nhập số tiền mục tiêu..."
                      className="flex-1 rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400 whitespace-nowrap">VNĐ</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">(Để trống nếu không có mục tiêu)</p>
                </label>

                <label className="block text-sm text-gray-300">
                  Ghi chú
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ghi chú thêm (nếu có)..."
                    className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Tạo đợt
                  </button>
                  <button
                    onClick={() => navigate("/donations/campaigns")}
                    className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

