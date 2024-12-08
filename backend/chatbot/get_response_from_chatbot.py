from .classify_user_request import classify_user_request
from .send_request_to_customer_service import send_request_to_customer_service
from .send_request_to_irrelevant import send_request_to_irrelevant
from .send_request_to_startup_event import send_request_to_startup_event
from .classify_industry_of_company import classify_industry_of_company
from .service_type import (
    GENERAL,
    NOT_RELEVANT,
    SCHEDULING,
    STARTUP_EVENT,
)

from crawler.company_dataclass import CompanyData


def get_response_from_chatbot(user_input: str, company: CompanyData = None) -> str:
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
    elif category == SCHEDULING:
        if company:
            # If the company is provided, classify the industry
            response = classify_industry_of_company(company=company)
        else:
            # Otherwise, return a general response
            response = "General"
    elif category == NOT_RELEVANT:
        response = send_request_to_irrelevant(user_input=user_input)
    else:
        response = "Sorry, I don't understand. Please try again."

    print(f"Response: {response}")
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
