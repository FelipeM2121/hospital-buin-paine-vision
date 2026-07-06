from typing import Optional
from pydantic import BaseModel


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int


class RecintoMatch(BaseModel):
    recinto: str
    zona: str
    servicio: str
    piso: int


class RecognizeResponse(BaseModel):
    recinto: Optional[str] = None
    confidence: float
    raw_ocr_text: str
    bbox: Optional[BoundingBox] = None
    candidates: list[RecintoMatch] = []
