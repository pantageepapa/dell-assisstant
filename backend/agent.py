import openai
import speech_recognition as sr
from elevenlabs import generate, save, set_api_key
import sounddevice as sd
import soundfile as sf
from dotenv import load_dotenv
from os import getenv
from json import dump


class Agent:
    def __init__(self):
        self.mic = None
        self.recogniser = None
        self.user_input_service = None
        self.user_output_service = None
        self.message_history = []
        self.tts_voice = "Rachel"  # Default voice
        self.tts_model = "eleven_monolingual_v1"  # Default model

    def initialize(
            self,
    ) -> None:
        """Initialize the agent with input and output services."""

        # Setup speech recognition if needed
        self.mic = sr.Microphone()
        self.recogniser = sr.Recognizer()

        # Setup ElevenLabs if needed
        load_dotenv()
        set_api_key(getenv("ELEVENLABS_API_KEY"))

    def get_user_input_mic(self) -> str:
        """Get user input through selected service."""

        # Handle speech input with Whisper
        with self.mic as source:
            print("(Start listening)")
            self.recogniser.adjust_for_ambient_noise(source, duration=0.5)
            audio = self.recogniser.listen(source)
            print("(Stop listening)")

            try:
                with open("speech.wav", "wb") as f:
                    f.write(audio.get_wav_data())
                with open("speech.wav", "rb") as audio_file:
                    return openai.Audio.transcribe("whisper-1", audio_file)["text"]
            except Exception as e:
                print(f"Error: {e}")
                return ""

    def say(self, text: str) -> None:
        """Output text through selected service."""
        try:
            if self.user_output_service == "console":
                print("\n\33[7m" + "Assistant:" + "\33[0m" + f" {text}")
                return

            # Handle ElevenLabs output
            audio = generate(text=text, voice=self.tts_voice, model=self.tts_model)
            save(audio, "output.mp3")

            # Play the audio
            data, fs = sf.read("output.mp3")
            sd.play(data, fs)
            sd.wait()
        except Exception as e:
            print(f"TTS error: {e}")
            print("\n\33[7m" + "Assistant:" + "\33[0m" + f" {text}")

    def conversation_cycle(self, user_input=None) -> str:
        """Run one conversation cycle."""
        from chatbot.get_response_from_chatbot import get_response_from_chatbot

        if user_input is None:
            user_input = self.get_user_input_mic()
        self.message_history.append({"role": "user", "content": user_input})

        if user_input:
            response = get_response_from_chatbot(user_input)
            self.say(response)
            self.message_history.append({"role": "assistant", "content": response})
            return response

    def save_history(self) -> None:
        """Save conversation history to file."""
        with open("message_history.txt", "w") as f:
            dump(self.message_history, f)


def main():
    agent = Agent()
    agent.initialize(
        user_input_service="console",  # or "console"
        user_output_service="console",  # or "console"
    )

    try:
        while True:
            agent.conversation_cycle()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        agent.save_history()


if __name__ == "__main__":
    main()
