from .send_prompt_to_openai import send_prompt_to_openai
import json
from crawler.company_dataclass import CompanyData

OUTPUT_CATEGORIES: list = [
    "Design",
    "Healthcare",
    "Finance",
    "Technology",
    "General",
]
PROMPT: str = (
    f"Classify the following industry into one of these categories: {OUTPUT_CATEGORIES}. "
    "Industry: {industry} "
    'Return ONLY a JSON response in this exact format: {{"category": "category_name"}}. '
)


def process_raw_response(raw_response: str) -> str:
    try:
        # Try to parse the JSON response
        response = json.loads(raw_response)

        # Validate the response structure
        if not isinstance(response, dict) or "category" not in response:
            raise ValueError("Error: Invalid response structure")

        # Validate the category
        if response["category"] not in OUTPUT_CATEGORIES:
            raise ValueError("Error: Invalid category")

        return response["category"]

    except json.JSONDecodeError:
        print(f"response: {raw_response}")
        raise json.JSONDecodeError("Error: Invalid JSON response from OpenAI")


def classify_industry_of_company(company: CompanyData) -> str:
    """
    Classify a user request into one of the predefined categories.

    Args:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    formatted_prompt = PROMPT.format(industry=company.industries)
    print(f"formatted_prompt: {formatted_prompt}")
    # Get response from OpenAI
    raw_response = send_prompt_to_openai(prompt=formatted_prompt)

    # Process and validate the response
    response = process_raw_response(raw_response)

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
        response = classify_industry_of_company(user_input)
        print(f"Category: {response}")
