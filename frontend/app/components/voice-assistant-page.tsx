import React, { useState, useEffect, useRef } from 'react';
import AudioVisualizer from './audio-visualizer';
import Image from 'next/image';
import { IoIosMic } from "react-icons/io";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import axios from 'axios';

const VoiceAssistantPage: React.FC = () => {
  const [status, setStatus] = useState<'welcome' | 'idle' | 'listening' | 'speaking'>('welcome');
  const [timer, setTimer] = useState<number>(0); // Timer state for the recording
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Using useRef for intervalId

  useEffect(() => {
    if (status === 'listening') {
      // Start timer when recording starts
      if (!intervalId.current) {  // Prevent setting multiple intervals
        intervalId.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
      }
    } else if (status === 'speaking') {
      // Clear timer when recording stops
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null; // Reset intervalId
      }
      setTimer(0); // Reset timer
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current); // Clean up the interval on unmount
        intervalId.current = null; // Reset intervalId
      }
    };
  }, [status]); // Depend on 'status' only

  const handleRecordClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the click from propagating

    console.log("Current status:", status);  // Log the current status to ensure it's what you expect

    if (status === 'welcome' || status === 'idle') {
      setStatus('listening');
      try {
        await axios.get('http://localhost:8000/chat/mic'); // Start recording API call
        setTimeout(() => setStatus('speaking'), 2000); // Simulate a 1-second delay
      } catch (error) {
        console.error('Error starting the recording:', error);
      }
    } else if (status === 'listening') {
      setStatus('speaking');
    } else if (status === 'speaking') {
      setStatus('idle');
    }
  };

  
  return (
    <div className="relative w-full h-screen overflow-hidden rounded-lg">
      {/* Background Image with Rounded Corners */}
      <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden z-0">
        <Image
          src="/images/Background.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
        {/* Dark Overlay for the Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
      </div>

      {/* Only show Audio Visualizer when speaking */}
      {status === 'speaking' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <AudioVisualizer />
        </div>
      )}

      {/* Centered Avatar Image */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <Image
          src="/images/Avatar.png"
          alt="Avatar"
          width={255}
          height={255}
          className="rounded-full"
        />
      </div>

      {/* Centered Text Beneath the Circle */}
      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 text-white text-center z-30">
        <p className="text-2xl font-bold">Adell</p>
        <p className="text-lg font-medium">Professional Voice Assistant</p>
      </div>

      {/* Status Display and Record Button Side by Side */}
      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-30">
        {/* Status Display */}
        <div className="text-white text-xl">
          {status === 'welcome' && 'Start the conversation with Adell:'}
          {status === 'idle' && 'Continue the conversation:'}
          {status === 'listening' && `Listening... (${timer}s)`}
          {status === 'speaking' && 'Speaking...'}
        </div>

        {/* Record Button */}
        <div>
          <button
            onClick={handleRecordClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition duration-300 
              ${status === 'listening' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400'}`}
          >
            {status === 'listening' ? (
              <IoIosMic size={24} color='white' />
            // ) : status === 'thinking' ? (
            //   <IoIosMicOff size={24} color='white' />
            ) : status === 'speaking' ? (
              <HiMiniSpeakerWave size={24} color='white' />
            ) : (
              <IoIosMic size={24} color='white' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
