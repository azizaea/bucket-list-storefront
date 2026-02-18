"use client";

import { useState } from "react";

export function TourItineraryClient({
  days,
}: {
  days: { day: number; title: string; description: string }[];
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {days.map((d) => (
        <div
          key={d.day}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          <button
            type="button"
            onClick={() => setExpanded(expanded === d.day ? null : d.day)}
            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
          >
            <span className="font-medium text-black">
              Day {d.day}: {d.title}
            </span>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expanded === d.day ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expanded === d.day && (
            <div className="border-t border-gray-200 px-4 py-3">
              <p className="text-gray-600">{d.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
