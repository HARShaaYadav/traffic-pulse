"use client";

import { useEffect, useState, useRef } from "react";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function NotificationListener() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Generate unique client ID if not exists
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("trafficpulse_client_id")
    ) {
      localStorage.setItem(
        "trafficpulse_client_id",
        `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      );
    }
  }, []);

  const playSound = (priority: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      let src = "/low.mp3";
      let loop = false;

      if (priority === "critical") {
        // Critical -> High
        src = "/high.mp3";
        loop = true;
      } else if (priority === "high") {
        // High -> Medium
        src = "/medium.mp3";
        loop = true;
      } else {
        src = "/low.mp3";
        loop = false;
      }

      const audio = new Audio(src);
      audio.loop = loop;
      audioRef.current = audio;

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Audio play error:", e));

      audio.onended = () => setIsPlaying(false);
    } catch (e) {
      console.error("Error setting up audio:", e);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;

        // Filter out if I am the sender
        const myId = localStorage.getItem("trafficpulse_client_id");
        if (data.senderId && data.senderId === myId) {
          return;
        }

        // Ensure unique ID
        const notification = {
          ...data,
          id: data.id || Date.now(),
          timestamp: new Date(),
        };

        setNotifications((prev) => [notification, ...prev]);

        // Play sound
        playSound(notification.priority);

        // Auto dismiss ONLY if not critical/high (which loop/persist)
        // Actually, user said "button when user click then only stop it".
        // So for looped sounds, we DO NOT auto dismiss.
        if (
          notification.priority !== "critical" &&
          notification.priority !== "high"
        ) {
          setTimeout(() => {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id),
            );
          }, 8000); // 8 seconds for others
        }
      } catch (e) {
        console.error("Error parsing notification:", e);
      }
    };

    eventSource.onerror = (e) => {
      console.error("EventSource error:", e);
      // Don't close immediately on error, it might be temporary, or browser refreshing connection
      // But standard EventSource reconnects automatically.
      // If we close, it won't reconnect.
      // eventSource.close();
    };

    return () => {
      eventSource.close();
      stopAudio();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto flex flex-col gap-2 p-4 rounded-xl shadow-2xl backdrop-blur-xl border animate-slide-in-right transform transition-all duration-300 max-w-sm ${
            notification.priority === "critical"
              ? "bg-red-500/10 border-red-500/50 text-red-100 shadow-red-500/20"
              : notification.priority === "high"
                ? "bg-orange-500/10 border-orange-500/50 text-orange-100 shadow-orange-500/20"
                : "bg-violet-500/10 border-violet-500/50 text-violet-100 shadow-violet-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                notification.priority === "critical"
                  ? "bg-red-500/20 animate-pulse"
                  : notification.priority === "high"
                    ? "bg-orange-500/20"
                    : "bg-violet-500/20"
              }`}
            >
              {notification.priority === "critical" ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider opacity-80 flex items-center justify-between">
                <span>
                  {notification.type === "sms"
                    ? "SMS Dispatch"
                    : notification.type === "push"
                      ? "App Notification"
                      : "System Alert"}
                </span>
                <span className="text-[10px] font-mono border border-current px-1 rounded opacity-60">
                  {notification.priority}
                </span>
              </h4>
              <p className="text-sm font-medium leading-relaxed">
                {notification.message}
              </p>
              {notification.recipients > 0 && (
                <p className="text-xs mt-2 opacity-60 font-mono">
                  Target: {notification.recipients} recipients
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id),
                );
                // If this was the playing audio notification, stop it.
                // Or if any critical alert is dismissed, checking if others are playing?
                // Simplify: Stop audio when ANY explicit dismiss happens, assuming user wants quiet.
                stopAudio();
              }}
              className="p-1 hover:bg-white/10 rounded-lg transition self-start"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Footer for High/Critical */}
          {(notification.priority === "critical" ||
            notification.priority === "high") && (
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => {
                  stopAudio();
                  // Optionally keep notification but stop sound.
                }}
                className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition px-2 py-1 rounded hover:bg-white/5"
              >
                <VolumeX className="w-3 h-3" /> Stop Sound
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
