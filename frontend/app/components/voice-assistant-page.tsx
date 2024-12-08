import React, { useState } from 'react';

const VoiceAssistantPage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div>
      <h1>Voice Assistant</h1>
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {isListening && (
        <div>
          <p>Listening...</p>
          <button onClick={() => setIsRecording(!isRecording)}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {isRecording && <p>Recording...</p>}
        </div>
      )}
    </div>
  );
}

export default VoiceAssistantPage;