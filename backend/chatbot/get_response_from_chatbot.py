from backend.chatbot.send_prompt_to_openai import send_prompt_to_openai
from .classify_user_request import classify_user_request
from .send_request_to_customer_service import send_request_to_customer_service
from .send_request_to_startup_event import send_request_to_startup_event
from .send_request_to_technical_support import send_request_to_technical_support
from .send_request_to_irrelevant import send_request_to_irrelevant

from .service_type import (
    GENERAL,
    NOT_RELEVANT,
    SCHEDULING,
    STARTUP_EVENT,
    TECHNICAL_SUPPORT,
)


def get_response_from_chatbot(user_input: str) -> str:
    """
    Get a response from the chatbot by sending a user input.

    Args:
        user_input (str): The user's input text to send to the chatbot

    Returns:
        str: The chatbot's response
    """
    # Classify the user input into a category
    print(f"Classifying user input: {user_input}")
    category: str = classify_user_request(user_input=user_input)
    print(f"Category: {category}")
    if category == GENERAL:
        response = send_request_to_customer_service(user_input=user_input)
    elif category == STARTUP_EVENT:
        response = send_request_to_startup_event(user_input=user_input)
    elif category == TECHNICAL_SUPPORT:
        response = send_request_to_technical_support(user_input=user_input)
    elif category == SCHEDULING:
        response = "Sure, let's schedule a meeting. When are you available?"
    elif category == NOT_RELEVANT:
        response = send_request_to_irrelevant(user_input=user_input)
    else:
        response = "Sorry, I don't understand. Please try again."

    return response


if __name__ == "__main__":
    # Test examples
    test_inputs = [
        "I need help with my computer",
        "When is the next startup meetup?",
        "My order hasn't arrived yet",
        "Can we schedule a meeting?",
        "I like pizza",
    ]

    for user_input in test_inputs:
        print(f"\nInput: {user_input}")
        response = get_response_from_chatbot(user_input)
        print(f"Answer: {response}")
