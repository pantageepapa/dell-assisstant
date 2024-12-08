import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agent import Agent

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
open('message_history.txt', 'w').close()


@app.get("/chat/text")
async def chat(message: str):
    start = time.time()
    response = agent.conversation_cycle(message)
    duration = time.time() - start
    return {"response": response, "duration": duration}

@app.get("/chat/mic")
async def chat_mic():
    start = time.time()
    response = agent.conversation_cycle()
    duration = time.time() - start
    return {"response": response, "duration": duration}


