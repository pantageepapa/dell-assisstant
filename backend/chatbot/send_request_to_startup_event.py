from .send_prompt_to_openai import send_prompt_to_openai
import json

STARTUP_EVENTS = [
    {
        "event_name": "Dell Technologies Forum Munich 2024 | AI Tech Conference",
        "event_date": "2024-12-10",
        "event_location": "Munich, Germany",
        "event_description": "The Dell Technologies Forum, our most important technology conference, offers everything you need to leverage emerging trends of tomorrow and tap into new potential...",
        "event_link": "https://events.dell.com/d/0zq7wk?ref=eventscalendar&refID=DTeventscalendar",
    },
    {
        "event_name": "Maximize your SupportAssist for Business PCs Experience through our MasterClass",
        "event_date": "2025-01-21",
        "event_location": "Virtual",
        "event_description": "You've been asking and now it's here – our SupportAssist MasterClass! Go beyond a first-time setup and deep dive into our most impactful and valuable features.",
        "event_link": "https://events.dell.com/d/g1q38w?ref=eventscalendar&refID=DTeventscalendar",
    },
    {
        "event_name": "From Vision to Reality: Accelerating AI Success",
        "event_date": "2025-01-28",
        "event_location": "Virtual",
        "event_description": "",
        "event_link": "https://events.dell.com/d/j2qdk9?ref=eventscalendar&refID=DTeventscalendar",
    },
]

PROMPT: str = (
    "You are responsible for answering questions about startup events at DELL. Here are the upcoming events: {event_json}."
    "Help the customer by answering their question: {user_input}. Keep your response clear and concise."
    "Chat history: {message_history}"
    "User: {user_input}"
)


def send_request_to_startup_event(user_input: str, message_history) -> str:
    """
    Send a user request to the customer service chatbot and get a response.

    Args:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    formatted_prompt = PROMPT.format(
        user_input=user_input, event_json=json.dumps(STARTUP_EVENTS), message_history=message_history
    )
    print(formatted_prompt)
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
