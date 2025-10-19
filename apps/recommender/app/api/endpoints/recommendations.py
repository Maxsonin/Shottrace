from fastapi import APIRouter, Query
from app.models.movie import MovieResponse, Movie
from app.services.movie_recommender import recommend_movies

router = APIRouter()

@router.post("/recommend", response_model=MovieResponse)
def recommend(data: Movie, top_k: int = Query(5, gt=0, description="Number of recommendations")):
    recommended_indices = recommend_movies(
        id=data.id,
        title=data.title,
        description=data.description,
        top_k=top_k
    )
    return {"recommended_indices": recommended_indices}
