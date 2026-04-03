"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function SatisfactionPollWidget() {
  const [rating, setRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const historicalData = [
    { month: "Oct", avg: 3.8 },
    { month: "Nov", avg: 4.1 },
    { month: "Dec", avg: 3.9 },
    { month: "Jan", avg: 4.2 },
    { month: "Feb", avg: 4.0 },
    { month: "Mar", avg: 4.3 },
  ];

  const maxAvg = Math.max(...historicalData.map((d) => d.avg));

  const handleVote = (value: number) => {
    setRating(value);
    setHasVoted(true);
  };

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        Student Satisfaction
      </h2>

      {!hasVoted ? (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            How would you rate your overall satisfaction with the student council?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleVote(value)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  className={`h-8 w-8 ${
                    rating && value <= rating
                      ? "fill-[#F5C400] text-[#F5C400]"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating && (
            <p className="mt-2 text-sm text-[#2D7D32]">
              You rated {rating} star{rating !== 1 ? "s" : ""}. Thank you!
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-4 text-sm text-[#2D7D32] font-medium">
            Thank you for your feedback!
          </p>
          <div className="space-y-2">
            {historicalData.map((data) => (
              <div key={data.month} className="flex items-center gap-3">
                <span className="w-10 text-xs text-muted-foreground">
                  {data.month}
                </span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D7D32] rounded-full transition-all"
                    style={{
                      width: `${(data.avg / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">
                  {data.avg.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Monthly average satisfaction score
          </p>
        </div>
      )}
    </div>
  );
}