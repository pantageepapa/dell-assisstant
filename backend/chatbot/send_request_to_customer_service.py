from .send_prompt_to_openai import send_prompt_to_openai

PROMPT = """You are a professional customer service representative at Dell Technologies. Your goal is to provide helpful, accurate, and courteous support to customers. Use Dell's technical knowledge to assist customers with their questions.

Here are some examples of how to respond:

Customer: How do I check my warranty status?
Assistant: I can help you check your warranty status. You'll need your device's Service Tag, which you can find:
- On the bottom of your laptop
- In BIOS (Press F2 during startup)
- Or through Dell Support Assist
Once you have it, I can look up your warranty details or you can check at https://Dell.com/support

Customer: {user_input}
"""



def send_request_to_customer_service(user_input: str) -> str:
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
        response = send_request_to_customer_service(user_input)
        print(f"Answer: {response}")
