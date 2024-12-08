import React, { useState, useRef, useEffect } from 'react';

const AudioVisualizer: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  useEffect(() => {
    if (audioFile) {
      // Create a new AudioContext when a file is selected
      const context = new (window.AudioContext || window.AudioContext)();
      setAudioContext(context);

      // Create a file reader to read the audio file
      const reader = new FileReader();
      reader.onload = () => {
        context.decodeAudioData(reader.result as ArrayBuffer, (buffer) => {
          setAudioBuffer(buffer);
        });
      };
      reader.readAsArrayBuffer(audioFile);
    }
  }, [audioFile]);

  useEffect(() => {
    if (audioBuffer && audioContext) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // FFT size for frequency domain analysis
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Draw the audio visualizer
      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        const canvas = canvasRef.current;
        if (canvas) {
          const canvasCtx = canvas.getContext('2d');
          if (canvasCtx) {
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(width, height) / 3; // Max radius for the bars
            const baseRadius = maxRadius / 2; // Starting radius for bars

            canvasCtx.clearRect(0, 0, width, height);

            const barWidth = (2 * Math.PI) / bufferLength; // Angular width of each bar
            let angle = 33.7; // Initial angle

            // Draw the bars along the circular path
            for (let i = 0; i < bufferLength; i++) {
              const barHeight = dataArray[i];

              // Calculate the bar's length based on frequency data
              const barLength = (barHeight / 255) * maxRadius; // Normalize bar height to fit within the max radius

              // Calculate the position of the bar using polar coordinates starting at baseRadius
              const xStart = centerX + baseRadius * Math.cos(angle);
              const yStart = centerY + baseRadius * Math.sin(angle);
              const xEnd = centerX + (baseRadius + barLength) * Math.cos(angle);
              const yEnd = centerY + (baseRadius + barLength) * Math.sin(angle);

              // Adjust the bar color based on frequency data
              canvasCtx.strokeStyle = `rgb(${barHeight + 100}, 50, 50)`; // Color of the bars
              canvasCtx.lineWidth = 2; // Line width for bars
              canvasCtx.beginPath();
              canvasCtx.moveTo(xStart, yStart); // Start from the base radius circle
              canvasCtx.lineTo(xEnd, yEnd); // End at the extended bar length
              canvasCtx.stroke();

              // Move to the next angle for the next bar
              angle += barWidth;
            }
          }
        }
      };

      source.start(0);
      draw();
    }
  }, [audioBuffer, audioContext]);

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <canvas ref={canvasRef} width={600} height={600} />
    </div>
  );
};

export default AudioVisualizer;
