"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to SY 2025-2026",
    excerpt: "We are excited to announce the start of a new school year! Get ready for exciting events and opportunities.",
    date: "2026-04-01",
  },
  {
    id: "2",
    title: "General Assembly Schedule",
    excerpt: "The general assembly will be held on April 15, 2026 at the main auditorium. All students are encouraged to attend.",
    date: "2026-03-28",
  },
  {
    id: "3",
    title: "Council Election Results",
    excerpt: "Congratulations to all the newly elected officers for the academic year 2025-2026. View the full results here.",
    date: "2026-03-20",
  },
  {
    id: "4",
    title: "Upcoming Charity Drive",
    excerpt: "Join us in our annual charity drive happening next month. Your contributions make a difference.",
    date: "2026-03-15",
  },
  {
    id: "5",
    title: "New Portal Features",
    excerpt: "Check out our updated portal with new features for better student engagement and communication.",
    date: "2026-03-10",
  },
];

export default function AnnouncementsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockAnnouncements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    goToSlide((currentIndex - 1 + mockAnnouncements.length) % mockAnnouncements.length);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % mockAnnouncements.length);
  };

  const current = mockAnnouncements[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#2D7D32] to-[#1B5E20] p-8 text-white">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-white/70">
          Announcement
        </span>
        <h2 className="text-2xl font-bold">{current.title}</h2>
        <p className="max-w-xl text-white/90">{current.excerpt}</p>
        <span className="text-sm text-white/60">{current.date}</span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {mockAnnouncements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToPrev}
            className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}