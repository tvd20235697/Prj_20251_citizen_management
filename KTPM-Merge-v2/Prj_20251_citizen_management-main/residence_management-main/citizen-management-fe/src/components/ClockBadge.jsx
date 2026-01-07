import { useEffect, useState } from "react";

export default function ClockBadge() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
      };
      setTime(now.toLocaleString("vi-VN", options));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
      px-6 py-2 
      bg-linear-to-br from-white-600 to-blue-600 
      text-white 
      font-semibold 
      rounded-b-3xl 
      shadow-lg 
      border border-white/20
      backdrop-blur-md
      text-sm
      mx-4
    "
    >
      {time}
    </div>
  );
}
