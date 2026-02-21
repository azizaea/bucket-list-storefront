"use client";

import { useState } from "react";

interface BookingFormSectionProps {
  slug: string;
  tourId: string;
  maxGuests: number;
}

export function BookingFormSection({
  slug,
  tourId,
  maxGuests,
}: BookingFormSectionProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tourDate: "",
    guests: 1,
    isInternational: false,
    nationality: "",
    passportNumber: "",
    countryOfResidence: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    foodAllergies: "",
    medicalConditions: "",
  });

  const update = (key: keyof typeof formData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const minDate = new Date().toISOString().split("T")[0];

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone is required";
    if (!formData.tourDate) return "Tour date is required";
    if (formData.guests < 1 || formData.guests > maxGuests)
      return `Guests must be between 1 and ${maxGuests}`;
    if (formData.isInternational) {
      if (!formData.nationality.trim()) return "Nationality is required";
      if (!formData.passportNumber.trim()) return "Passport number is required";
      if (!formData.countryOfResidence.trim())
        return "Country of residence is required";
      if (!formData.emergencyContactName.trim())
        return "Emergency contact name is required";
      if (!formData.emergencyContactPhone.trim())
        return "Emergency contact phone is required";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setStep(2);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        tourDate: formData.tourDate,
        guests: formData.guests,
        isInternationalTraveler: formData.isInternational,
        ...(formData.isInternational && {
          nationality: formData.nationality,
          passportNumber: formData.passportNumber,
          countryOfResidence: formData.countryOfResidence,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
        }),
        foodAllergies: formData.foodAllergies || undefined,
        medicalConditions: formData.medicalConditions || undefined,
      };

      const res = await fetch(
        `https://api.bucketlist.sa/api/guide-stores/public/${slug}/tours/${tourId}/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-800">
          Your booking request has been sent! The guide will contact you within
          24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
      <h3 className="mb-6 text-xl font-bold text-black">
        Request to Book {step === 1 ? "— Basic Info" : "— Safety Info"}
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name <span className="text-gray-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-gray-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone <span className="text-gray-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tour Date <span className="text-gray-500">*</span>
            </label>
            <input
              type="date"
              value={formData.tourDate}
              onChange={(e) => update("tourDate", e.target.value)}
              min={minDate}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Number of Guests <span className="text-gray-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={maxGuests}
              value={formData.guests}
              onChange={(e) =>
                update("guests", Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1)))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Are you an international traveler?
            </label>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="international"
                  checked={formData.isInternational === true}
                  onChange={() => update("isInternational", true)}
                  className="h-4 w-4 border-gray-300"
                />
                <span className="text-gray-800">Yes</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="international"
                  checked={formData.isInternational === false}
                  onChange={() => update("isInternational", false)}
                  className="h-4 w-4 border-gray-300"
                />
                <span className="text-gray-800">No</span>
              </label>
            </div>
          </div>

          {formData.isInternational && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nationality <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => update("nationality", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Passport Number <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => update("passportNumber", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Country of Residence <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.countryOfResidence}
                  onChange={(e) => update("countryOfResidence", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Emergency Contact Name <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => update("emergencyContactName", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Emergency Contact Phone <span className="text-gray-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => update("emergencyContactPhone", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Food Allergies
            </label>
            <textarea
              value={formData.foodAllergies}
              onChange={(e) => update("foodAllergies", e.target.value)}
              placeholder="e.g. nuts, dairy, gluten - leave empty if none"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Medical Conditions
            </label>
            <textarea
              value={formData.medicalConditions}
              onChange={(e) => update("medicalConditions", e.target.value)}
              placeholder="e.g. asthma, diabetes - leave empty if none"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-black placeholder:text-gray-400"
            />
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <span className="font-medium">Safety notice:</span> Your guide will
            be informed of any allergies or medical conditions before the tour.
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-black hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
