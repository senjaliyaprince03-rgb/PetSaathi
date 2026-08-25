from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI(title="PetSaathi Fast API Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchFactor(BaseModel):
    name: str
    score: float
    weight: float
    explanation: str

class MatchCandidate(BaseModel):
    sitterId: str
    sitterName: str
    totalScore: float
    rank: int
    factors: List[MatchFactor]
    requiresHumanApproval: bool
    approvalReasons: List[str]

class ScoreRequest(BaseModel):
    bookingId: str
    candidates: List[dict]
    riskReasons: List[str]

FACTOR_WEIGHTS = {
    "history": 0.30,
    "reliability": 0.25,
    "quality": 0.20,
    "locality": 0.15,
    "availability": 0.10,
}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PetSaathi FastAPI", "message": "FastAPI is running smoothly!"}

@app.post("/api/score-candidates", response_model=List[MatchCandidate])
def score_candidates(request: ScoreRequest):
    scored_candidates = []
    
    for c in request.candidates:
        factors = []
        approval_reasons = list(request.riskReasons)
        
        # 1. History
        history_score = min(c.get("completedWithPet", 0) / 10.0, 1.0)
        factors.append(MatchFactor(
            name="history",
            score=history_score,
            weight=FACTOR_WEIGHTS["history"],
            explanation=f"Completed {c.get('completedWithPet')} service(s) with this pet" if c.get("completedWithPet", 0) > 0 else "No prior history with this pet"
        ))
        
        # 2. Reliability
        rel_score = float(c.get("reliabilityScore", 50))
        rel_norm = min(rel_score / 100.0, 1.0)
        factors.append(MatchFactor(
            name="reliability",
            score=rel_norm,
            weight=FACTOR_WEIGHTS["reliability"],
            explanation=f"{rel_score}% reliability score" if c.get("reliabilityScore") else "Reliability data not yet available"
        ))
        
        # 3. Quality
        ratings = c.get("ratings", [])
        avg_rating = sum(ratings) / len(ratings) if ratings else 3.0
        quality_score = (avg_rating - 1) / 4.0
        factors.append(MatchFactor(
            name="quality",
            score=quality_score,
            weight=FACTOR_WEIGHTS["quality"],
            explanation=f"{avg_rating:.1f} avg rating from {len(ratings)} review(s)" if ratings else "No reviews yet"
        ))
        
        # 4. Locality
        locality_score = float(c.get("localityScore", 0))
        locality_explanation = c.get("localityExplanation", "")
        if locality_score < 1.0:
            approval_reasons.append(locality_explanation)
            
        factors.append(MatchFactor(
            name="locality",
            score=locality_score,
            weight=FACTOR_WEIGHTS["locality"],
            explanation=locality_explanation
        ))
        
        # 5. Availability
        factors.append(MatchFactor(
            name="availability",
            score=float(c.get("availabilityScore", 0)),
            weight=FACTOR_WEIGHTS["availability"],
            explanation=c.get("availabilityExplanation", "")
        ))
        
        total_score = sum(f.score * f.weight for f in factors)
        
        scored_candidates.append(MatchCandidate(
            sitterId=c.get("sitterId"),
            sitterName=c.get("sitterName"),
            totalScore=total_score,
            rank=0,
            factors=factors,
            requiresHumanApproval=len(approval_reasons) > 0,
            approvalReasons=approval_reasons
        ))
        
    # Sort descending by totalScore, then sitterId
    scored_candidates.sort(key=lambda x: (-x.totalScore, x.sitterId))
    
    # Assign ranks
    for i, c in enumerate(scored_candidates):
        c.rank = i + 1
        
    return scored_candidates
