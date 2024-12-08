from backend.crawler.company_dataclass import CompanyData
from backend.chatbot.send_prompt_to_openai import send_prompt_to_openai

PROMPT = """You are a professional customer service representative at Dell Technologies. Your goal is to provide helpful, accurate, and courteous support to customers regarding Dell's startup program. 
Use Dell's technical knowledge to assist customers with their questions. If the customer has supplied information about their startup, make sure to relate information with their company.

Here is some information on the startup program:
Dell works with accelerators, incubators, non-profits and organizations, supporting their startup communities with dedicated expertise through dedicated technology consultants and scalable solutions to ensure their business is always ready to grow

Up to 20% discount on Dell laptops, desktops, servers, monitors and accessories to help you save on your budget.our discounts are applicable on top, which means you can save extra on promotional offers.you will receive unique coupon codes that can be applied directly in our online store or by our dedicated contacts.

From inception to IPO, our highly skilled technology consultants help startups achieve more by providing end-to-end, scalable technology solutions. They understand startups, listen and get to know your business. They help you make decisions and implement your tech strategy in the short and long term.

92% of small business owners believe mentors have a direct impact on the growth and survival of their business. Start-ups have access to virtual mentoring by using our matching platform to connect with the most appropriate mentor to guide and listen to them along the way.Connect with Dell experts, our strategic partners and experienced entrepreneurs who can advise you on a variety of topics critical to your growth.

Dell will work closely with your organization to create a customized communications plan and develop a compelling roadmap for supporting your community through our exclusive benefits, marketing and events teams.

{customer_company}

Chat history: {message_history}

Answer the following question from the customer
Customer: {user_input}
"""

COMPANY_PROMPT = """Information about the customer:
The Customer has a startup called {company_name} that works in the {industry} sector.
The startup is located in {company_location} and has {company_employees} employees.
"""


def send_request_to_customer_service(user_input: str, message_history: str, company: CompanyData = None) -> str:
    """
    Send a user request to the customer service chatbot and get a response.

    Args:
        user_input (str): The user's input text to classify

    Returns:
        str: The classified category or error message
    """
    # Format the prompt with the user input
    if company:
        company_prompt = COMPANY_PROMPT.format(
            company_name=company.name,
            industry=company.industries,
            company_location=company.locations,
            company_employees=company.company_size,
        )
        formatted_prompt = PROMPT.format(user_input=user_input,customer_company=company_prompt, message_history=message_history)
    else:
        formatted_prompt = PROMPT.format(user_input=user_input,customer_company="", message_history=message_history)

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
