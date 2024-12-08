"use client";
import { InlineWidget } from "react-calendly";
import { consultants } from "../data/consultants";
import Image from "next/image";

export default function ConsultantCalendar() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Book a Consultation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consultants.map((consultant) => (
          <div key={consultant.id} className="border p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={consultant.imageUrl}
                alt={consultant.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{consultant.name}</h2>
                <p className="text-gray-600">{consultant.expertise}</p>
              </div>
            </div>
            <div className="h-[600px]">
              <InlineWidget
                url={consultant.calendlyUrl}
                styles={{ height: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
