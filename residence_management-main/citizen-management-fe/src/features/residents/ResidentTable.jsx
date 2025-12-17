import { Pencil, Trash2 } from "lucide-react";

export default function ResidentTable({
  residents,
  residenceTypeMap,
  onView,
  onEdit,
  onDelete,
  loading,
  error,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400 uppercase">
          <tr>
            <th className="px-6 py-4 text-left">Họ tên</th>
            <th className="px-6 py-4 text-left">Năm sinh</th>
            <th className="px-6 py-4 text-left">CCCD</th>
            <th className="px-6 py-4 text-left">Hộ khẩu</th>
            <th className="px-6 py-4 text-left">Loại cư trú</th>
            <th className="px-6 py-4 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-red-300">
                {error}
              </td>
            </tr>
          ) : residents.length ? (
            residents.map((resident) => {
              const typeBadge = residenceTypeMap[resident.residenceType] || residenceTypeMap["thuong-tru"];
              return (
                <tr key={resident.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-semibold">{resident.name}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(resident.birthDate).toLocaleDateString("vi-VN")}</td>
                  <td className="px-6 py-4 text-gray-300">{resident.cccd}</td>
                  <td className="px-6 py-4 text-gray-300">{resident.household}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${typeBadge.className}`}>
                      {typeBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/30"
                        onClick={() => onView(resident)}
                      >
                        Xem
                      </button>
                      <button
                        className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-200 border border-yellow-400/30"
                        onClick={() => onEdit(resident)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-400/30"
                        onClick={() => onDelete(resident)}
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
                Không có nhân khẩu phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

