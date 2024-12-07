import openai
from dotenv import load_dotenv
import os


# Load the OpenAI API key from the environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OpenAI API key not found in environment variables")


def send_prompt_to_openai(
    prompt: str, model: str = "gpt-4o-mini", temperature: float = 1.0
) -> str:
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
        )
        return response.choices[0].message["content"]
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    prompt = "What is the capital of France?"
    response = send_prompt_to_openai(prompt)
    print(response)
