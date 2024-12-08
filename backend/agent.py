import json
from json import dump
from os import getenv

import openai
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
from dotenv import load_dotenv
from elevenlabs import generate, save, set_api_key

from chatbot.get_response_from_chatbot import get_response_from_chatbot
from crawler.company_dataclass import CompanyData


class Agent:
    def __init__(self):
        self.mic = None
        self.recogniser = None
        self.user_input_service = None
        self.user_output_service = None
        self.message_history = []
        self.tts_voice = "Rachel"  # Default voice
        self.tts_model = "eleven_monolingual_v1"  # Default model
        self.company_name = None
        self.company: CompanyData = None

    def initialize(
        self,
    ) -> None:
        """Initialize the agent with input and output services."""

        # Setup speech recognition if needed
        self.mic = sr.Microphone()
        self.recogniser = sr.Recognizer()

        # Setup ElevenLabs if needed
        load_dotenv()
        openai.api_key = getenv("OPENAI_API_KEY")
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

    def say(self, text: str) -> int:
        """Output text through selected service."""
        try:
            text = text.replace("*", "")
            # Handle ElevenLabs output
            print('Generating TTS...')
            audio = generate(text=text, voice=self.tts_voice, model=self.tts_model)
            save(audio, "../../public/resources/output.mp3")

            # Play the audio
            data, fs = sf.read("output.mp3")
            sd.play(data, fs)
            sd.wait()
        except Exception as e:
            print(f"TTS error: {e}")
            print("\n\33[7m" + "Assistant:" + "\33[0m" + f" {text}")

    def conversation_cycle(self, user_input=None, company_name=None) -> str:
        """Run one conversation cycle."""


        if user_input:
            response = get_response_from_chatbot(
                user_input=user_input, company=self.company, message_history=''.join(json.dumps(self.message_history))
            )

            self.message_history.append({"role": "user", "content": user_input})
            self.message_history.append({"role": "assistant", "content": response})
            return response

    def save_history(self) -> None:
        """Save conversation history to file."""
        with open("message_history.txt", "w") as f:
            dump(self.message_history, f)
