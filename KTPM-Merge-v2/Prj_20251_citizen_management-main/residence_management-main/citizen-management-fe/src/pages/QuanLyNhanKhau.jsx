import { useEffect, useMemo, useState, useCallback } from "react";
import { Filter, MapPin, UserPlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import ResidentStats from "../features/residents/ResidentStats";
import ResidentFilters from "../features/residents/ResidentFilters";
import ResidentTable from "../features/residents/ResidentTable";
import ResidentDetailDrawer from "../features/residents/ResidentDetailDrawer";
import AdminResidentEditModal from "../features/residents/AdminResidentEditModal";
import { fetchResidentsApi, deleteResidentApi } from "../features/residents/api";

const perPageOptions = [5, 10, 20];
const residenceTypeMap = {
  "thuong-tru": { label: "Thường trú", className: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40" },
  "tam-tru": { label: "Tạm trú", className: "bg-amber-500/10 text-amber-200 border border-amber-500/40" },
  "kinh-doanh": { label: "Kinh doanh", className: "bg-blue-500/10 text-blue-200 border border-blue-500/40" },
};

export default function QuanLyNhanKhau() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [residenceType, setResidenceType] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [editingResident, setEditingResident] = useState(null);
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchResidentsApi();
      setResidents(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách nhân khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const filtered = useMemo(() => {
    return residents.filter((resident) => {
      const matchesSearch =
        resident.name.toLowerCase().includes(search.toLowerCase()) ||
        resident.cccd.toLowerCase().includes(search.toLowerCase());
      const matchesGender = gender === "all" ? true : resident.gender === gender;
      const matchesType = residenceType === "all" ? true : resident.residenceType === residenceType;
      return matchesSearch && matchesGender && matchesType;
    });
  }, [search, gender, residenceType, residents]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const viewResident = (resident) => {
    setSelected(resident);
  };

  const deleteResident = async (resident) => {
    const maNhanKhau = resident.maNhanKhau || resident.id;
    
    if (!maNhanKhau) {
      alert("Không tìm thấy mã nhân khẩu để xóa.");
      return;
    }
    
    const maNhanKhauNum = typeof maNhanKhau === "string" ? parseInt(maNhanKhau, 10) : maNhanKhau;
    if (isNaN(maNhanKhauNum) || maNhanKhauNum <= 0) {
      alert("Mã nhân khẩu không hợp lệ.");
      return;
    }

    const residentName = resident.name || resident.hoTen || "nhân khẩu này";
    const confirmMessage = `Bạn có chắc chắn muốn xóa nhân khẩu "${residentName}"?\n\nHành động này không thể hoàn tác.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteResidentApi(maNhanKhauNum);
      alert("Xóa nhân khẩu thành công!");
      fetchResidents();
    } catch (error) {
      alert("Lỗi khi xóa nhân khẩu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (resident) => {
    // Sử dụng AdminResidentEditModal thay vì ResidentEditModal
    setEditingResident(resident);
    setIsAdminEditOpen(true);
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
      <div className="flex h-screen w-screen relative z-10 bg-black/30 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-6 md:p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Module</p>
                  <h1 className="text-3xl font-semibold text-white">Danh sách nhân khẩu</h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Giám sát tình hình cư trú theo từng hộ, hỗ trợ thao tác nhanh xem/sửa/xóa thông tin nhân khẩu.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => (window.location.href = "/residents/search")}
                    className="px-5 py-3 rounded-xl bg-gray-800 text-gray-200 border border-white/10 hover:bg-gray-700"
                  >
                    Tìm kiếm nâng cao
                  </button>
                  <button
                    onClick={() => (window.location.href = "/residents/add")}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Thêm nhân khẩu
                  </button>
                </div>
              </div>

              <ResidentStats residents={residents} />

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl shadow-2xl shadow-black/40">
                <ResidentFilters
                  search={search}
                  onSearch={setSearch}
                  gender={gender}
                  onGender={setGender}
                  residenceType={residenceType}
                  onResidenceType={setResidenceType}
                  perPage={perPage}
                  onPerPage={(value) => {
                    setPerPage(value);
                    setPage(1);
                  }}
                  perPageOptions={perPageOptions}
                />

                <ResidentTable
                  residents={paginated}
                  residenceTypeMap={residenceTypeMap}
                  onView={viewResident}
                  onEdit={openEdit}
                  onDelete={deleteResident}
                  loading={loading}
                  error={error}
                />

                <div className="px-6 py-4 flex flex-wrap items-center justify-between text-sm text-gray-400 border-t border-white/5 gap-3">
                  <p>
                    Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} / {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded bg-gray-800 text-gray-200 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span>
                      Trang {page}/{totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 rounded bg-gray-800 text-gray-200 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <ResidentDetailDrawer 
        resident={selected} 
        onClose={() => setSelected(null)}
        onEdit={(resident) => {
          setEditingResident(resident);
          setIsAdminEditOpen(true);
          setSelected(null);
        }}
      />
      
      <AdminResidentEditModal
        resident={editingResident}
        isOpen={isAdminEditOpen}
        onClose={() => {
          setIsAdminEditOpen(false);
          setEditingResident(null);
        }}
        onUpdate={() => {
          fetchResidents();
          setIsAdminEditOpen(false);
          setEditingResident(null);
        }}
      />
    </div>
  );
}




