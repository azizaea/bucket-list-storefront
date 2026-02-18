"use client";

import { useState } from "react";

interface TourBookingWidgetProps {
  title: string;
  price: number;
  currency: string;
  maxGuests: number;
}

export function TourBookingWidget({
  title,
  price,
  currency,
  maxGuests,
}: TourBookingWidgetProps) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);

  const total = guests * price;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-black">
        {price} {currency}
        <span className="text-sm font-normal text-gray-600"> per person</span>
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="tour-date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="tour-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
          />
        </div>

        <div>
          <label
            htmlFor="tour-guests"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Guests
          </label>
          <input
            id="tour-guests"
            type="number"
            min={1}
            max={maxGuests}
            value={guests}
            onChange={(e) =>
              setGuests(Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-black">
              {total} {currency}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          Request to Book
        </button>

        <button
          type="button"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-black transition-colors hover:bg-gray-50"
        >
          Contact Guide
        </button>
      </div>
    </div>
  );
}
