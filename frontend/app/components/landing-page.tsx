import React, { ReactNode } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  children: ReactNode;
}

const LandingPage: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      {/* Dell Technologies Logo */}
      <Image
        src="https://dellforstartups.com/hs-fs/hubfs/Logos/Dell%20Technologies%20Logo%20Blue%201.png?width=476&height=64&name=Dell%20Technologies%20Logo%20Blue%201.png"
        alt="Dell Technologies Logo"
        width={300}
        height={100}
        className="mb-8"
      ></Image>
      
      {children}
    </div>
  );
};

export default LandingPage;
