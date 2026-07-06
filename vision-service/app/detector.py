"""Fase 2 (opcional): localizador de letrero previo al OCR.

MVP actual: no-op — se hace OCR sobre la foto completa (ver ocr.py).
Si en pruebas reales el OCR se confunde con otros carteles en la foto
(evacuación, extintores, etc.), reemplazar `detect_letrero` por un modelo
YOLOv8 entrenado (ver train/ y el checklist en el plan) que recorte la
región del letrero antes de pasarla a read_text().
"""

from app.schemas import BoundingBox


def detect_letrero(image_bytes: bytes) -> BoundingBox | None:
    return None
