import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, Users, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";

const API_BASE = "http://localhost:8080/api";

export default function SplitHousehold() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newHeadOfHousehold, setNewHeadOfHousehold] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMember, setWarningMember] = useState(null);

  const [formData, setFormData] = useState({
    diaChiMoi: "",
    maXaPhuong: "",
    ghiChu: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    // Giả sử có API lấy danh sách xã/phường, nếu không có thì có thể hardcode
    // fetchDistricts();
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;

    try {
      setLoadingSearch(true);
      const res = await fetch(`${API_BASE}/nhankhau/search-chu-ho?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
      alert("Không thể tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectHousehold = async (household) => {
    setSelectedHousehold(household);
    setLoadingMembers(true);
    try {
      const res = await fetch(`${API_BASE}/nhankhau/ho-khau/${household.soHoKhau}`);
      if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
      const data = await res.json();
      setHouseholdMembers(data || []);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách nhân khẩu. Vui lòng thử lại.");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleToggleMember = (member) => {
    // Kiểm tra nếu là chủ hộ
    const isChuHo = member.quanHeVoiChuHo?.toLowerCase().includes("chủ hộ") || 
                    member.quanHeVoiChuHo?.toLowerCase().includes("chu ho");

    if (isChuHo && !selectedMembers.find((m) => m.maNhanKhau === member.maNhanKhau)) {
      setWarningMember(member);
      setShowWarning(true);
      return;
    }

    if (selectedMembers.find((m) => m.maNhanKhau === member.maNhanKhau)) {
      setSelectedMembers(selectedMembers.filter((m) => m.maNhanKhau !== member.maNhanKhau));
      if (newHeadOfHousehold === member.maNhanKhau.toString()) {
        setNewHeadOfHousehold("");
      }
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleConfirmWarning = () => {
    if (warningMember) {
      setSelectedMembers([...selectedMembers, warningMember]);
      setShowWarning(false);
      setWarningMember(null);
    }
  };

  const handleCancelWarning = () => {
    setShowWarning(false);
    setWarningMember(null);
  };

  const handleNextToStep3 = () => {
    if (selectedMembers.length === 0) {
      alert("Vui lòng chọn ít nhất một nhân khẩu để tách hộ.");
      return;
    }
    setStep(3);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.diaChiMoi.trim()) errors.diaChiMoi = "Vui lòng nhập địa chỉ mới";
    if (!formData.maXaPhuong) errors.maXaPhuong = "Vui lòng chọn xã/phường";
    if (!newHeadOfHousehold) errors.newHeadOfHousehold = "Vui lòng chọn chủ hộ mới";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/nhankhau/tach-ho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soHoKhauGoc: selectedHousehold.soHoKhau,
          danhSachMaNhanKhau: selectedMembers.map((m) => m.maNhanKhau),
          diaChiMoi: formData.diaChiMoi,
          maXaPhuong: Number(formData.maXaPhuong),
          ghiChu: formData.ghiChu || "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API lỗi: ${res.status}`);
      }

      alert("Tách hộ thành công!");
      navigate("/households");
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRelationshipLabel = (relationship) => {
    const rel = relationship?.toLowerCase() || "";
    if (rel.includes("chủ hộ") || rel.includes("chu ho")) return "Chủ hộ";
    if (rel.includes("vợ") || rel.includes("vo")) return "Vợ";
    if (rel.includes("chồng") || rel.includes("chong")) return "Chồng";
    if (rel.includes("con")) return "Con";
    if (rel.includes("thanh vien") || rel.includes("thành viên")) return "Thành viên";
    return relationship || "—";
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
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Workflow</p>
                  <h1 className="text-3xl font-semibold text-white">Tách hộ</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Tách một số nhân khẩu từ hộ khẩu gốc để tạo hộ khẩu mới.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/households")}
                  className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= s
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-16 h-1 ${step > s ? "bg-blue-600" : "bg-gray-700"}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Tìm hộ khẩu gốc */}
              {step === 1 && (
                <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40">
                  <div className="flex items-center gap-3 mb-6">
                    <Search className="w-6 h-6 text-blue-300" />
                    <h2 className="text-2xl font-semibold text-white">Bước 1: Tìm hộ khẩu gốc</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm text-gray-300 block">
                      Tìm kiếm chủ hộ (theo Họ tên / CCCD / Mã hộ khẩu)
                      <div className="mt-2 flex items-center gap-2 rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          className="bg-transparent flex-1 focus:outline-none text-gray-100"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Nhập ít nhất 2 ký tự để tìm kiếm..."
                        />
                        {loadingSearch && (
                          <div className="text-gray-400 text-sm">Đang tìm...</div>
                        )}
                      </div>
                    </label>

                    {searchResults.length > 0 && (
                      <div className="bg-gray-800/50 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                          <h3 className="text-sm font-semibold text-gray-300">Kết quả tìm kiếm</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              onClick={() => handleSelectHousehold(result)}
                              className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-semibold">{result.hoTen}</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    CCCD: {result.cmnd} • HK: {result.soHoKhau}
                                  </p>
                                  {result.diaChi && (
                                    <p className="text-sm text-gray-400 mt-1">{result.diaChi}</p>
                                  )}
                                </div>
                                <Home className="w-5 h-5 text-blue-300" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Step 2: Hiển thị hộ khẩu và chọn nhân khẩu */}
              {step === 2 && (
                <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40 space-y-6">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6 text-blue-300" />
                    <h2 className="text-2xl font-semibold text-white">Bước 2: Chọn nhân khẩu tách hộ</h2>
                  </div>

                  {loadingMembers ? (
                    <div className="p-12 text-center text-gray-400">Đang tải danh sách nhân khẩu...</div>
                  ) : (
                    <>
                      {/* Thông tin hộ khẩu gốc */}
                      <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Thông tin hộ khẩu gốc</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Số hộ khẩu</p>
                            <p className="text-white font-semibold mt-1">{selectedHousehold?.soHoKhau}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Chủ hộ</p>
                            <p className="text-white font-semibold mt-1">{selectedHousehold?.hoTen}</p>
                          </div>
                          {selectedHousehold?.diaChi && (
                            <div className="col-span-2">
                              <p className="text-gray-400">Địa chỉ</p>
                              <p className="text-white font-semibold mt-1">{selectedHousehold.diaChi}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Danh sách nhân khẩu */}
                      <div className="bg-gray-800/50 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                          <h3 className="text-lg font-semibold text-white">Danh sách nhân khẩu trong hộ</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Chọn nhân khẩu muốn tách ra (không thể chọn tất cả)
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase">
                              <tr>
                                <th className="px-4 py-3 text-left">Chọn</th>
                                <th className="px-4 py-3 text-left">Họ tên</th>
                                <th className="px-4 py-3 text-left">Giới tính</th>
                                <th className="px-4 py-3 text-left">Ngày sinh</th>
                                <th className="px-4 py-3 text-left">Quan hệ với chủ hộ</th>
                                <th className="px-4 py-3 text-left">Nghề nghiệp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {householdMembers.map((member) => {
                                const isSelected = selectedMembers.find(
                                  (m) => m.maNhanKhau === member.maNhanKhau
                                );
                                const isChuHo =
                                  member.quanHeVoiChuHo?.toLowerCase().includes("chủ hộ") ||
                                  member.quanHeVoiChuHo?.toLowerCase().includes("chu ho");
                                return (
                                  <tr
                                    key={member.maNhanKhau}
                                    className={`border-b border-white/5 hover:bg-white/5 transition ${
                                      isSelected ? "bg-blue-500/20" : ""
                                    }`}
                                  >
                                    <td className="px-4 py-3">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleMember(member)}
                                        className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-500"
                                      />
                                    </td>
                                    <td className="px-4 py-3 text-white font-semibold">
                                      {member.hoTen}
                                      {isChuHo && (
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-200">
                                          Chủ hộ
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{member.gioiTinh}</td>
                                    <td className="px-4 py-3 text-gray-300">
                                      {member.ngaySinh
                                        ? new Date(member.ngaySinh).toLocaleDateString("vi-VN")
                                        : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">
                                      {getRelationshipLabel(member.quanHeVoiChuHo)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{member.ngheNghiep || "—"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            setStep(1);
                            setSelectedMembers([]);
                            setNewHeadOfHousehold("");
                          }}
                          className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={handleNextToStep3}
                          disabled={selectedMembers.length === 0}
                          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Tiếp theo
                        </button>
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Step 3: Nhập thông tin hộ mới */}
              {step === 3 && (
                <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-300" />
                      <h2 className="text-2xl font-semibold text-white">Bước 3: Nhập thông tin hộ khẩu mới</h2>
                    </div>

                    {/* Nhân khẩu sẽ tách */}
                    <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Nhân khẩu sẽ tách ra</h3>
                      <div className="space-y-2">
                        {selectedMembers.map((member) => (
                          <div
                            key={member.maNhanKhau}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span>{member.hoTen}</span>
                            {member.quanHeVoiChuHo?.toLowerCase().includes("chủ hộ") && (
                              <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-200">
                                Chủ hộ
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chọn chủ hộ mới */}
                    <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Chọn chủ hộ mới</h3>
                      <div className="space-y-2">
                        {selectedMembers.map((member) => (
                          <label
                            key={member.maNhanKhau}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="newHeadOfHousehold"
                              value={member.maNhanKhau}
                              checked={newHeadOfHousehold === member.maNhanKhau.toString()}
                              onChange={(e) => setNewHeadOfHousehold(e.target.value)}
                              className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 focus:ring-blue-500"
                            />
                            <span className="text-gray-300">{member.hoTen}</span>
                          </label>
                        ))}
                      </div>
                      {formErrors.newHeadOfHousehold && (
                        <span className="text-xs text-red-400 mt-2 block">
                          {formErrors.newHeadOfHousehold}
                        </span>
                      )}
                    </div>

                    {/* Thông tin hộ mới */}
                    <div className="space-y-4">
                      <label className="text-sm text-gray-300 block">
                        Địa chỉ mới *
                        <input
                          className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                            formErrors.diaChiMoi
                              ? "border-red-500"
                              : "border-gray-700 focus:border-blue-500"
                          }`}
                          value={formData.diaChiMoi}
                          onChange={(e) => {
                            setFormData({ ...formData, diaChiMoi: e.target.value });
                            setFormErrors({ ...formErrors, diaChiMoi: "" });
                          }}
                          placeholder="Nhập địa chỉ mới"
                        />
                        {formErrors.diaChiMoi && (
                          <span className="text-xs text-red-400">{formErrors.diaChiMoi}</span>
                        )}
                      </label>

                      <label className="text-sm text-gray-300 block">
                        Xã / Phường *
                        <select
                          className={`mt-2 w-full rounded-xl bg-gray-800/80 border px-3 py-2 focus:outline-none ${
                            formErrors.maXaPhuong
                              ? "border-red-500"
                              : "border-gray-700 focus:border-blue-500"
                          }`}
                          value={formData.maXaPhuong}
                          onChange={(e) => {
                            setFormData({ ...formData, maXaPhuong: e.target.value });
                            setFormErrors({ ...formErrors, maXaPhuong: "" });
                          }}
                        >
                          <option value="">Chọn xã/phường</option>
                          {/* Giả sử có danh sách xã/phường, nếu không có API thì có thể hardcode */}
                          <option value="1">Xã/Phường 1</option>
                          <option value="2">Xã/Phường 2</option>
                          <option value="3">Xã/Phường 3</option>
                        </select>
                        {formErrors.maXaPhuong && (
                          <span className="text-xs text-red-400">{formErrors.maXaPhuong}</span>
                        )}
                      </label>

                      <label className="text-sm text-gray-300 block">
                        Ghi chú
                        <textarea
                          className="mt-2 w-full rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                          rows={3}
                          value={formData.ghiChu}
                          onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                          placeholder="Ghi chú về việc tách hộ"
                        />
                      </label>
                    </div>

                    {/* Cảnh báo */}
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-300 mt-0.5" />
                        <div className="text-sm text-yellow-200">
                          <p className="font-semibold mb-1">Lưu ý:</p>
                          <p>Sau khi tách hộ:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Nhân khẩu được chọn sẽ rời khỏi hộ cũ</li>
                            <li>Hộ mới sẽ được tạo với chủ hộ mới đã chọn</li>
                            <li>Hộ cũ sẽ còn lại các nhân khẩu không được chọn</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium"
                      >
                        Quay lại
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-70"
                      >
                        {submitting ? "Đang xử lý..." : "Xác nhận tách hộ"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal cảnh báo khi chọn chủ hộ */}
      {showWarning && warningMember && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancelWarning} />
          <div className="relative w-full max-w-md bg-gray-950 border border-yellow-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Cảnh báo</h3>
                <p className="text-gray-300 mb-4">
                  Bạn đang tách chủ hộ. Hộ cũ sẽ không còn chủ hộ sau khi tách hộ.
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Nhân khẩu: <span className="font-semibold text-white">{warningMember.hoTen}</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmWarning}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded-xl font-medium"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={handleCancelWarning}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

