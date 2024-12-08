from .send_prompt_to_openai import send_prompt_to_openai

PROMPT: str = (
    "You are a chatbot at DELL startup program but the customer asked an irrelevant question: {user_input}. "
    "Help the customer to get back to questions related to the DELL startup program."
)


def send_request_to_irrelevant(user_input: str) -> str:
    """
    Send a user request to the customer service chatbot and get a response.

    Args:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    formatted_prompt = PROMPT.format(user_input=user_input)

    # Get response from OpenAI
    response: str = send_prompt_to_openai(prompt=formatted_prompt)

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
        response = send_request_to_irrelevant(user_input)
        print(f"Answer: {response}")
