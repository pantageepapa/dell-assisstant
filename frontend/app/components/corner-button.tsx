import React, { ReactNode } from 'react';
import { RiChatAiFill, RiCloseCircleFill } from 'react-icons/ri';

const CornerButton = ({ isExpanded, onClick, onCloseClick, children }: {
  isExpanded: boolean;
  onClick: () => void;
  onCloseClick: () => void;  // Added for close button click handler
  children?: ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick from triggering
    onClick(); // Trigger the onClick when the button is clicked
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick from triggering
    onCloseClick(); // Close when the close button inside expanded state is clicked
  };

  return (
    <div
      className={`fixed bottom-10 right-10 transition-all duration-500 ease-in-out transform origin-bottom-right
        ${isExpanded ? 'w-[94vw] h-[90vh] rounded-lg' : 'w-20 h-20 rounded-[50%]'}
        bg-blue-500 flex items-center justify-center cursor-pointer`}
      onClick={handleClick} // Only collapse when clicking the button itself
      role="button"
      tabIndex={0}
      aria-label={isExpanded ? 'Collapse Chat' : 'Expand Chat'}
    >
      {!isExpanded ? (
        <RiChatAiFill size={40} color="white" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {children}

          <button
            className="absolute bottom-4 right-4"
            onClick={handleCloseClick} // Close the expanded state when the close button is clicked
            aria-label="Close Chat"
            role="button"
            tabIndex={0}
          >
            <RiCloseCircleFill size={40} color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CornerButton;
