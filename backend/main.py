from agent import Agent


def main():
    agent = Agent()

    agent.initialize(
        user_input_service="whisper",
        stt_duration=None,
        mic_index=None,
        chatbot_service="openai",
        chatbot_model=None,
        chatbot_temperature=None,
        personality_file=None,
        tts_service="elevenlabs",
        output_device=8,
        tts_voice="Rebecca - wide emotional range",
        tts_model=None,
    )

    while True:
        agent.conversation_cycle()


if __name__ == "__main__":
    main()
