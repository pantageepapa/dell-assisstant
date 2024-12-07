import dotenv
from fastapi import FastAPI

from waifu import Waifu

dotenv.load_dotenv()
app = FastAPI()

waifu = Waifu()

waifu.initialize(user_input_service='whisper',
                 stt_duration=None,
                 mic_index=None,

                 chatbot_service='openai',
                 chatbot_model=None,
                 chatbot_temperature=None,
                 personality_file=None,

                 tts_service='elevenlabs',
                 output_device=8,
                 tts_voice='Rebecca - wide emotional range',
                 tts_model=None
                 )


@app.get('/')
def index():
    return "Currently"

@app.get('/waifu/config')
def connect():
    return (f'stt_service: {waifu.user_input_service}'
            f'tts_service: {waifu.tts_service}'
            f'chatbot_service: {waifu.chatbot_service}')

@app.get('/waifu/generate/text')
def generate_text(text: str):
    return 'Work in progress'

