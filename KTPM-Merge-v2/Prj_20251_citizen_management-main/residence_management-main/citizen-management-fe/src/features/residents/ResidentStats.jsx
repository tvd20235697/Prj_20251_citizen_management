const cards = [
  { key: "total", label: "Tổng nhân khẩu", desc: "Tổng hợp toàn phường" },
  { key: "tam-tru", label: "Tạm trú", desc: "Đang lưu trú ngắn hạn" },
  { key: "kinh-doanh", label: "Kinh doanh", desc: "Hộ kinh doanh đăng ký" },
];

export default function ResidentStats({ residents }) {
  const counts = {
    total: residents.length,
    "tam-tru": residents.filter((r) => r.residenceType === "tam-tru").length,
    "kinh-doanh": residents.filter((r) => r.residenceType === "kinh-doanh").length,
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/30">
          <p className="text-sm text-gray-400 uppercase tracking-wide">{card.label}</p>
          <p className="text-3xl font-bold text-white mt-2">{counts[card.key]}</p>
          <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
        </div>
      ))}
    </section>
  );
}

