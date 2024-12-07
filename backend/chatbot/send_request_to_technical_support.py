from .send_prompt_to_openai import send_prompt_to_openai


PROMPT: str = (
    "You are responsible for answering questions regarding technical support about at DELL."
    "Help the customer by answering their question: {user_input}. Keep your response clear and concise."
)


def send_request_to_technical_support(user_input: str) -> str:
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
        "When is the next startup meetup?",
    ]

    for user_input in test_inputs:
        print(f"\nInput: {user_input}")
        response = send_request_to_technical_support(user_input)
        print(f"Answer: {response}")
