"use client";
import { PopupButton } from "react-calendly";
import Image from "next/image";
import { consultants } from "../data/consultants";
import { useEffect, useState } from "react";

export default function ConsultantsPage() {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootElement(document.body);
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
  };

  if (!rootElement) return null;

  return (
    <div
      className="max-w-4xl mx-auto p-4 overflow-y-auto h-full"
      onClick={handleButtonClick}
    >
      <h1 className="text-3xl text-white font-bold mb-6 mt-16">
        Meet Our Consultants
      </h1>
      {consultants.map((consultant) => (
        <div
          key={consultant.id}
          className="flex items-center gap-8 mb-8 p-6 border rounded-lg bg-white"
        >
          <Image
            src={consultant.imageUrl}
            alt={consultant.name}
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{consultant.name}</h2>
            <p className="text-xl text-black-600">{consultant.expertise}</p>
            <p className="text-gray-600">{consultant.bio}</p>
          </div>
          <div>
            <PopupButton
              url={consultant.calendlyUrl}
              rootElement={rootElement}
              text="Book Appointment"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
