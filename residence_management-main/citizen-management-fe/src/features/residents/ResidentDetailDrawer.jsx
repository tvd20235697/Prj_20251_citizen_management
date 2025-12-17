import { Users as UsersIcon } from "lucide-react";

const residenceTypeMap = {
  "thuong-tru": { label: "Thường trú" },
  "tam-tru": { label: "Tạm trú" },
  "kinh-doanh": { label: "Kinh doanh" },
};

export default function ResidentDetailDrawer({ resident, onClose }) {
  if (!resident) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-950 border-l border-white/10 h-full overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Thông tin chi tiết</p>
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-blue-300" />
              {resident.name}
            </h3>
            <p className="text-xs text-gray-400">
              {resident.id} • {resident.cccd}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>
        <div className="space-y-4 text-sm">
          {[
            { label: "Ngày sinh", value: new Date(resident.birthDate).toLocaleDateString("vi-VN") },
            { label: "Nơi sinh", value: resident.birthPlace || "—" },
            { label: "Giới tính", value: resident.gender },
            { label: "Hộ khẩu", value: resident.household },
            { label: "Loại cư trú", value: residenceTypeMap[resident.residenceType]?.label || "—" },
            { label: "Nghề nghiệp", value: resident.occupation },
            { label: "Nơi làm việc", value: resident.workplace || "—" },
            { label: "Số điện thoại", value: resident.phone || "—" },
            { label: "Ngày cấp CCCD", value: resident.issueDate ? new Date(resident.issueDate).toLocaleDateString("vi-VN") : "—" },
            { label: "Nơi cấp CCCD", value: resident.issuePlace || "—" },
          ].map((row) => (
            <div key={row.label} className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase text-gray-400">{row.label}</p>
              <p className="text-white font-semibold mt-1">{row.value}</p>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl">Chỉnh sửa nhân khẩu</button>
      </div>
    </div>
  );
}

