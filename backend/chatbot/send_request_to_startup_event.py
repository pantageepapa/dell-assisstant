from .send_prompt_to_openai import send_prompt_to_openai
import json

STARTUP_EVENTS = [
    {
        "event_name": "Dell Technologies Forum München 2024 | KI-Tech-Konferenz",
        "event_date": "2024-01-15",
        "event_location": "Munich, Germany",
        "event_description": "Join us at the Dell Technologies Forum in Munich for a conference on AI technology.",
        "event_link": "https://events.dell.com/event/4e7da756-93a6-4809-8c56-8aa8d7bbc97c/summary?ref=eventscalendar&refID=DTeventscalendar",
    }
]
PROMPT: str = (
    "You are responsible for answering questions about startup events at DELL. Here are the upcoming events: {event_json}."
    "Help the customer by answering their question: {user_input}. Keep your response clear and concise."
)


def send_request_to_startup_event(user_input: str) -> str:
    """
    Send a user request to the customer service chatbot and get a response.

    Args:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    formatted_prompt = PROMPT.format(
        user_input=user_input, event_json=json.dumps(STARTUP_EVENTS)
    )
    # Get response from OpenAI
    response: str = send_prompt_to_openai(prompt=formatted_prompt)

    return response


if __name__ == "__main__":
    # Test examples
    test_inputs = [
        "When is the next startup meetup?",
    ]

    for user_input in test_inputs:
        print(f"\nInput: {user_input}")
        response = send_request_to_startup_event(user_input)
        print(f"Answer: {response}")
