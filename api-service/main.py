from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PetSaathi Fast API Microservice")

# Allow Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3110", "http://localhost:3000", "http://127.0.0.1:3110"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PetSaathi FastAPI", "message": "FastAPI is running smoothly!"}

@app.post("/api/heavy-task")
def simulate_heavy_task(data: dict):
    # This is a placeholder for heavy AI or Data Processing tasks
    # Node.js will send requests here instead of blocking its own event loop
    return {"status": "success", "processed_data": data, "message": "Processed securely by Python"}

