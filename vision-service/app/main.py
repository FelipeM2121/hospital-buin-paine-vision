from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.detector import detect_letrero
from app.matcher import match_recinto
from app.ocr import read_text
from app.schemas import RecintoMatch, RecognizeResponse

app = FastAPI(title="Hospital Buin Paine - Vision Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recognize-recinto", response_model=RecognizeResponse)
async def recognize_recinto(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    image_bytes = await file.read()

    bbox = detect_letrero(image_bytes)
    ocr_text = read_text(image_bytes)
    matches = match_recinto(ocr_text)

    if not matches:
        return RecognizeResponse(recinto=None, confidence=0.0, raw_ocr_text=ocr_text, bbox=bbox, candidates=[])

    best, best_score = matches[0]
    candidates = [
        RecintoMatch(recinto=r["recinto"], zona=r["zona"], servicio=r["servicio"], piso=r["piso"])
        for r, _ in matches
    ]

    return RecognizeResponse(
        recinto=best["recinto"],
        confidence=best_score,
        raw_ocr_text=ocr_text,
        bbox=bbox,
        candidates=candidates,
    )
