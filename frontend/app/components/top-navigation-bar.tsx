import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { FaKeyboard } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { Box } from '@mui/material';
import Image from 'next/image';

const TopNavigationBar = ({ onNavigationChange }: { onNavigationChange: (page: string) => void }) => {
  const [value, setValue] = React.useState('text');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onNavigationChange(newValue);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
      <BottomNavigation
        sx={{
          width: '100%',
          boxShadow: 10,
          position: 'relative',
          borderTopLeftRadius: '8px', // Only round top-left corner
          borderTopRightRadius: '8px', // Only round top-right corner
        }}
        value={value}
        onChange={handleChange}
        showLabels
        aria-label="Top navigation bar" // Accessibility improvement
      >
        <BottomNavigationAction
          label="Text Assistant"
          value="text"
          icon={<FaKeyboard />}
          aria-label="Text Assistant" // Accessibility: Added label for screen readers
        />
        <BottomNavigationAction
          label="Voice Assistant"
          value="voice"
          icon={<MdKeyboardVoice />}
          aria-label="Voice Assistant" // Accessibility: Added label for screen readers
        />
        <BottomNavigationAction
          label="Virtual Assistant"
          value="virtual"
          icon={<IoPersonCircle />}
          aria-label="Virtual Assistant" // Accessibility: Added label for screen readers
        />
      </BottomNavigation>

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1, // Make sure logo stays above navigation bar
        }}
      >
        <Image
          src="https://dellforstartups.com/hs-fs/hubfs/Logos/Dell%20Technologies%20Logo%20Blue%201.png?width=476&height=64&name=Dell%20Technologies%20Logo%20Blue%201.png"
          alt="Dell Technologies Logo"
          width={175}
          height={100}
        />
      </Box>
    </div>
  );
};

export default TopNavigationBar;
