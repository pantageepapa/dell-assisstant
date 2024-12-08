import React from 'react';

const AudioPlayer: React.FC = () => {
  return (
    <div>
      <h1>Test YouTube Video Embed</h1>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"  // Replace with the URL of your video
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default AudioPlayer;
