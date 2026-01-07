import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(false);

  return (
    <button
      className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      aria-label="Thông báo"
    >
      <Bell className="w-5 h-5 text-gray-600" />
      {hasNotifications && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}






