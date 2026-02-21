interface ItineraryEntry {
  day: number;
  timeLabel?: string;
  title: string;
  description: string;
}

export function TourItineraryTimeline({
  entries,
}: {
  entries: ItineraryEntry[];
}) {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />
      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.day} className="relative flex gap-4 pl-0">
            <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
              <div className="h-2 w-2 rounded-full bg-gray-600" />
            </div>
            <div className="min-w-0 flex-1 pb-6">
              <p className="text-sm font-medium text-gray-500">
                {entry.timeLabel ?? `Day ${entry.day}`}
              </p>
              <h4 className="mt-0.5 font-semibold text-black">{entry.title}</h4>
              <p className="mt-2 text-gray-600">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
