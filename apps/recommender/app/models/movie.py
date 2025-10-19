from pydantic import BaseModel
from typing import List

class Movie(BaseModel):
    id: int
    title: str
    description: str

class MovieResponse(BaseModel):
    recommended_indices: List[int]
