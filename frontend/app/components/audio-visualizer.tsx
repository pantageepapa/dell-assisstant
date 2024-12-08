import React, { useState, useRef, useEffect } from 'react';

const AudioVisualizer: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPlaying, setIsPlaying] = useState(false); // Track playback state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioFilePath = '/resources/output.mp3';

  useEffect(() => {
    const context = new (window.AudioContext || window.AudioContext)();
    setAudioContext(context);

    const fetchAudio = async () => {
      try {
        const response = await fetch(audioFilePath);
        if (!response.ok) {
          throw new Error('Failed to fetch audio file');
        }

        const arrayBuffer = await response.arrayBuffer();
        context.decodeAudioData(arrayBuffer, (buffer) => {
          setAudioBuffer(buffer);
        }, (error) => {
          console.error('Error decoding audio data:', error);
        });
      } catch (error) {
        console.error('Error loading audio file:', error);
      }
    };

    fetchAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    if (audioBuffer && audioContext) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      setAudioSource(source);

      source.start(0);
      setIsPlaying(true);

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
            const maxRadius = Math.min(width, height) / 5;
            const baseRadius = maxRadius / 0.925;

            canvasCtx.clearRect(0, 0, width, height);

            const barWidth = (2 * Math.PI) / bufferLength;
            let angle = 33.7;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = dataArray[i];
              const barLength = (barHeight / 255) * maxRadius;

              const xStart = centerX + baseRadius * Math.cos(angle);
              const yStart = centerY + baseRadius * Math.sin(angle);
              const xEnd = centerX + (baseRadius + barLength) * Math.cos(angle);
              const yEnd = centerY + (baseRadius + barLength) * Math.sin(angle);

              canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
              canvasCtx.lineWidth = 3;
              canvasCtx.beginPath();
              canvasCtx.moveTo(xStart, yStart);
              canvasCtx.lineTo(xEnd, yEnd);
              canvasCtx.stroke();

              angle += barWidth;
            }
          }
        }
      };
      draw();

      return () => {
        source.stop();
        setIsPlaying(false);
      };
    }
  }, [audioBuffer, audioContext]);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={600} />
    </div>
  );
};

export default AudioVisualizer;
