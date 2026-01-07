import Sidebar from "../components/Sidebar";
import Header from "../headers/Header";
import { BookOpenCheck, Headphones, HelpCircle, LifeBuoy, MessageSquare } from "lucide-react";

const faq = [
  {
    question: "Làm thế nào để đăng ký tạm trú mới?",
    answer:
      "Vào menu Dân cư Tạm trú, nhấn “Đăng ký tạm trú mới” và nhập đầy đủ thông tin cư dân. Hệ thống sẽ ghi nhận và gửi thông báo cho cán bộ phụ trách.",
  },
  {
    question: "Quên mật khẩu phải làm sao?",
    answer:
      "Sử dụng chức năng Quên mật khẩu tại màn hình đăng nhập, nhập email đã đăng ký. Nếu không nhận được email, liên hệ quản trị viên qua hotline.",
  },
  {
    question: "Dữ liệu có được sao lưu định kỳ?",
    answer:
      "Có. Bạn có thể cấu hình tần suất sao lưu trong mục Cài đặt hệ thống. Mặc định hệ thống sao lưu hàng ngày lúc 02:00.",
  },
];

const contactChannels = [
  { label: "Hotline trực hỗ trợ", value: "0243 888 9999", time: "08:00 - 21:00 mỗi ngày" },
  { label: "Email hỗ trợ kỹ thuật", value: "support@lakhé.gov.vn", time: "Phản hồi trong 4 giờ" },
  { label: "Zalo/Teams", value: "Phòng CNTT Phường La Khê", time: "Trong giờ hành chính" },
];

export default function Help() {
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
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Support center</p>
                  <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-blue-300" />
                    Trợ giúp & Hướng dẫn
                  </h1>
                  <p className="text-gray-300 mt-1 max-w-2xl">
                    Tài liệu sử dụng hệ thống, câu hỏi thường gặp và kênh liên hệ hỗ trợ dành cho cán bộ phường La Khê.
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/30">
                  <LifeBuoy className="w-5 h-5" />
                  Gửi yêu cầu hỗ trợ
                </button>
              </header>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Hướng dẫn sử dụng",
                    description: "Video + checklist thao tác chuẩn cho từng nghiệp vụ.",
                    icon: BookOpenCheck,
                  },
                  {
                    title: "FAQ & Best practices",
                    description: "Tổng hợp tình huống thường gặp và cách xử lý.",
                    icon: MessageSquare,
                  },
                  {
                    title: "Trung tâm hỗ trợ",
                    description: "Đội CNTT trực 24/7: hotline, email, chat.",
                    icon: Headphones,
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 shadow-xl">
                      <Icon className="w-8 h-8 text-blue-300 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-300">{card.description}</p>
                    </div>
                  );
                })}
              </section>

              <section className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6">Hướng dẫn nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      title: "1. Đăng nhập an toàn",
                      steps: ["Sử dụng tài khoản được cấp", "Bật 2FA với thiết bị tin cậy", "Không chia sẻ mật khẩu"],
                    },
                    {
                      title: "2. Quản lý dân cư",
                      steps: ["Vào Dashboard → chọn module", "Dùng bộ lọc nâng cao", "Xuất báo cáo PDF/Excel nếu cần"],
                    },
                    {
                      title: "3. Báo cáo sự cố",
                      steps: ["Click nút Trợ giúp", "Mô tả chi tiết lỗi, ảnh chụp màn hình", "Gửi cho đội kỹ thuật"],
                    },
                  ].map((guide) => (
                    <div key={guide.title} className="rounded-2xl border border-gray-800 bg-gray-800/40 p-4">
                      <p className="text-sm font-semibold text-blue-200 mb-2">{guide.title}</p>
                      <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                        {guide.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-white">FAQ</h2>
                  {faq.map((item) => (
                    <details key={item.question} className="rounded-2xl bg-gray-800/50 p-4 border border-gray-800">
                      <summary className="cursor-pointer text-sm font-semibold text-white flex justify-between items-center">
                        {item.question}
                        <span className="text-blue-300 text-xs ml-2">Chi tiết</span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-300">{item.answer}</p>
                    </details>
                  ))}
                </div>

                <div className="bg-gray-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-white">Liên hệ hỗ trợ</h2>
                  <div className="space-y-4 text-sm text-gray-300">
                    {contactChannels.map((channel) => (
                      <div key={channel.label} className="rounded-2xl bg-gray-800/40 border border-gray-800 p-4">
                        <p className="text-gray-400 uppercase text-xs tracking-wide">{channel.label}</p>
                        <p className="text-lg font-semibold text-white mt-1">{channel.value}</p>
                        <p className="text-xs text-gray-500">{channel.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                    Nếu cần hỗ trợ khẩn cấp, gọi trực tiếp hotline. Đội kỹ thuật có mặt trong vòng 15 phút qua Remote Desktop hoặc onsite.
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





