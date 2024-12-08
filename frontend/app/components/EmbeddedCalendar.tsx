"use client";

import { InlineWidget } from "react-calendly";
import { consultants } from "../data/consultants";
import Image from "next/image";

interface EmbeddedCalendarProps {
  consultantId: number;
}

export default function EmbeddedCalendar({ consultantId }: EmbeddedCalendarProps) {
  const consultant = consultants.find(c => c.id === consultantId);

  if (!consultant) {
    return <div>Consultant not found</div>;
  }

  return (
    <div className="w-full max-w-full">
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="flex items-center gap-3 p-3 border-b">
          <Image
            src={consultant.imageUrl}
            alt={consultant.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold">{consultant.name}</h3>
            <p className="text-sm text-gray-600">{consultant.expertise}</p>
          </div>
        </div>
        <div className="h-[500px] w-full">
          <InlineWidget
            url={consultant.calendlyUrl}
            styles={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}