import time

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from agent import Agent
from chatbot.service_type import SCHEDULING
from crawler.get_company_data import get_company_data

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = Agent()

agent.initialize()

# Empty message_history.txt file
open("message_history.txt", "w").close()


def process_message(background_tasks: BackgroundTasks = None, message=None):
    start = time.time()
    response = agent.conversation_cycle(user_input=message)
    duration = time.time() - start
    if response != SCHEDULING and background_tasks is not None:
        background_tasks.add_task(agent.say, response)
    return {"response": response, "duration": duration}


@app.get("/chat/text")
async def chat(message: str):
    return process_message(message=message)


@app.get("/chat/mic")
async def chat_mic(background_tasks: BackgroundTasks):
    return process_message(background_tasks)


@app.post("/company")
async def company(company_name: str):
    agent.company_name = company_name
    agent.company = get_company_data(company_name)
    return {"company_name": company_name, "company": agent.company}

print('Server is running...')