"use client";

import { useState } from "react";
import { BookingFormSection } from "@/components/BookingFormSection";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

interface TourBookingModalProps {
  slug: string;
  tourId: string;
  price: number;
  currency: string;
  duration: number;
  maxGuests: number;
}

export function TourBookingModal({
  slug,
  tourId,
  price,
  currency,
  duration,
  maxGuests,
}: TourBookingModalProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-3xl font-bold text-black">
          {price} {currency}
          <span className="text-base font-normal text-gray-600"> per person</span>
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {duration} hours
          </span>
          <span className="flex items-center gap-1">
            <PeopleIcon className="h-4 w-4" />
            Up to {maxGuests} guests
          </span>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Book Now
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="p-6 pt-12">
              <BookingFormSection
                slug={slug}
                tourId={tourId}
                maxGuests={maxGuests}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
