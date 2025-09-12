from fastapi import FastAPI
from app.api.endpoints import recommendations

app = FastAPI(title="Movie Recommender API")

app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])