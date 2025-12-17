// Dữ liệu mẫu cho module Thu-Chi
export const feeRate = 6000; // VNĐ/tháng/nhân khẩu

export const sanitationFeeRecords = [
  {
    id: "SF-001",
    householdId: "HK-001",
    headName: "Nguyễn Văn An",
    address: "12/34 Văn Khê, La Khê",
    area: 1,
    members: 4,
    year: 2024,
    requiredAmount: 288000, // 6000 * 12 * 4
    paidAmount: 288000,
    status: "paid", // paid, partial, unpaid
    payments: [
      { date: "2024-01-15", amount: 288000, collector: "Nguyễn Thị D" }
    ]
  },
  {
    id: "SF-002",
    householdId: "HK-002",
    headName: "Trần Thị Bình",
    address: "45/67 Lê Văn Lương",
    area: 2,
    members: 5,
    year: 2024,
    requiredAmount: 360000,
    paidAmount: 200000,
    status: "partial",
    payments: [
      { date: "2024-02-10", amount: 200000, collector: "Nguyễn Thị D" }
    ]
  },
  {
    id: "SF-003",
    householdId: "HK-003",
    headName: "Lê Văn Cường",
    address: "78/90 Quang Trung",
    area: 3,
    members: 3,
    year: 2024,
    requiredAmount: 216000,
    paidAmount: 0,
    status: "unpaid",
    payments: []
  }
];

export const donationCampaigns = [
  {
    id: "DN-001",
    name: "Ủng hộ đồng bào bão lụt miền Trung",
    description: "Đợt quyên góp hỗ trợ đồng bào bị thiệt hại do bão lụt",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    status: "active", // active, upcoming, closed
    targetAmount: 50000000,
    totalCollected: 42500000,
    householdsCount: 400,
    participatingCount: 280,
    donations: [
      { householdId: "HK-001", headName: "Nguyễn Văn An", amount: 200000, date: "2024-10-05" },
      { householdId: "HK-002", headName: "Trần Thị Bình", amount: 150000, date: "2024-10-10" }
    ]
  },
  {
    id: "DN-002",
    name: "Tết Thiếu nhi 2025",
    description: "Quyên góp quà Tết cho trẻ em có hoàn cảnh khó khăn",
    startDate: "2025-05-15",
    endDate: "2025-06-15",
    status: "upcoming",
    targetAmount: null,
    totalCollected: 0,
    householdsCount: 400,
    participatingCount: 0,
    donations: []
  },
  {
    id: "DN-003",
    name: "Ủng hộ Thương binh Liệt sỹ 27/07",
    description: "Đợt quyên góp nhân ngày Thương binh Liệt sỹ",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    status: "closed",
    targetAmount: null,
    totalCollected: 38200000,
    householdsCount: 400,
    participatingCount: 320,
    donations: []
  }
];

