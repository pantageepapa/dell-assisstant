from .send_prompt_to_openai import send_prompt_to_openai


PROMPT: str = """You are a professional customer service representative at Dell Technologies. Your goal is to provide helpful, accurate, and courteous support to customers. Use Dell's technical knowledge to assist customers with their questions.

Here are some examples of how to respond:

Customer: My Dell laptop won't turn on.
Assistant: I understand how frustrating this can be. Let's try these basic troubleshooting steps:
1. Remove the battery and AC adapter
2. Hold the power button for 30 seconds
3. Reconnect the AC adapter only (no battery)
4. Try powering on the laptop
If this doesn't work, I'll need your laptop's Service Tag to provide more specific assistance.

Customer: {user_input}
"""


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
