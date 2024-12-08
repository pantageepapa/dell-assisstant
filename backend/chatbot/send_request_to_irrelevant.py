from .send_prompt_to_openai import send_prompt_to_openai

PROMPT: str = (
    "You are a chatbot at DELL startup program but the customer asked an irrelevant question: {user_input}. "
    "Help the customer to get back to questions related to the DELL startup program."
    "Refer to chat history to guide the user to alternative questions"
    "Chat history: {message_history}"
    "User Input: {user_input}"
)


def send_request_to_irrelevant(user_input: str, message_history: str) -> str:
    """
    Send a user request to the customer service chatbot and get a response.

    Args:
        message_history:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    formatted_prompt = PROMPT.format(user_input=user_input, message_history=message_history)

    # Get response from OpenAI
    response: str = send_prompt_to_openai(prompt=formatted_prompt)

    return response


